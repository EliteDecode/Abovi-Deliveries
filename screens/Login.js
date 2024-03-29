import {
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Alert,
} from "react-native";
import { Button, ActivityIndicator } from "@react-native-material/core";
import React, { useState } from "react";
import { Formik } from "formik";
import { TextInput } from "react-native-element-textinput";
import loginImg from "../assets/padlock.png";
import arrowImg from "../assets/arrow-right.png";
import arrowImg2 from "../assets/arrow-right-blue.png";
import waveTop from "../assets/waveTop.png";

import { useNavigation } from "@react-navigation/native";
import { LoginSchema } from "../utils/Schemas";
import { useGlobalContext } from "../utils/Context";
import authService from "../utils/Api";
import { useHeaderHeight } from "@react-navigation/elements";
import { ScrollView } from "react-native";
import { StatusBar } from "expo-status-bar";
const Login = ({ route }) => {
  const { userToken } = route.params;
  const height = useHeaderHeight();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  return (
    <ScrollView
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      className="flex-1 bg-[#fafafa] relative"
      softwareKeyboardLayoutMode="resizeMode"
    >
      <StatusBar style="auto" />
      <View className="mb-56">
        <View className=" mt-10 flex-1 z-10">
          <View className="pl-6 mt-10">
            <Text className="font-bold text-[24px]">ABOVIPH,</Text>
            <Text className="font-bold text-[24px]">Hi, Welcome back 🎉</Text>
            <Text className="text-[12px] opacity-90">
              Please provide your details to login.
            </Text>
          </View>
          <View className=" w-11/12 mt-5  bg-white rounded-r-full py-5 pr-12 pl-6 shadow-2xl relative">
            <Formik
              initialValues={{
                Email: "",
                Firstname: "",
                Lastname: "",
                Password: "",
                ConfirmPassword: "",
              }}
              validationSchema={LoginSchema}
              onSubmit={(values) => {
                setLoading(true);
                authService
                  .login({ ...values, Pushtoken: userToken })
                  .then((data) => {
                    if (data.message === "success") {
                      setLoading(false);
                      navigation.replace("Home", data);
                    } else {
                      setLoading(false);
                      Alert.alert("Opps", `${data}`, [
                        { text: "OK", onPress: () => console.log("") },
                      ]);
                    }
                  });
              }}
            >
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                errors,
                touched,
                values,
              }) => (
                <>
                  <View
                    className={`${
                      Platform.OS === "ios" ? "mb-3" : "mb-3"
                    } realtive`}
                  >
                    <TextInput
                      label="Email"
                      style={styles.input}
                      inputStyle={{ fontSize: 12 }}
                      labelStyle={styles.labelStyle}
                      className="w-11/12 mb-1"
                      onChangeText={handleChange("Email")}
                      onBlur={handleBlur("Email")}
                      value={values.Email}
                      showIcon={false}
                    />
                    <View className="relative">
                      {errors.Email && touched.Email ? (
                        <Text className="text-[11px] pl-3 absolute  text-red-500">
                          {errors.Email} (*)
                        </Text>
                      ) : null}
                    </View>
                  </View>
                  <View
                    className={`${
                      Platform.OS === "ios" ? "mb-3" : "mb-3"
                    } realtive`}
                  >
                    <TextInput
                      label="Password"
                      mode="password"
                      style={styles.input}
                      labelStyle={styles.labelStyle}
                      className="w-11/12 mb-1"
                      onChangeText={handleChange("Password")}
                      onBlur={handleBlur("Password")}
                      value={values.Password}
                    />
                    <View className="relative">
                      {errors.Password && touched.Password ? (
                        <Text className="text-[11px] pl-3 absolute  text-red-500">
                          {errors.Password} (*)
                        </Text>
                      ) : null}
                    </View>
                  </View>

                  {loading ? (
                    <Button
                      title="Please wait..."
                      color="#1C44A6"
                      tintColor="#fff"
                      titleStyle={{ fontSize: 12 }}
                      style={{
                        width: 150,
                        marginTop: 20,
                        marginLeft: 10,
                        padding: 1,
                      }}
                      trailing={(props) => (
                        <ActivityIndicator size="small" color="#fff" />
                      )}
                      onPress={handleSubmit}
                    />
                  ) : (
                    <Button
                      title="Login"
                      color="#1C44A6"
                      tintColor="#fff"
                      titleStyle={{ fontSize: 12 }}
                      style={{
                        width: 150,
                        marginTop: 20,
                        marginLeft: 10,
                        padding: 1,
                      }}
                      isSubmitting
                      trailing={(props) => (
                        <Image source={arrowImg} className="w-3 h-3" />
                      )}
                      onPress={handleSubmit}
                    />
                  )}
                </>
              )}
            </Formik>
            <View className="absolute -right-5 top-[50%]  p-2 rounded-full bg-[#1C44A6] shadow-2xl">
              <Image source={loginImg} className="w-5 h-5" />
            </View>
          </View>
          <TouchableOpacity
            className="mt-4 flex-row"
            onPress={() => navigation.navigate("Forgot_Password")}
          >
            <Text className="text-gray-600 text-[12px] left-5">
              Forgot Password?
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={` ${
              Platform.OS === "ios" ? "py-5" : "py-3"
            } w-5/12 mt-20  bg-white rounded-r-full  pr-12 pl-6 shadow-2xl flex-row items-center space-x-2`}
            onPress={() => navigation.replace("Register")}
          >
            <Text className="font-bold text-[16px]">Register</Text>
            <Image source={arrowImg2} className="w-6 h-6" />
          </TouchableOpacity>
        </View>
      </View>

      {/* <View className="absolute top-0 w-full z-0">
        <Image source={waveTop} className="w-full" />
      </View>
      <View
        className={`absolute  w-full ${
          Platform.OS === "ios" ? "-bottom-16" : "-bottom-16"
        }`}
      ></View> */}
    </ScrollView>
  );
};

export default Login;

const styles = StyleSheet.create({
  input: {
    height: 55,
    paddingHorizontal: 12,
    borderWidth: 0.5,
    borderBottomColor: "#DDDDDD",
    borderColor: "transparent",
    fontSize: 12,
  },

  labelStyle: {
    fontWeight: "bold",
    fontSize: 12,
  },
});
