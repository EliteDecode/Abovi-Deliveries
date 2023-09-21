import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import { TextInput, Button } from "@react-native-material/core";
import { Avatar } from "@react-native-material/core";
import arrow from "../assets/back.png";
import { Icon } from "react-native-elements";
import { useNavigation, useRoute } from "@react-navigation/native";
import { url } from "../utils/Api";
import io from "socket.io-client";
import { Alert } from "react-native";
let socket;
const Chat = () => {
  const keyboardVerticalOffset = 90;
  const navigation = useNavigation();
  const textInputRef = useRef(null);
  const route = useRoute();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const scrollViewRef = useRef();
  const handleChange = (value) => {
    setMessage(value);
  };
  const socketRef = useRef(null);

  useEffect(() => {
    // Call scrollToEnd after the layout has been calculated and the content has been updated
    scrollViewRef.current.scrollToEnd({ animated: true });
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "",
      headerBackTitleVisible: false,
      headerStyle: {
        backgroundColor: "#1C44A6",
      },
      title: "",
      headerTintColor: "#fff",
      headerLeft: () => (
        <View className=" bg-[#1C44A6] px-6 flex-row justify-between items-center">
          <View className=" space-x-2 items-center flex-row ">
            <TouchableOpacity
              onPress={() => {
                if (route?.params?.agent === "true") {
                  navigation.navigate("Transaction_Details", {
                    item: route?.params?.item,
                    data: route?.params?.data,
                    from: "activeTransaction",
                  });
                } else {
                  navigation.navigate("Transaction_Details", {
                    item: route?.params?.item,
                    data: route?.params?.data,
                    from: undefined,
                  });
                }
              }}
            >
              <Image source={arrow} className="w-7 h-7" />
            </TouchableOpacity>
            <View className="flex-row space-x-2 items-center">
              <Avatar
                label={`${route?.params?.data?.Firstname} ${route?.params?.data?.Lastname}`}
                size={35}
              />
              <View>
                <Text className="text-[14px] capitalize font-bold text-white">
                  {route?.params?.data?.Lastname}{" "}
                  {route?.params?.data?.Firstname}
                </Text>
              </View>
            </View>
          </View>
        </View>
      ),
      headerRight: () => (
        <TouchableOpacity
          className="px-6 py-2"
          onPress={() => {
            Alert.alert("Audio Call", "Audio Call Button Pressed");
          }}
        ></TouchableOpacity>
      ),
    });
  }, []);

  useEffect(() => {
    socketRef.current = io(url);
    socketRef.current.on("connect", () => {
      socketRef.current.emit("join-room", {
        name: route?.params?.data?.Firstname,
        room: route?.params?.item?.TransactionID,
        agent: route?.params?.agent,
      });
      socketRef.current.emit(
        "getPreviousChats",
        { room: route?.params?.item?.TransactionID },
        (error, msg) => {
          if (error) {
            setLoading(false);
          } else {
            setLoading(false);
            setMessages(msg);
          }
        }
      );
    });

    return () => {
      socketRef.current.disconnect();
      socketRef.current = null;
    };
  }, [route]);

  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on("message", (msg) => {
        setMessages((messages) => [...msg.flat()]);
        scrollViewRef.current.scrollToEnd({ animated: true });
      });
    }
  }, [setMessages]);

  const sendMessage = (e) => {
    e.preventDefault();
    textInputRef.current.clear();

    if (socketRef.current) {
      socketRef.current.emit("send-message", message);
    }

    // Give focus back to the input field
    textInputRef.current.focus();
  };

  const MyStatusBar = ({ backgroundColor, ...props }) => (
    <View style={[styles.statusBar, { backgroundColor }]}>
      <SafeAreaView>
        <StatusBar translucent backgroundColor={backgroundColor} {...props} />
      </SafeAreaView>
    </View>
  );

  return (
    <View className="flex-1 bg-[#fafafa]">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={keyboardVerticalOffset}
        style={{ flex: 1 }}
      >
        <ScrollView
          ref={scrollViewRef}
          className={`${Platform.OS === "ios" ? "mb-3" : "mb-1"} flex-1`}
          onContentSizeChange={() => {
            // Call scrollToEnd when the content size changes
            scrollViewRef.current.scrollToEnd({ animated: true });
          }}
          onLayout={() => {
            // Call scrollToEnd when the layout is calculated
            scrollViewRef.current.scrollToEnd({ animated: true });
          }}
        >
          <View className="py-5">
            {messages?.map((message, index) => {
              return (
                <View key={index}>
                  {message?.from?.toLowerCase() ==
                  route?.params?.data?.Firstname?.toLowerCase() ? (
                    <View className="flex-row-reverse mt-2 relative px-5 mb-4">
                      <View className="w-9/12 py-3 px-2   shadow-lg bg-[#1C44A6] rounded-l-xl rounded-b-xl">
                        {/* <Text className="text-[12px]    font-bold text-[#fff] mb-3">
                        {message.name}
                      </Text> */}
                        <Text className="text-[#fff]  mb-2  text-[12px] font-normal">
                          {message.text}
                        </Text>
                        <Text className=" absolute bottom-2 text-[10px] right-3 text-[#fff]">
                          {message.time}
                        </Text>
                      </View>
                    </View>
                  ) : (
                    <View className="px-5 mb-2 relative">
                      <View className=" w-9/12  py-3 px-2 shadow-lg bg-white  rounded-r-xl rounded-b-xl relative">
                        {/* <Text className="text-[12px] opacity-80 font-bold text-[#0c1630] mb-2">
                        {message.name}
                      </Text> */}
                        <Text className="text-[#1C44A6] mb-2 text-[12px] font-normal">
                          {message.text}
                        </Text>
                        <Text className="absolute bottom-2 right-3 text-[10px] text-[#0c1630]">
                          {message.time}
                        </Text>
                      </View>
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        </ScrollView>
        <View className={`px-4   bottom-2`}>
          <View className="px-6  bg-white shadow-lg rounded-md flex-row justify-between items-center w-full space-x-1">
            <TextInput
              variant="standard"
              inputStyle={{ fontSize: 12 }}
              ref={textInputRef}
              placeholder="Type Something..."
              color="#fff"
              onFocus={() =>
                scrollViewRef.current.scrollToEnd({ animated: true })
              }
              onChangeText={handleChange}
              onKeyPress={(e) => (e.Key === "Enter" ? sendMessage(e) : null)}
              style={{ width: 220 }}
              value={message}
            />
            <Button
              title="Send"
              color="#1C44A6"
              tintColor="#fff"
              elevation={false}
              isSubmitting
              onPress={sendMessage}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const STATUSBAR_HEIGHT = StatusBar.currentHeight;

const styles = StyleSheet.create({
  statusBar: {
    height: STATUSBAR_HEIGHT,
  },
});

export default Chat;
