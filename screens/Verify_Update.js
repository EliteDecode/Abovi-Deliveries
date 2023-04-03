import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  SafeAreaView,
  Image,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { Formik } from "formik";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { ActivityIndicator, Avatar, Stack } from "@react-native-material/core";
import { Button, TextInput as Input } from "@react-native-material/core";
import arrowImg from "../assets/arrow-right.png";
import arrow from "../assets/left-arrowb.png";
import logout from "../assets/logout.png";
import authService from "../utils/Api";
import { useGlobalContext } from "../utils/Context";
import ProfileHead from "../components/ProfileHead";
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from "react-native-confirmation-code-field";
const CELL_COUNT = 5;
const Update_Password = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [data, setData] = useState(null);
  const { Verify_update } = useGlobalContext();
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState("");
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  useEffect(() => {
    async function fetchStoredData() {
      try {
        const dataX = await AsyncStorage.getItem("userData");
        setData(JSON.parse(dataX));
      } catch (error) {}
    }

    fetchStoredData();
  }, []);

  const Verification_details = {
    userId: route?.params?.data?.user?._id,
    uniqueString: value,
    Address: route?.params?.data?.user?.Address,
    Firstname: route?.params?.data?.user?.Firstname,
    Lastname: route?.params?.data?.user?.Lastname,
    Phone: route?.params?.data?.user?.Phone,
    Email: route?.params?.NewEmail,
  };
  const handleVerify = () => {
    setLoading(true);
    Verify_update(Verification_details).then((data) => {
      if (data.message === "verified") {
        setLoading(false);
        navigation.replace("Account", data);
      } else {
        setLoading(false);
        setValue("");
        Alert.alert("Opps", `${data}`, [
          {
            text: "Cancel",
            onPress: () => console.log(""),
            style: "cancel",
          },
          { text: "OK", onPress: () => console.log("") },
        ]);
      }
    });
  };

  const handleLogout = async () => {
    Alert.alert(`Hey ${data?.data?.Lastname} `, `You are logging out? 😫`, [
      {
        text: "Cancel",
        onPress: () => console.log(""),
        style: "cancel",
      },
      {
        text: "Logout",
        onPress: () =>
          authService.logout().then(() => {
            navigation.replace("Login");
          }),
      },
    ]);
  };

  const MyStatusBar = ({ backgroundColor, ...props }) => (
    <View style={[styles.statusBar, { backgroundColor }]}>
      <SafeAreaView>
        <StatusBar translucent backgroundColor={backgroundColor} {...props} />
      </SafeAreaView>
    </View>
  );

  return (
    <View className="flex-1 bg-[#fafafa]" softwareKeyboardLayoutMode="pan">
      <MyStatusBar backgroundColor="#1C44A6" barStyle="light-content" />

      <ScrollView className=" flex-1  mt-5">
        <View className="flex-row justify-between items-center px-5">
          <TouchableOpacity onPress={() => navigation.navigate("Account")}>
            <Image source={arrow} className="w-6 h-6" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Text className="text-[17px] font-semibold">Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLogout}>
            <Image source={logout} className="w-6 h-6" />
          </TouchableOpacity>
        </View>
        <ProfileHead data={data} />

        {/* Profile form */}
        <View className="px-5 mt-5 py-1">
          <View>
            <Text className="text-[26px] font-bold">Verify Your Email</Text>
            <Text className="mt-2 text-[13px] opacity-75">
              A 5 digit password code has been sent to{" "}
              {route?.params?.NewEmail.toLowerCase()}, please enter the code
              here
            </Text>

            <CodeField
              ref={ref}
              {...props}
              // Use `caretHidden={false}` when users can't paste a text value, because context menu doesn't appear
              value={value}
              onChangeText={setValue}
              cellCount={CELL_COUNT}
              rootStyle={styles.codeFieldRoot}
              keyboardType="number-pad"
              textContentType="oneTimeCode"
              renderCell={({ index, symbol, isFocused }) => (
                <Text
                  key={index}
                  style={[styles.cell, isFocused && styles.focusCell]}
                  onLayout={getCellOnLayoutHandler(index)}
                >
                  {symbol || (isFocused ? <Cursor /> : null)}
                </Text>
              )}
            />
            <View className=" mt-5 flex-row space-x-3">
              {loading ? (
                <Button
                  title="Verifying.."
                  color="#1C44A6"
                  disabled
                  style={{ width: "100%", marginTop: 10 }}
                  trailing={(props) => (
                    <ActivityIndicator size="small" color="#fff" />
                  )}
                />
              ) : (
                <Button
                  onPress={handleVerify}
                  title="Verify"
                  color="#1C44A6"
                  style={{ width: "100%", marginTop: 10 }}
                  trailing={(props) => (
                    <Image source={arrowImg} className="w-3 h-3" />
                  )}
                />
              )}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const STATUSBAR_HEIGHT = StatusBar.currentHeight;

const styles = StyleSheet.create({
  statusBar: {
    height: STATUSBAR_HEIGHT,
  },
  input: {
    height: 50,
    borderWidth: 0.5,
    borderBottomColor: "#1C44A6",
    borderColor: "transparent",
    fontWeight: 600,
  },

  labelStyle: {
    fontWeight: "bold",
  },
  root: { flex: 1 },
  title: { textAlign: "center", fontSize: 30 },
  codeFieldRoot: { marginTop: 20, paddingHorizontal: 0 },
  cell: {
    width: 40,
    height: 40,
    lineHeight: 38,
    fontSize: 24,
    borderWidth: 2,
    borderColor: "#00000030",
    textAlign: "center",
    marginHorizontal: 0,
  },
  focusCell: {
    borderColor: "#000",
  },
});
export default Update_Password;
