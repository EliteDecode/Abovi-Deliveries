import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { Button, ActivityIndicator } from "@react-native-material/core";
import React, { useEffect, useState } from "react";
import { Formik } from "formik";
import { TextInput } from "react-native-element-textinput";
import loginImg from "../assets/padlock.png";
import arrowImg from "../assets/arrow-right.png";
import arrowImg2 from "../assets/arrow-right-orange.png";
import waveTop from "../assets/waveTop2.png";
import { useNavigation } from "@react-navigation/native";
import { SignupSchema } from "../utils/Schemas";
import { useGlobalContext } from "../utils/Context";
import authService from "../utils/Api";
const Register = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  return (
    <View className="flex-1 bg-[#fafafa] relative">
      <View
        className={`${Platform.OS === "ios" ? "mt-5" : "mt-2"}  flex-1 z-10`}
      >
        <View className="flex-row-reverse">
          <TouchableOpacity
            className={`${
              Platform.OS === "ios" ? "mb-0 py-5 " : "mb-4 py-3"
            } w-5/12 mt-10  bg-white rounded-l-full pr-12 pl-6 shadow-2xl flex-row items-center justify-between`}
            onPress={() => navigation.replace("Login")}
          >
            <Text className="font-bold text-[16px]">Login</Text>
            <Image source={arrowImg2} className="w-6 h-6" />
          </TouchableOpacity>
        </View>
        <View className="pl-6 ">
          <Text className="font-bold text-[24px]">ABOVIPH,</Text>
          <Text className="font-bold text-[24px]">Hi, Welcome 👋</Text>
          <Text className="text-[12px] opacity-90">
            Please provide your details to create an account
          </Text>
        </View>

        <View className=" w-11/12 mt-5  bg-white rounded-r-full py-5 pr-20 pl-6 shadow-2xl relative">
          <Formik
            initialValues={{
              Email: "",
              Firstname: "",
              Lastname: "",
              Password: "",
              ConfirmPassword: "",
            }}
            validationSchema={SignupSchema}
            onSubmit={(values) => {
              setLoading(true);
              authService.register(values).then((data) => {
                if (data.message === "Verification email sent successfully") {
                  setLoading(false);

                  navigation.replace("Confirm_Register_code", data);
                } else {
                  setLoading(false);
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
            }}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              errors,
              touched,
              values,
              isSubmitting,
            }) => (
              <>
                <View
                  className={`${
                    Platform.OS === "ios" ? "mb-4" : "mb-4"
                  } realtive`}
                >
                  <TextInput
                    label="Firstname"
                    style={styles.input}
                    inputStyle={{ fontSize: 12 }}
                    labelStyle={styles.labelStyle}
                    className="w-11/12 mb-1"
                    onChangeText={handleChange("Firstname")}
                    onBlur={handleBlur("Firstname")}
                    value={values.Firstname}
                    showIcon={false}
                  />
                  <View className="relative">
                    {errors.Firstname && touched.Firstname ? (
                      <Text className="text-[11px] pl-3 absolute  text-red-500">
                        {errors.Firstname} (*)
                      </Text>
                    ) : null}
                  </View>
                </View>
                <View
                  className={`${
                    Platform.OS === "ios" ? "mb-4" : "mb-4"
                  } realtive`}
                >
                  <TextInput
                    label="Lastname"
                    style={styles.input}
                    inputStyle={{ fontSize: 12 }}
                    labelStyle={styles.labelStyle}
                    className="w-11/12 mb-1"
                    onChangeText={handleChange("Lastname")}
                    onBlur={handleBlur("Lastname")}
                    value={values.Lastname}
                    showIcon={false}
                  />
                  <View className="relative">
                    {errors.Lastname && touched.Lastname ? (
                      <Text className="text-[11px] pl-3 absolute  text-red-500">
                        {errors.Lastname} (*)
                      </Text>
                    ) : null}
                  </View>
                </View>
                <View
                  className={`${
                    Platform.OS === "ios" ? "mb-4" : "mb-4"
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
                    Platform.OS === "ios" ? "mb-4" : "mb-4"
                  } realtive`}
                >
                  <TextInput
                    label="Password"
                    mode="password"
                    style={styles.input}
                    inputStyle={{ fontSize: 12 }}
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

                <View
                  className={`${
                    Platform.OS === "ios" ? "mb-4" : "mb-4"
                  } realtive`}
                >
                  <TextInput
                    label="Confirm Password"
                    mode="password"
                    style={styles.input}
                    inputStyle={{ fontSize: 12 }}
                    labelStyle={styles.labelStyle}
                    className="w-11/12 mb-1"
                    onChangeText={handleChange("ConfirmPassword")}
                    onBlur={handleBlur("ConfirmPassword")}
                    value={values.ConfirmPassword}
                  />
                  <View className="relative">
                    {errors.ConfirmPassword && touched.ConfirmPassword ? (
                      <Text className="text-[11px] pl-3 absolute  text-red-500">
                        {errors.ConfirmPassword} (*)
                      </Text>
                    ) : null}
                  </View>
                </View>

                {loading ? (
                  <Button
                    title="Please wait..."
                    color="#F3661E"
                    tintColor="#fff"
                    style={{
                      width: 150,
                      marginTop: 10,
                      padding: 1,
                      marginLeft: 10,
                    }}
                    titleStyle={{ fontSize: 12 }}
                    trailing={(props) => (
                      <ActivityIndicator size="small" color="#fff" />
                    )}
                    onPress={handleSubmit}
                  />
                ) : (
                  <Button
                    title="Register"
                    color="#F3661E"
                    tintColor="#fff"
                    style={{
                      width: 150,
                      marginTop: 10,
                      padding: 1,
                      marginLeft: 10,
                    }}
                    titleStyle={{ fontSize: 12 }}
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
          <View className="absolute -right-5 top-[50%]  p-2 rounded-full bg-[#F3661E] shadow-2xl">
            <Image source={loginImg} className="w-5 h-5" />
          </View>
        </View>
      </View>

      {/* <View
        className={`absolute w-full z-0 ${
          Platform.OS === "ios" ? "top-0" : "top-0"
        }`}
      >
        <Image source={waveTop} className="w-full" />
      </View> */}
      {/* <Image
        source={logo}
        className="h-[80px] w-[140px] absolute left-6 top-5"
        style={{ resizeMode: "contain" }}
      /> */}
    </View>
  );
};

export default Register;

const styles = StyleSheet.create({
  input: {
    height: 45,
    paddingHorizontal: 12,
    borderWidth: 0.5,
    borderBottomColor: "#DDDDDD",
    borderColor: "#fff",
  },

  labelStyle: {
    fontWeight: "bold",
    fontSize: 12,
  },
});
