import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { GestureHandlerRootView } from "react-native-gesture-handler";
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

const Stack = createStackNavigator();
const App = () => {
  const [firstLaunch, setFirstLaunch] = React.useState(null);
  const [storeData, setStoreData] = React.useState(null);
  const [loggedIn, setLoggedIn] = React.useState(storeData);
  const [agentData, setAgentData] = React.useState(null);
  const [agentLoggedIn, setAgentLoggedIn] = React.useState(agentData);
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

  return (
    firstLaunch != null && (
      <NavigationContainer>
        <ToastProvider>
          <AppProvider
            handleLogout={handleLogout}
            handleLogoutAgent={handleLogoutAgent}
          >
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              {firstLaunch && (
                <Stack.Screen name="Onboarding" component={Onboarding} />
              )}

              {!loggedIn && <Stack.Screen name="Welcome" component={Welcome} />}

              <Stack.Screen name="Home" component={Home} />

              <Stack.Screen name="Agent_Home" component={Agent_Home} />
              <Stack.Screen name="Register" component={Register} />
              <Stack.Screen
                name="Confirm_Register_code"
                component={Confirm_Code_Register}
              />
              <Stack.Screen name="Login" component={Login} />
              <Stack.Screen name="Agent_Login" component={Agent_Login} />
              <Stack.Screen name="Preform" component={PreChatForm} />
              <Stack.Screen name="Chat" component={Chat} />
              <Stack.Screen name="ChatRooms" component={ChatRooms} />
              <Stack.Screen name="Account" component={Account} />

              <Stack.Screen name="Transactions" component={Transactions} />
              <Stack.Screen
                name="InactiveTransactions"
                component={InactiveTransactions}
              />
              <Stack.Screen
                name="ActiveTransactions"
                component={ActiveTransactions}
              />

              <Stack.Screen
                name="Transaction_Details"
                component={Transaction_Details}
              />

              <Stack.Screen
                name="Update_Password"
                component={Update_Password}
              />
              <Stack.Screen
                name="Forgot_Password"
                component={Forget_Password}
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
