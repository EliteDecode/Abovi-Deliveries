import React, { useState } from "react";
import {
  Text,
  StyleSheet,
  View,
  Image,
  Alert,
  AsyncStorage,
} from "react-native";
import { ActivityIndicator, Button } from "@react-native-material/core";
import { TextInput } from "react-native-element-textinput";
import waveTop from "../assets/waveTop2.png";
import arrowImg from "../assets/arrow-right.png";
import { useNavigation, useRoute } from "@react-navigation/native";
import authService from "../utils/Api";
import { TouchableOpacity } from "react-native";
import * as yup from "yup";
import { useGlobalContext } from "../utils/Context";
import { ScrollView } from "react-native";
import { StatusBar } from "expo-status-bar";

const Forgot_Password = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [loadingSendCode, setLoadingSendCode] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const { forgotPassword } = useGlobalContext();

  const schema = yup.object().shape({
    em: yup.string().email("Invalid Email entered"),
  });

  const handleSend = () => {
   
    setLoading(true);
    forgotPassword(email).then((data) => {
      if (data.message === "success") {
        setLoading(false);
        Alert.alert(
          "Congratulations",
          `A new Password has been sent to ${email}`,
          [
            {
              text: "Cancel",
              style: "cancel",
            },
            {
              text: "OK",
              onPress: () => navigation.navigate("Login", data),
            },
          ]
        );
      } else {
        setLoading(false);
        Alert.alert("Opps", `${data}`, [{ text: "close" }]);
      }
    });
  };

  return (
    <ScrollView className="flex-1  relative" softwareKeyboardLayoutMode="pan">
      <StatusBar style="auto" />
      <View className="mb-56">
        <View className=" py-10 mx-2 rounded-md shadow-2xl bg-white mt-48">
          <View className="px-4">
            <Text className="font-bold text-[26px]">Recover Password</Text>
            <Text className=" text-[13px] opacity-75">
              Enter your email, a 7digit password would be sent to your email,
              protect or login to update the password
            </Text>
          </View>

          <View className="mt-5 px-4">
            <TextInput
              label="Email"
             
              style={styles.input}
              labelStyle={styles.labelStyle}
              className="w-12/12 mb-1"
              onChangeText={(text) => {
                setEmail(text);
              }}
              value={email}
            />
            <View className="relative">
              {error ? (
                <Text className="text-[13px]  absolute  text-red-500">
                  {error} (*)
                </Text>
              ) : null}
            </View>
          </View>

          <View className="px-10 mt-5 flex-row space-x-3">
            {loading ? (
              <Button
                title="Please wait..."
                color="#1C44A6"
                disabled
                style={{ width: "100%", marginTop: 10 }}
                trailing={(props) => (
                  <ActivityIndicator size="small" color="#fff" />
                )}
              />
            ) : (
              <Button
                onPress={handleSend}
                title="Send Password"
                color="#1C44A6"
                style={{ width: "100%", marginTop: 10 }}
                trailing={(props) => (
                  <Image source={arrowImg} className="w-3 h-3" />
                )}
              />
            )}
          </View>
        </View>
        {loadingSendCode ? (
          <TouchableOpacity
            className={` ${
              Platform.OS === "ios" ? "py-5" : "py-3"
            } w-5/12 mt-20  bg-[#F3661E] rounded-r-full  pr-12 pl-6 shadow-2xl flex-row items-center space-x-2`}
            onPress={handleResend}
          >
            <Text className="font-bold text-white text-[15px]">
              Please wait...
            </Text>
            <ActivityIndicator size="small" color="#fff" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            className={` ${
              Platform.OS === "ios" ? "py-5" : "py-3"
            } w-8/12 mt-20  bg-[#F3661E] rounded-r-full  pr-12 pl-6 shadow-2xl flex-row items-center space-x-2`}
            onPress={handleSend}
          >
            <Text className="font-bold text-white text-[15px]">
              Resend Password
            </Text>
            <Image source={arrowImg} className="w-4 h-4" />
          </TouchableOpacity>
        )}

        <View
          className={`absolute w-full ${
            Platform.OS === "ios" ? "top-0" : "top-0"
          }`}
        >
          <Image source={waveTop} className="w-full" />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
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
});
export default Forgot_Password;
