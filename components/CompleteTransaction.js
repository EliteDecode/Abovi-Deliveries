import { View, Text, StyleSheet } from "react-native";
import React, { useEffect, useRef } from "react";
import { Formik } from "formik";
import { useGlobalContext } from "../utils/Context";
import { useNavigation } from "@react-navigation/native";
import { completeTradeSchema } from "../utils/Schemas";
import { TextInput } from "react-native-element-textinput";
import { ActivityIndicator, Button } from "@react-native-material/core";
import arrowImg from "../assets/arrow-right.png";
import arrowImg2 from "../assets/arrow-right-blue.png";
import { Image } from "react-native";
import { url } from "../utils/Api";
import io from "socket.io-client";
import { Alert } from "react-native";
const CompleteTransaction = ({ data, agent }) => {
  const navigation = useNavigation();
  const { loading, setLoading } = useGlobalContext();
  const socketRef = useRef(null);
  useEffect(() => {
    socketRef.current = io(url);
    return () => {
      socketRef.current.disconnect();
      socketRef.current = null;
    };
  }, []);

  useEffect(() => {
    socketRef.current.on("transactionCompleted", (transaction) => {
      Alert.alert(
        "Hurray 🎉",
        `This transaction has been closed and said amount paid`,
        [
          {
            text: "OK",
            onPress: () =>
              navigation.navigate("ActiveTransactions", {
                data: agent,
                from: "activeTransaction",
              }),
          },
        ]
      );
    });
  }, [socketRef]);
  return (
    <View className="w-full p-5 ">
      <View className=" w-full mt-5 p-5 rounded-md bg-white shadow-2xl relative">
        <Formik
          initialValues={{
            Price: "",
            Comment: "",
          }}
          validationSchema={completeTradeSchema}
          onSubmit={(values) => {
            socketRef.current.emit(
              "completeTransaction",
              { ...data, ...values },
              (error, transaction) => {
                if (error) {
                  setLoading(false);
                  Alert.alert(
                    "Oops 😔",
                    `This transaction couldnt be closed, something went wrong`,
                    [
                      {
                        text: "OK",
                      },
                    ]
                  );
                } else {
                  setLoading(false);
                  navigation.navigate("Agent_Home");
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
              <View
                className={`${
                  Platform.OS === "ios" ? "mb-3" : "mb-3"
                } realtive`}
              >
                <TextInput
                  label="Price"
                  inputStyle={{ fontSize: 12 }}
                  style={styles.input}
                  labelStyle={styles.labelStyle}
                  className="w-11/12 mb-1"
                  onChangeText={handleChange("Price")}
                  onBlur={handleBlur("Price")}
                  value={values.Price}
                  showIcon={false}
                />
                <View className="relative">
                  {errors.Price && touched.Price ? (
                    <Text className="text-[11px] pl-3 absolute  text-red-500">
                      {errors.Price} (*)
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
                  label="Comment"
                  style={styles.input}
                  inputStyle={{ fontSize: 12 }}
                  labelStyle={styles.labelStyle}
                  className="w-11/12 mb-1"
                  onChangeText={handleChange("Comment")}
                  onBlur={handleBlur("Comment")}
                  value={values.Comment}
                />
                <View className="relative">
                  {errors.Comment && touched.Comment ? (
                    <Text className="text-[11px] pl-3 absolute  text-red-500">
                      {errors.Comment} (*)
                    </Text>
                  ) : null}
                </View>
              </View>

              {loading ? (
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
              ) : (
                <Button
                  title="Complete"
                  color="#1C44A6"
                  tintColor="#fff"
                  style={{
                    width: "100%",
                    marginTop: 10,
                    padding: 3,
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
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 55,
    paddingHorizontal: 12,
    borderWidth: 0.5,
    borderBottomColor: "#DDDDDD",
    borderColor: "#fff",
  },

  labelStyle: {
    fontWeight: "bold",
  },
});

export default CompleteTransaction;
