import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Alert,
} from "react-native";
import { Button } from "@react-native-material/core";
import { TextInput } from "react-native-element-textinput";
import arrow from "../assets/backb.png";
import Tab from "../components/Tab";
import loginImg from "../assets/deliveryy.png";
import arrowImg from "../assets/arrow-right.png";
import { Formik } from "formik";
import { useNavigation, useRoute } from "@react-navigation/native";
import { productSchema } from "../utils/Schemas";
import io from "socket.io-client";
import { useGlobalContext } from "../utils/Context";
import camera from "../assets/camera.png";
import gallery from "../assets/gallery.png";
import * as ImagePicker from "expo-image-picker";
import { url } from "../utils/Api";
let socket;

const PreChatForm = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState();
  const route = useRoute();
  const navigation = useNavigation();
  const [image, setImage] = useState(null);

  useEffect(() => {
    socket = io(url, {
      transportOptions: {
        polling: {
          extraHeaders: {
            Authorization: `Bearer ${route?.params?.data?.token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      },
    });

    return () => {
      socket.disconnect();
    };
  }, [route]);

  // const pickImage = async () => {
  //   let result = await ImagePicker.launchImageLibraryAsync({
  //     mediaTypes: ImagePicker.MediaTypeOptions.All,
  //     allowsEditing: true,
  //     aspect: [4, 3],
  //     quality: 1,
  //   });

  //   if (!result.canceled) {
  //     setImage(result.assets[0].uri);
  //   }
  // };

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
      <View className="flex-1 bg-[#fafafa] relative">
        <View className="justify-center  mt-5 z-10">
          <View className="pl-6">
            <TouchableOpacity onPress={() => navigation.navigate("Home")}>
              <Image source={arrow} className="w-5 h-5 mb-5" />
            </TouchableOpacity>
            <Text className="font-bold text-[26px]">Next 👋</Text>
            {route?.params?.data?.VerifiedUser === false ? (
              <>
                <Text className="text-[12px] text-red-500 opacity-90">
                  Please update your profile to initiate a transaction
                </Text>

                <Button
                  onPress={() => navigation.navigate("Account", "userData")}
                  title="Click Here"
                  disableElevation
                  color="#1C44A6"
                  tintColor="#fff"
                  titleStyle={{ fontSize: 10 }}
                  style={{
                    width: "60%",
                    marginTop: 10,
                    padding: 2,
                    fontSize: 12,
                  }}
                />
              </>
            ) : (
              <Text className="text-[12px] opacity-90">
                Please provide all details and a photo of product.
              </Text>
            )}
          </View>

          <Formik
            initialValues={{
              Name: "",
              Location: "",
              Weight: "",
              Quantity: "",
              Others: "",
            }}
            validationSchema={productSchema}
            onSubmit={(values) => {
              setLoading(true);
              const generateRandomNumber = () =>
                Math.floor(Math.random() * 9e13) + 1e13;

              socket.emit(
                "initiateProduct",
                {
                  ...values,

                  Sender: route?.params?.data?._id,
                  SenderFirstname: route?.params?.data?.Firstname,
                  SenderLastname: route?.params?.data?.Lastname,
                  SenderPhone: route?.params?.data?.Phone,
                  SenderAddress: route?.params?.data?.Address,
                  SenderEmail: route?.params?.data?.Email,
                  TransactionID: generateRandomNumber(),
                },
                (error, transaction) => {
                  if (error) {
                    setLoading(false);
                    Alert.alert("Opps", `${error}`, [
                      {
                        text: "Cancel",
                        onPress: () => console.log(""),
                        style: "cancel",
                      },
                      { text: "OK", onPress: () => console.log("") },
                    ]);
                  } else {
                    setLoading(false);

                    Alert.alert(
                      "Hurray 👏",
                      `You have successfully initiated a pick up, Please click ok to continue`,
                      [
                        {
                          text: "Cancel",
                          onPress: () => console.log(""),
                          style: "cancel",
                        },
                        {
                          text: "OK",
                          onPress: () =>
                            navigation.navigate("Transactions", {
                              data: route?.params?.data,
                            }),
                        },
                      ]
                    );
                  }
                }
              );
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
                {/* <View className="relative h-28 w-28 justify-center mt-2 items-center">
                  <TouchableOpacity
                    onPress={pickImage}
                    className={`mb-4 p-5 w-20 h-20 items-center justify-center rounded-full bg-gray-100 ${
                      Platform.OS === "ios" ? "shadow-sm" : "shadow-lg"
                    } shadow-blue-800`}
                  >
                    {image ? (
                      <Image
                        source={{ uri: image }}
                        className="w-20 rounded-full h-20 "
                      />
                    ) : (
                      <Image source={gallery} className="w-12 h-12 " />
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity className="absolute bottom-4 right-2">
                    <Image source={camera} className="w-8 h-8 " />
                  </TouchableOpacity>
                </View> */}
                <View className=" w-11/12 mt-4  bg-white rounded-r-full py-5 pr-20 pl-6 shadow-2xl relative">
                  <View
                    className={`${
                      Platform.OS === "ios" ? "mb-4" : "mb-4"
                    } realtive`}
                  >
                    <TextInput
                      label="Package Name"
                      style={styles.input}
                      labelStyle={styles.labelStyle}
                      showIcon={false}
                      onChangeText={handleChange("Name")}
                      onBlur={handleBlur("Name")}
                    />
                    <View className="relative">
                      {errors.Name && touched.Name ? (
                        <Text className="text-[10px]  absolute  text-red-500">
                          {errors.Name} (*)
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
                      label="Package Location"
                      labelStyle={styles.labelStyle}
                      showIcon={false}
                      onChangeText={handleChange("Location")}
                      onBlur={handleBlur("Location")}
                      style={styles.input}
                    />
                    <View className="relative">
                      {errors.Location && touched.Location ? (
                        <Text className="text-[10px]  absolute  text-red-500">
                          {errors.Location} (*)
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
                      label="Package weight"
                      style={styles.input}
                      labelStyle={styles.labelStyle}
                      showIcon={false}
                      onChangeText={handleChange("Weight")}
                      onBlur={handleBlur("Weight")}
                      className="w-11/12 mb-1"
                    />
                    <View className="relative">
                      {errors.Weight && touched.Weight ? (
                        <Text className="text-[10px]  absolute  text-red-500">
                          {errors.Weight} (*)
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
                      label="Package Quantity"
                      style={styles.input}
                      labelStyle={styles.labelStyle}
                      showIcon={false}
                      onChangeText={handleChange("Quantity")}
                      onBlur={handleBlur("Quantity")}
                      className="w-11/12 mb-1"
                    />
                    <View className="relative">
                      {errors.Quantity && touched.Quantity ? (
                        <Text className="text-[10px]  absolute  text-red-500">
                          {errors.Quantity} (*)
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
                      label="Other Notes"
                      style={styles.input}
                      labelStyle={styles.labelStyle}
                      showIcon={false}
                      onChangeText={handleChange("Others")}
                      onBlur={handleBlur("Others")}
                      className="w-11/12 mb-1 "
                    />
                    <View className="relative">
                      {errors.Others && touched.Others ? (
                        <Text className="text-[10px]  absolute  text-red-500">
                          {errors.Others} (*)
                        </Text>
                      ) : null}
                    </View>
                  </View>

                  <View>
                    {loading ? (
                      <Button
                        onPress={handleSubmit}
                        title="Please wait..."
                        color="#1C44A6"
                        disableElevation
                        disabled
                        titleStyle={{ fontSize: 10 }}
                        tintColor="#fff"
                        style={{
                          width: "60%",
                          marginTop: 10,
                          padding: 2,
                          fontSize: 12,
                        }}
                        trailing={(props) => (
                          <Image source={arrowImg} className="w-3 h-3" />
                        )}
                      />
                    ) : (
                      <View>
                        {route?.params?.data?.VerifiedUser === false ? (
                          ""
                        ) : (
                          <Button
                            onPress={handleSubmit}
                            title="Continue"
                            disableElevation
                            titleStyle={{ fontSize: 10 }}
                            color="#1C44A6"
                            tintColor="#fff"
                            style={{
                              width: "60%",
                              marginTop: 10,
                              padding: 2,
                              fontSize: 12,
                            }}
                            trailing={(props) => (
                              <Image source={arrowImg} className="w-3 h-3" />
                            )}
                          />
                        )}
                      </View>
                    )}
                  </View>

                  <View className="absolute -right-5 top-[50%]  p-2 rounded-full bg-[#1C44A6] shadow-2xl">
                    <Image source={loginImg} className="w-5 h-5" />
                  </View>
                </View>
              </>
            )}
          </Formik>
        </View>
      </View>
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
    borderBottomColor: "#DDDDDD",
    borderColor: "transparent",
  },
  labelStyle: {
    fontWeight: "bold",
    fontSize: 12,
  },
});
export default PreChatForm;
