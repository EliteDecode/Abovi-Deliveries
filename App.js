import React from "react";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as Notifications from "expo-notifications";
import Home from "./screens/Home";
import Onboarding from "./screens/Onboarding";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Login from "./screens/Login";
import Register from "./screens/Register";
import Confirm_Code_Register from "./screens/Confirm_Code_Register";
import PreChatForm from "./screens/PreChatForm";
import Chat from "./screens/Chat";
import Account from "./screens/Account";
import Transactions from "./screens/Transactions";
import Verify_Update from "./screens/Verify_Update";
import { AppProvider } from "./utils/Context";
import { ToastProvider } from "react-native-toast-notifications";
import Update_Password from "./screens/Update_Password";
import Forget_Password from "./screens/Forget_Password";
import Welcome from "./screens/Welcome";
import Agent_Login from "./screens/Agent_Login";
import Agent_Home from "./screens/Agent_Home";
import Transaction_Details from "./screens/Transaction_Details";
import ChatRooms from "./screens/ChatRooms";
import InactiveTransactions from "./screens/InactiveTransactions";
import ActiveTransactions from "./screens/ActiveTransactions";
import { useEffect } from "react";
import { useNotification } from "./utils/useNotifications";
import { useState } from "react";
import { useRef } from "react";
import * as Linking from "expo-linking";
const prefix = Linking.createURL("/");

const Stack = createStackNavigator();
const App = () => {
  const linking = {
    prefixes: [prefix],
    config: {
      screens: {
        InactiveTransactions: "InactiveTransactions",
        Agent_Login: "Agent_Login",
        Login: "Login",
        Home: "Home",
      },
    },
  };
  const [firstLaunch, setFirstLaunch] = React.useState(null);
  const [userToken, setUserToken] = useState("");
  const [notification, setNotification] = useState(false);
  const [storeData, setStoreData] = React.useState(null);
  const [loggedIn, setLoggedIn] = React.useState(storeData);
  const [agentData, setAgentData] = React.useState(null);
  const [agentLoggedIn, setAgentLoggedIn] = React.useState(agentData);
  const { registerForPushNotificationsAsync } = useNotification();
  const notificationListener = useRef();
  const responseListener = useRef();
  React.useEffect(() => {
    async function setData() {
      const appData = await AsyncStorage.getItem("appLaunched");
      const storeData = await AsyncStorage.getItem("userData");
      const agentData = await AsyncStorage.getItem("agentData");
      if (appData == null) {
        setFirstLaunch(true);
        AsyncStorage.setItem("appLaunched", "false");
      } else {
        setFirstLaunch(false);
      }

      if (storeData == null) {
        setLoggedIn(false);
        setStoreData(false);
      } else {
        setLoggedIn(true);
        setStoreData(true);
      }

      if (agentData == null) {
        setAgentLoggedIn(false);
        setAgentData(false);
      } else {
        setAgentLoggedIn(true);
        setAgentData(true);
      }
    }
    setData();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem("userData");
    setLoggedIn(false);
  };
  const handleLogoutAgent = async () => {
    await AsyncStorage.removeItem("agentData");
    setAgentLoggedIn(false);
  };

  useEffect(() => {
    registerForPushNotificationsAsync();
    const getTokenOfUser = async () => {
      token = (await Notifications.getExpoPushTokenAsync()).data;

      setUserToken(token);
    };

    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      }),
    });

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        if (
          response?.notification.request.content.data.type ===
          "transaction_customer"
        ) {
          storeData != null
            ? Linking.openURL(`${prefix}Home`)
            : Linking.openURL(`${prefix}Login`);
        } else if (
          response?.notification.request.content.data.type === "transaction"
        ) {
          agentData != null
            ? Linking.openURL(`${prefix}InactiveTransactions`)
            : Linking.openURL(`${prefix}Agent_Login`);
        }
      });

    getTokenOfUser();
    console.log(agentLoggedIn);

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  return (
    firstLaunch != null && (
      <NavigationContainer linking={linking}>
        <ToastProvider>
          <AppProvider
            handleLogout={handleLogout}
            handleLogoutAgent={handleLogoutAgent}
          >
            <Stack.Navigator>
              {firstLaunch && (
                <Stack.Screen
                  name="Onboarding"
                  component={Onboarding}
                  options={{ headerShown: false }}
                />
              )}

              {!loggedIn && (
                <Stack.Screen
                  name="Welcome"
                  component={Welcome}
                  options={{ headerShown: false }}
                />
              )}
              {/* {!agentLoggedIn && (
                <Stack.Screen
                  name="Welcome"
                  component={Welcome}
                  options={{ headerShown: false }}
                />
              )} */}

              <Stack.Screen
                name="Home"
                component={Home}
                options={{ headerShown: false }}
              />

              <Stack.Screen
                name="Agent_Home"
                component={Agent_Home}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Register"
                component={Register}
                options={{ headerShown: false }}
                initialParams={{ userToken }}
              />
              <Stack.Screen
                name="Confirm_Register_code"
                component={Confirm_Code_Register}
                options={{ headerShown: false }}
                initialParams={{ userToken }}
              />
              <Stack.Screen
                name="Login"
                component={Login}
                options={{ headerShown: false }}
                initialParams={{ userToken }}
              />
              <Stack.Screen
                name="Agent_Login"
                component={Agent_Login}
                options={{ headerShown: false }}
                initialParams={{ userToken }}
              />
              <Stack.Screen
                name="Preform"
                component={PreChatForm}
                options={{ headerShown: false }}
              />
              <Stack.Screen name="Chat" component={Chat} />
              <Stack.Screen
                name="ChatRooms"
                component={ChatRooms}
                options={{ headerShown: false }}
              />
              <Stack.Screen name="Account" component={Account} />

              <Stack.Screen
                name="Transactions"
                component={Transactions}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="InactiveTransactions"
                component={InactiveTransactions}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="ActiveTransactions"
                component={ActiveTransactions}
                options={{ headerShown: false }}
              />

              <Stack.Screen
                name="Transaction_Details"
                component={Transaction_Details}
                options={{ headerShown: false }}
              />

              <Stack.Screen
                name="Update_Password"
                component={Update_Password}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Forgot_Password"
                component={Forget_Password}
                options={{ headerShown: false }}
              />
              <Stack.Screen name="Verify_Update" component={Verify_Update} />
            </Stack.Navigator>
          </AppProvider>
        </ToastProvider>
      </NavigationContainer>
    )
  );
};

export default App;
