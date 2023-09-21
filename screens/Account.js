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
import {
  ActivityIndicator,
  Button,
  TextInput as Input,
} from "@react-native-material/core";
import { Formik } from "formik";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useLayoutEffect, Effect, useState, useEffect } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { TextInput } from "react-native-element-textinput";
import logout from "../assets/logout.png";
import authService from "../utils/Api";
import { updateSchema } from "../utils/Schemas";
import { useGlobalContext } from "../utils/Context";
import arrow from "../assets/left-arrowb.png";
import arrowImg from "../assets/arrow-right.png";
import deleteImg from "../assets/delete.png";
import ProfileHead from "../components/ProfileHead";
import axios from "axios";

const Account = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);

  const Home = route?.params === "agentData" ? "Agent_Home" : "Home";

  const {
    Phone,
    Email,
    Firstname,
    Lastname,
    Address,
    PhoneAgent,
    EmailAgent,
    FirstnameAgent,
    LastnameAgent,
    AddressAgent,
    update,
    deleteAccount,
    handleLogoutAgent,
    handleLogout,
  } = useGlobalContext();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "",
      headerLeft: () => (
        <TouchableOpacity
          className="flex-row justify-between items-center space-x-2 px-5"
          onPress={() => navigation.navigate(Home)}
        >
          <View>
            <Image source={arrow} className="w-5 h-5" />
          </View>
          <View>
            <Text className="text-[14px] font-semibold">Profile</Text>
          </View>
        </TouchableOpacity>
      ),
      headerRight: () => (
        <View className="px-5">
          <TouchableOpacity onPress={LogoutUser}>
            <Image source={logout} className="w-5 h-5" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    async function fetchStoredData() {
      try {
        const dataX = await AsyncStorage.getItem(route?.params);
        setData(JSON.parse(dataX));
      } catch (error) {}
    }

    fetchStoredData();
  }, []);
  const LogoutUser = async () => {
    Alert.alert(`Hey ${data?.data?.Lastname} `, `You are logging out? 😫`, [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        onPress: () => {
          if (route?.params === "userData") {
            handleLogout().then(() => {
              navigation.replace("Welcome");
            });
          } else {
            handleLogoutAgent().then(() => {
              navigation.replace("Welcome");
            });
          }
        },
      },
    ]);
  };

  const handleDelete = async () => {
    const token = data?.data?.token;
    const id = data?.data?._id;
    Alert.alert(
      `Hey ${data?.data?.Lastname} `,
      `You are deleting your account? 😫`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () =>
            deleteAccount(id, token).then((data) => {
              if (data.message.includes("deleted")) {
                navigation.replace("Login");
              }
            }),
        },
      ]
    );
  };

  const MyStatusBar = ({ backgroundColor, ...props }) => (
    <View style={[styles.statusBar, { backgroundColor }]}>
      <SafeAreaView>
        <StatusBar translucent backgroundColor={backgroundColor} {...props} />
      </SafeAreaView>
    </View>
  );

  return (
    <View className="flex-1 bg-[#fff]" softwareKeyboardLayoutMode="pan">
      <ScrollView className=" flex-1  mt-5">
        <View className={`${Platform.OS === "ios" ? "mb-96" : "mb-48"}`}>
          <ProfileHead data={data} />
          {/* Profile form */}
          <View className="px-5 mt-5 py-1">
            <View>
              <Text className="text-[16px] font-bold">Personal Details</Text>
            </View>
            <Formik
              initialValues={{
                Email: route?.params === "userData" ? Email : EmailAgent,
                Firstname:
                  route?.params === "userData" ? Firstname : FirstnameAgent,
                Lastname:
                  route?.params === "userData" ? Lastname : LastnameAgent,
                Address: route?.params === "userData" ? Address : AddressAgent,
                Phone: route?.params === "userData" ? Phone : PhoneAgent,
              }}
              validationSchema={updateSchema}
              onSubmit={(values) => {
                setLoading(true);
                const token = data?.data?.token;
                const id = data?.data?._id;

                update(values, id, token).then((data) => {
                  setLoading(false);
                  if (data?.message?.includes("Congratulations")) {
                    Alert.alert(
                      "Congratulations",
                      `Data Updated Successfully`,
                      [
                        {
                          text: "Cancel",
                          style: "cancel",
                        },
                        {
                          text: "OK",
                          onPress: () => navigation.navigate("Home", "refresh"),
                        },
                      ]
                    );
                  } else if (
                    data?.message?.includes(
                      "Verification email sent successfully"
                    )
                  ) {
                    navigation.navigate("Verify_Update", {
                      data,
                      NewEmail: values.Email,
                    });
                  } else {
                    Alert.alert("Opps", `${data}`, [
                      {
                        text: "Cancel",
                        style: "cancel",
                      },
                      { text: "OK" },
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
                      Platform.OS === "ios" ? "mb-3" : "mb-3"
                    } realtive`}
                  >
                    <TextInput
                      label="Firstname"
                      style={styles.input}
                      labelStyle={styles.labelStyle}
                      className="w-12/12 mb-1"
                      onChangeText={handleChange("Firstname")}
                      onBlur={handleBlur("Firstname")}
                      value={values.Firstname}
                    />
                    <View className="relative">
                      {errors.Firstname && touched.Firstname ? (
                        <Text className="text-[13px] pl-0 absolute  text-red-500">
                          {errors.Firstname} (*)
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
                      label="Lastname"
                      style={styles.input}
                      labelStyle={styles.labelStyle}
                      className="w-12/12 mb-1"
                      onChangeText={handleChange("Lastname")}
                      onBlur={handleBlur("Lastname")}
                      value={values.Lastname}
                    />
                    <View className="relative">
                      {errors.Lastname && touched.Lastname ? (
                        <Text className="text-[13px] pl-0 absolute  text-red-500">
                          {errors.Lastname} (*)
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
                      label="Email"
                      style={styles.input}
                      labelStyle={styles.labelStyle}
                      className="w-12/12 mb-1"
                      onChangeText={handleChange("Email")}
                      onBlur={handleBlur("Email")}
                      value={values.Email}
                    />
                    <View className="relative">
                      {errors.Email && touched.Email ? (
                        <Text className="text-[13px] pl-0 absolute  text-red-500">
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
                      label="Address"
                      style={styles.input}
                      labelStyle={styles.labelStyle}
                      className="w-12/12 mb-1"
                      onChangeText={handleChange("Address")}
                      onBlur={handleBlur("Address")}
                      value={values.Address}
                    />
                    <View className="relative">
                      {errors.Address && touched.Address ? (
                        <Text className="text-[13px] pl-0 absolute  text-red-500">
                          {errors.Address} (*)
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
                      label="Phone Number"
                      style={styles.input}
                      labelStyle={styles.labelStyle}
                      className="w-12/12 mb-1"
                      onChangeText={handleChange("Phone")}
                      onBlur={handleBlur("Phone")}
                      value={values?.Phone?.toString()}
                    />
                    <View className="relative">
                      {errors.Phone && touched.Phone ? (
                        <Text className="text-[13px] pl-0 absolute  text-red-500">
                          {errors.Phone} (*)
                        </Text>
                      ) : null}
                    </View>
                  </View>
                  {route?.params === "userData" ? (
                    <View>
                      {loading ? (
                        <View className="flex-row space-x-1">
                          <Button
                            title="Please wait..."
                            color="#1C44A6"
                            tintColor="#fff"
                            titleStyle={{ fontSize: 11 }}
                            style={{
                              width: "50%",
                              marginTop: 10,
                              padding: 3,
                            }}
                            trailing={(props) => (
                              <ActivityIndicator size="small" color="#fff" />
                            )}
                            onPress={handleSubmit}
                          />
                          <Button
                            title="Update Password"
                            color="#1C44A6"
                            titleStyle={{ fontSize: 11 }}
                            tintColor="#fff"
                            style={{
                              width: "50%",
                              marginTop: 10,
                              padding: 2,
                            }}
                            onPress={() =>
                              navigation.navigate("Update_Password")
                            }
                          />
                        </View>
                      ) : (
                        <View className="flex-row space-x-1">
                          <Button
                            title="Update Profile"
                            color="#1C44A6"
                            titleStyle={{ fontSize: 11 }}
                            tintColor="#fff"
                            style={{
                              width: "50%",
                              marginTop: 10,
                              padding: 3,
                            }}
                            isSubmitting
                            onPress={handleSubmit}
                          />
                          <Button
                            title="Update Password"
                            color="#1C44A6"
                            titleStyle={{ fontSize: 11 }}
                            tintColor="#fff"
                            style={{
                              width: "50%",
                              marginTop: 10,
                              padding: 2,
                            }}
                            onPress={() =>
                              navigation.navigate("Update_Password")
                            }
                          />
                        </View>
                      )}
                    </View>
                  ) : (
                    ""
                  )}
                </>
              )}
            </Formik>
            {route?.params === "userData" && (
              <View>
                <Button
                  title="Delete Account"
                  color="#1C44A6"
                  titleStyle={{ fontSize: 11 }}
                  variant="outlined"
                  tintColor="#fff"
                  style={{
                    width: "100%",
                    marginTop: 10,

                    padding: 2,
                  }}
                  trailing={(props) => (
                    <Image source={deleteImg} className="w-5 h-5" />
                  )}
                  onPress={handleDelete}
                />
              </View>
            )}
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
    fontSize: 11,
  },
  placeholderStyle: {
    fontSize: 11,
  },

  labelStyle: {
    fontWeight: "bold",
    fontSize: 11,
  },
});
export default Account;
