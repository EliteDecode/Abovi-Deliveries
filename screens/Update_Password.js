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
import { useNavigation } from "@react-navigation/native";
import {
  ActivityIndicator,
  Button,
  TextInput as Input,
} from "@react-native-material/core";
import { TextInput } from "react-native-element-textinput";
import arrow from "../assets/left-arrowb.png";
import logout from "../assets/logout.png";
import authService from "../utils/Api";
import { updatePasswordSchema, updateSchema } from "../utils/Schemas";
import { useGlobalContext } from "../utils/Context";
import arrowImg from "../assets/arrow-right.png";
import ProfileHead from "../components/ProfileHead";

const Update_Password = () => {
  const navigation = useNavigation();
  const [data, setData] = useState(null);
  const { updatePassword } = useGlobalContext();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchStoredData() {
      try {
        const dataX = await AsyncStorage.getItem("userData");
        setData(JSON.parse(dataX));
      } catch (error) {}
    }

    fetchStoredData();
  }, []);

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
        <View className="mb-56">
          <View className="flex-row justify-between items-center px-5">
            <TouchableOpacity onPress={() => navigation.navigate("Account")}>
              <Image source={arrow} className="w-5 h-5" />
            </TouchableOpacity>
            <TouchableOpacity>
              <Text className="text-[11px] font-semibold">Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleLogout}>
              <Image source={logout} className="w-5 h-5" />
            </TouchableOpacity>
          </View>
          <ProfileHead data={data} />

          {/* Profile form */}
          <View className="px-5 mt-5 py-1">
            <View>
              <Text className="text-[16px] font-bold">Reset Password</Text>
            </View>
            <Formik
              initialValues={{
                Password: "",
                NewPassword: "",
                ConfirmNewPassword: "",
              }}
              validationSchema={updatePasswordSchema}
              onSubmit={(values) => {
                const token = data?.data?.token;
                const id = data?.data?._id;
                setLoading(true);
                updatePassword(values, id, token).then((data) => {
                  if (data.message === "success") {
                    setLoading(false);
                    Alert.alert(
                      "Congratulations",
                      `Your Password has been updated successfully`,
                      [
                        {
                          text: "Cancel",
                          style: "cancel",
                        },
                        {
                          text: "OK",
                          onPress: () => navigation.replace("Account", data),
                        },
                      ]
                    );
                  } else {
                    setLoading(false);
                    Alert.alert("Opps", `${data}`, [{ text: "close" }]);
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
                      label="Password"
                      style={styles.input}
                      mode="password"
                      inputStyle={{ fontSize: 12 }}
                      labelStyle={styles.labelStyle}
                      className="w-12/12 mb-1"
                      onChangeText={handleChange("Password")}
                      onBlur={handleBlur("Password")}
                      value={values.Password}
                    />
                    <View className="relative">
                      {errors.Password && touched.Password ? (
                        <Text className="text-[11px] pl-0 absolute  text-red-500">
                          {errors.Password} (*)
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
                      label="New Password"
                      style={styles.input}
                      mode="password"
                      labelStyle={styles.labelStyle}
                      className="w-12/12 mb-1"
                      onChangeText={handleChange("NewPassword")}
                      onBlur={handleBlur("NewPassword")}
                      value={values.NewPassword}
                    />
                    <View className="relative">
                      {errors.NewPassword && touched.NewPassword ? (
                        <Text className="text-[11px] pl-0 absolute  text-red-500">
                          {errors.NewPassword} (*)
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
                      label="Confirm New Password"
                      style={styles.input}
                      mode="password"
                      labelStyle={styles.labelStyle}
                      className="w-12/12 mb-1"
                      onChangeText={handleChange("ConfirmNewPassword")}
                      onBlur={handleBlur("ConfirmNewPassword")}
                      value={values.ConfirmNewPassword}
                    />
                    <View className="relative">
                      {errors.ConfirmNewPassword &&
                      touched.ConfirmNewPassword ? (
                        <Text className="text-[11px] pl-0 absolute  text-red-500">
                          {errors.ConfirmNewPassword} (*)
                        </Text>
                      ) : null}
                    </View>
                  </View>

                  {loading ? (
                    <>
                      <Button
                        title="Please wait..."
                        color="#1C44A6"
                        tintColor="#fff"
                        style={{
                          width: "100%",
                          marginTop: 10,
                          padding: 2,
                        }}
                        trailing={(props) => (
                          <ActivityIndicator size="small" color="#fff" />
                        )}
                        onPress={handleSubmit}
                      />
                    </>
                  ) : (
                    <View className="flex-row space-x-1">
                      <Button
                        title="Update Password"
                        color="#1C44A6"
                        tintColor="#fff"
                        style={{
                          width: "100%",
                          marginTop: 10,
                          padding: 2,
                        }}
                        trailing={(props) => (
                          <Image source={arrowImg} className="w-3 h-3" />
                        )}
                        onPress={handleSubmit}
                      />
                    </View>
                  )}
                </>
              )}
            </Formik>
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
    fontSize: 12,
  },
});
export default Update_Password;
