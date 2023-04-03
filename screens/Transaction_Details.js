import { View, Text, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native";
import { StatusBar } from "react-native";
import { StyleSheet } from "react-native";
import Tab from "../components/Tab";
import { Image } from "react-native";
import comment from "../assets/comment.png";
import phone from "../assets/phone-call.png";
import deleteImg from "../assets/delete2.png";
import { Linking } from "react-native";
import { Button, Chip, IconButton } from "@react-native-material/core";
import arrow from "../assets/back.png";
import tick from "../assets/tick.png";
import { TouchableOpacity } from "react-native";
import { url } from "../utils/Api";
import { useGlobalContext } from "../utils/Context";
import { io } from "socket.io-client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Modal from "react-native-modal";
import { Dimensions } from "react-native";
import CompleteTransaction from "../components/CompleteTransaction";
import CancelTransaction from "../components/CancelTransaction";
let socket;
const Transaction_Details = () => {
  const routes = useRoute();
  const navigation = useNavigation();
  const [isModalVisible, setModalVisible] = useState(false);
  const [isCancelModalVisisble, setCancleModalVisible] = useState(false);
  const windowWidth = Dimensions.get("window").width;
  const windowHeight = Dimensions.get("screen").height;

  const { setLoading, loading } = useGlobalContext();
  const [data, setData] = useState("");
  async function fetchStoredData() {
    try {
      const dataX = await AsyncStorage.getItem("agentData");
      setData(JSON.parse(dataX));
      const dataParsed = JSON.parse(dataX);
    } catch (error) {}
  }
  useEffect(() => {
    fetchStoredData();
  }, []);

  useEffect(() => {
    socket = io(url);
    socket.on("connect", () => {
      // listen to the "getTransactions" event
      socket.on("TransactionAccepted", (transaction) => {
        fetchStoredData();

        navigation.navigate("Transaction_Details", {
          item: transaction,
          from: "inactiveTransactions",
        });
      });
    });
    // return a cleanup function to disconnect the socket
    return () => {
      socket.disconnect();
    };
  }, [routes]);

  const handleCallPress = () => {
    Linking.openURL(`tel:${routes?.params?.item?.SenderPhone}`);
  };

  function handleAcceptTransaction() {
    setLoading(true);
    socket.emit(
      "AcceptTransaction",
      {
        Email: routes?.params?.Email,
        TransactionId: routes?.params?.item?._id,
      },
      (error, message) => {
        if (error) {
          setLoading(false);
        } else {
          setLoading(false);
          Alert.alert("Congratulations", `You have actiated this transaction`, [
            {
              text: "OK",
            },
          ]);
        }
      }
    );
  }

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const toggleCancelModal = () => {
    setCancleModalVisible(!isCancelModalVisisble);
  };

  const MyStatusBar = ({ backgroundColor, ...props }) => (
    <View style={[styles.statusBar, { backgroundColor }]}>
      <SafeAreaView>
        <StatusBar translucent backgroundColor={backgroundColor} {...props} />
      </SafeAreaView>
    </View>
  );

  return (
    <View className="flex-1">
      <MyStatusBar backgroundColor="#1C44A6" barStyle="light-content" />

      {/* Complete Transaction Modal */}
      <Modal
        isVisible={isModalVisible}
        style={{ margin: 0 }}
        deviceWidth={windowWidth}
        deviceHeight={windowHeight}
      >
        <View style={{ flex: 1 }} className="justify-center items-center">
          <CompleteTransaction
            data={routes?.params?.item}
            agent={routes?.params?.data}
          />
          <Button
            titleStyle={{ fontSize: 11 }}
            title="Close"
            onPress={toggleModal}
          />
        </View>
      </Modal>

      {/* cancle transaction modal */}
      <Modal
        isVisible={isCancelModalVisisble}
        style={{ margin: 0 }}
        deviceWidth={windowWidth}
        deviceHeight={windowHeight}
      >
        <View style={{ flex: 1 }} className="justify-center items-center">
          <CancelTransaction
            data={routes?.params?.item}
            agent={routes?.params?.data}
          />
          <Button
            titleStyle={{ fontSize: 11 }}
            title="Close"
            onPress={toggleCancelModal}
          />
        </View>
      </Modal>
      {/* end cancle modal */}
      <View className="flex-1 ">
        <View className="bg-[#1C44A6] px-5 py-3 flex-row items-center ">
          <TouchableOpacity
            onPress={() => {
              if (routes?.params?.from === "inactiveTransactions") {
                navigation.navigate("InactiveTransactions");
              } else if (routes?.params?.from === "agent") {
                navigation.navigate("Agent_Home");
              } else if (routes?.params?.from === "activeTransaction") {
                navigation.navigate("ActiveTransactions");
              } else {
                navigation.navigate("Transactions", {
                  data: routes?.params?.data,
                });
              }
            }}
          >
            <Image source={arrow} className="w-7 h-7" />
          </TouchableOpacity>
          <Text className="text-[13px]  text-white font-bold uppercase">
            Transaction Details
          </Text>
        </View>
        <View className="mt-5 px-5">
          {routes?.params?.from !== undefined && (
            <>
              <View className="my-2">
                <Text className="text-[13px] font-bold">Customer Name:</Text>
                <Text className="text-[13px] opacity-80">
                  {routes?.params?.item?.SenderFirstname} ,{" "}
                  {routes?.params?.item?.SenderLastname}
                </Text>
              </View>
              <View className="my-2">
                <Text className="text-[13px] font-bold">
                  Customer Location:
                </Text>
                <Text className="text-[13px] opacity-80">
                  {routes?.params?.item?.SenderAddress}{" "}
                </Text>
              </View>
            </>
          )}
          <View className="my-2">
            <Text className="text-[13px] font-bold">Transaction Id:</Text>
            <Text className="text-[13px] opacity-80">
              {routes?.params?.item?.TransactionID}
            </Text>
          </View>

          <View className="my-2">
            <Text className="text-[13px] font-bold">Product Name:</Text>
            <Text className="text-[13px] opacity-80">
              {routes?.params?.item?.ProductName}
            </Text>
          </View>

          <View className="my-2">
            <Text className="text-[13px] font-bold">Product Location:</Text>
            <Text className="text-[13px] opacity-80">
              {routes?.params?.item?.ProductLocation}
            </Text>
          </View>
          <View className="my-2">
            <Text className="text-[13px] font-bold">Product Weight:</Text>
            <Text className="text-[13px] opacity-80">
              {routes?.params?.item?.ProductWeight}
            </Text>
          </View>
          <View className="my-2">
            <Text className="text-[13px] font-bold">Product Quantity:</Text>
            <Text className="text-[13px] opacity-80">
              {routes?.params?.item?.ProductQuantity}
            </Text>
          </View>
          <View className="my-2">
            <Text className="text-[13px] font-bold">Other Notes:</Text>
            <Text className="text-[13px] opacity-80">
              {routes?.params?.item?.OtherNotes}
            </Text>
          </View>
          <View>
            <Text className="text-[13px] font-bold mb-2">Status:</Text>
            <Chip
              variant="filled"
              labelStyle={{ fontSize: 12 }}
              style={{ width: "30%" }}
              label={routes?.params?.item?.Status}
              color={
                routes?.params?.item?.Status === "Completed"
                  ? "green"
                  : routes?.params?.item?.Status === "Pending"
                  ? "orange"
                  : "red"
              }
            />
          </View>
          <View className="my-2">
            <Text className="text-[13px] font-bold">SalesRep Comment:</Text>
            <Text className="text-[13px] opacity-80">
              {routes?.params?.item?.SalesRepComment ||
                "No comment yet, transaction pending"}
            </Text>
          </View>
        </View>
      </View>

      <View className="px-5 bottom-4">
        {routes?.params?.item?.Active === false &&
        routes?.params?.from === "inactiveTransactions" ? (
          <TouchableOpacity
            onPress={handleAcceptTransaction}
            className="flex-row space-x-2 bg-[#1C44A6] items-center justify-center rounded-md text-center py-5 w-full mt-5"
          >
            <Text className="font-semibold text-white text-[13px] ">
              {loading ? "Activating Transaction..." : " Accept Transaction"}
            </Text>
          </TouchableOpacity>
        ) : (
          <View className="flex-row space-x-3">
            {routes?.params?.from === "inactiveTransactions" ||
            routes?.params?.from === "activeTransaction" ||
            routes?.params?.from === "agent" ? (
              <Button
                titleStyle={{ fontSize: 11 }}
                title="Send Message"
                variant="contained"
                color="#1C44A6"
                tintColor="#fff"
                trailing={(props) => (
                  <Image source={comment} className="w-4 h-4" />
                )}
                style={{
                  width: "50%",
                  marginTop: 10,
                  padding: 2,
                }}
                onPress={() => {
                  navigation.navigate("Chat", {
                    data: routes?.params?.data || data?.data,
                    item: routes?.params?.item,
                    from: routes?.params?.from,
                    agent: "true",
                  });
                }}
              />
            ) : (
              <Button
                titleStyle={{ fontSize: 11 }}
                title="Send Message"
                variant="contained"
                color="#1C44A6"
                tintColor="#fff"
                trailing={(props) => (
                  <Image source={comment} className="w-4 h-4" />
                )}
                style={{
                  width: "50%",
                  marginTop: 10,
                  padding: 2,
                }}
                onPress={() => {
                  navigation.navigate("Chat", {
                    data: routes?.params?.data,
                    item: routes?.params?.item,
                    from: routes?.params?.from,
                  });
                }}
              />
            )}

            {routes?.params?.item?.Active === true &&
            routes?.params?.from === "user" ? (
              <Button
                titleStyle={{ fontSize: 11 }}
                title={
                  routes?.params?.from === "inactiveTransactions"
                    ? "Call Customer"
                    : "Call Rep"
                }
                variant="contained"
                color="#F3661E"
                tintColor="#fff"
                trailing={(props) => (
                  <Image source={phone} className="w-4 h-4" />
                )}
                style={{
                  width: "50%",
                  marginTop: 10,
                  padding: 2,
                }}
                onPress={() =>
                  Alert.alert(
                    "Info",
                    "An agent has not be assigned yet, you will be notified soon, But You can drop a message"
                  )
                }
              />
            ) : (
              <Button
                titleStyle={{ fontSize: 11 }}
                title={
                  routes?.params?.from != "user" ? "Call Customer" : "Call Rep"
                }
                variant="contained"
                color="#F3661E"
                tintColor="#fff"
                trailing={(props) => (
                  <Image source={phone} className="w-4 h-4" />
                )}
                style={{
                  width: "50%",
                  marginTop: 10,
                  padding: 2,
                }}
                onPress={handleCallPress}
              />
            )}
          </View>
        )}

        {routes?.params?.item?.Status === "Completed" ||
        (routes?.params?.item?.Status === "Cancelled" &&
          routes?.params?.from != "user") ? (
          ""
        ) : (
          <View>
            {routes?.params?.item?.Active === true &&
            routes?.params?.from !== undefined ? (
              <View className="flex-row space-x-3">
                <Button
                  titleStyle={{ fontSize: 11 }}
                  title="Cancel Trade"
                  variant="outlined"
                  tintColor="#1C44A6"
                  trailing={(props) => (
                    <Image source={deleteImg} className="w-4 h-4" />
                  )}
                  style={{
                    width: "50%",
                    marginTop: 10,
                    padding: 2,
                  }}
                  onPress={toggleCancelModal}
                />
                <Button
                  titleStyle={{ fontSize: 11 }}
                  title="Complete Trade"
                  variant="contained"
                  trailing={(props) => (
                    <Image source={tick} className="w-4 h-4" />
                  )}
                  tintColor="#fff"
                  style={{
                    width: "50%",
                    marginTop: 10,
                    padding: 2,
                  }}
                  onPress={toggleModal}
                />
              </View>
            ) : (
              <View></View>
            )}
          </View>
        )}
      </View>
    </View>
  );
};
const STATUSBAR_HEIGHT = StatusBar.currentHeight;

const styles = StyleSheet.create({
  statusBar: {
    height: STATUSBAR_HEIGHT,
  },
});
export default Transaction_Details;
