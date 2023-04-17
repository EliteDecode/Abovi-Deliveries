import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  SafeAreaView,
  Image,
  TouchableOpacity,
  FlatList,
} from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import arrow from "../assets/backb.png";
import Tab from "../components/Tab";
import { ActivityIndicator, Avatar, Chip } from "@react-native-material/core";
import data from "../utils/transaction_data";
import RenderTransaction from "../components/RenderTransaction";
import { useGlobalContext } from "../utils/Context";
import nothing from "../assets/void2.png";
import io from "socket.io-client";
import { Alert } from "react-native";
import { url } from "../utils/Api";
let socket;
const InactiveTransactions = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState("");
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    async function fetchStoredData() {
      try {
        const dataX = await AsyncStorage.getItem("agentData");
        setData(JSON.parse(dataX));
        const dataParsed = JSON.parse(dataX);
      } catch (error) {}
    }

    fetchStoredData();
  }, []);

  useEffect(() => {
    setLoading(true);
    // establish a connection with the socket
    socket = io(url);

    // listen to the "connect" event
    socket.on("connect", () => {
      // listen to the "getTransactions" event
      socket.emit(
        "getInactiveTransactions",

        (error, transaction) => {
          if (error) {
            setLoading(false);
          } else {
            setLoading(false);
            setTransactions(transaction);
          }
        }
      );
    });

    socket.on("TransactionAccepted", (transaction) => {
      window.location.reload();
    });

    // return a cleanup function to disconnect the socket
    return () => {
      socket.disconnect();
    };
  }, [route, navigation]);

  function handleAcceptTransaction(transactionID) {
    socket.emit(
      "AcceptTransaction",
      { Email: data?.data?.Email, transactionID },
      (error, message) => {
        if (error) {
          setLoading(false);
        } else {
          setLoading(false);
          Alert.alert("Congratulations", `${message}`, [
            { text: "OK", onPress: () => navigation.navigate("Agent_Home") },
          ]);
        }
      }
    );
  }

  const MyStatusBar = ({ backgroundColor, ...props }) => (
    <View style={[styles.statusBar, { backgroundColor }]}>
      <SafeAreaView>
        <StatusBar translucent backgroundColor={backgroundColor} {...props} />
      </SafeAreaView>
    </View>
  );

  return (
    <View className="flex-1 bg-[#fafafa]">
      <MyStatusBar backgroundColor="#1C44A6" barStyle="light-content" />
      <View className=" mt-5 flex-1">
        <View className="flex-row space-x-3 px-5 py-3">
          <TouchableOpacity
            onPress={() => navigation.navigate("Agent_Home", "home")}
          >
            <Image source={arrow} className="w-5 h-5" />
          </TouchableOpacity>
          <Text className="text-[16px] font-black text-blue-900">
            Recent Transactions
          </Text>
        </View>

        <View className=" py-2 flex-1 mb-20">
          {loading ? (
            <View className="items-center  flex-1">
              <ActivityIndicator size="large" color="#1C44A6" />
            </View>
          ) : (
            <>
              {transactions.length === 0 ? (
                <View className="justify-center flex-1 w-full items-center px-5">
                  <Image
                    source={nothing}
                    style={{ resizeMode: "contain" }}
                    className={`w-10/12  ${
                      Platform.OS === "ios" ? "h-[350px]" : "h-[300px]"
                    }`}
                  />
                  <Text className=" text-[16px]">
                    Ooops!!!, No Transactions Initaited
                  </Text>
                </View>
              ) : (
                <FlatList
                  data={transactions}
                  renderItem={({ item, index }) => {
                    return (
                      <RenderTransaction
                        item={item}
                        index={index}
                        data={data}
                        from="inactiveTransactions"
                        handleAcceptTransaction={handleAcceptTransaction}
                      />
                    );
                  }}
                  keyExtractor={(item) => item._id}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{ paddingHorizontal: 20 }}
                />
              )}
            </>
          )}
        </View>
      </View>
      <View className="px-5">
        <Tab type="agentData" />
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
    height: 55,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: "#DDDDDD",
    width: "100%",
  },

  labelStyle: {
    fontSize: 14,
    position: "absolute",
    top: -10,
    backgroundColor: "white",
    paddingHorizontal: 4,
    marginLeft: -4,
    fontWeight: "bold",
    color: "#1C44A6",
  },
});

export default InactiveTransactions;
