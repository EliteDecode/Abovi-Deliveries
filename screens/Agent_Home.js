import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Image,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import { Avatar, Button, Chip } from "@react-native-material/core";
import Tab from "../components/Tab";
import React, { useEffect, useLayoutEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import nothing from "../assets/ab-nothing1.png";
import { useNavigation, useRoute } from "@react-navigation/native";
import Header from "../components/Header";
import { useGlobalContext } from "../utils/Context";
import rep from "../assets/rep.png";
import arrowUpDown from "../assets/up-down.png";
import card from "../assets/money-exchange.png";
import card2 from "../assets/transaction.png";
import { url } from "../utils/Api";
import DisplayHomeTransactions from "../components/DisplayHomeTransactions";
import io from "socket.io-client";
let socket;
const Home = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [data, setData] = useState();
  const [transactions, setTransactions] = useState([]);
  const [pendingTransactions, setPendingTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  const {
    setAddressAgent,
    setEmailAgent,
    setFirstnameAgent,
    setLastnameAgent,
    setPhoneAgent,
  } = useGlobalContext();

  useLayoutEffect(() => {
    async function fetchStoredData() {
      try {
        const dataX = await AsyncStorage.getItem("agentData");
        setData(JSON.parse(dataX));
        const dataParsed = JSON.parse(dataX);
        setAddressAgent(dataParsed.data.Address);
        setEmailAgent(dataParsed.data.Email);
        setFirstnameAgent(dataParsed.data.Firstname);
        setLastnameAgent(dataParsed.data.Lastname);
        setPhoneAgent(dataParsed.data.Phone);
      } catch (error) {}
    }

    fetchStoredData();
  }, []);

  useEffect(() => {
    setLoading(true);
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

      socket.emit(
        "getPendingTransactionsByAgent",
        { data: data?.data?.Email },
        (error, transaction) => {
          if (error) {
            setLoading(false);
          } else {
            setLoading(false);
            setPendingTransactions(transaction);
          }
        }
      );
    });

    // return a cleanup function to disconnect the socket
    return () => {
      socket.disconnect();
    };
  }, [data]);
  const MyStatusBar = ({ backgroundColor, ...props }) => (
    <View style={[styles.statusBar, { backgroundColor }]}>
      <SafeAreaView>
        <StatusBar translucent backgroundColor={backgroundColor} {...props} />
      </SafeAreaView>
    </View>
  );

  return (
    <View className="flex-1 bg-[#fff]">
      <MyStatusBar backgroundColor="#1C44A6" barStyle="light-content" />
      <View className="px-5 flex-1 ">
        <Header
          name={data?.data?.Lastname}
          fullname={`${data?.data?.Firstname} ${data?.data?.Lastname}`}
          data={data}
          transactions={transactions}
          type="agentData"
        />
        <View className="mt-2">
          <Text className="font-bold text-[22px] mb-2">Hey Champ 👋,</Text>
          <View className=" space-x-3 ">
            <TouchableOpacity
              className={`w-full ${
                Platform.OS === "ios"
                  ? "h-56 py-3 bg-blue-900 "
                  : " py-3 bg-blue-900 h-52"
              }  shadow-xl shadow-gray-300 rounded-lg`}
            >
              <ImageBackground
                source={rep}
                style={{
                  width: "100%",
                  opacity: 0.9,
                  height: "100%",
                }}
              >
                <View className="flex-1 px-2 relative">
                  <View className="w-4/12">
                    <TouchableOpacity className="py-1 rounded-xl  justify-center items-center bg-white">
                      <Text className="text-dark text-[12px] font-semibold">
                        Sales Rep
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View className="mt-10 ml-0">
                    <Image source={arrowUpDown} className="h-10 w-10" />
                  </View>
                  <View className="flex-row items-center mt-10">
                    <Image source={card2} className="h-10 w-10" />
                    <Text className="text-[17px] text-white font-bold">
                      : {pendingTransactions?.length || 0} Transactions
                    </Text>
                  </View>
                </View>
              </ImageBackground>
            </TouchableOpacity>
          </View>
        </View>
        <DisplayHomeTransactions
          transactions={pendingTransactions}
          data={data}
          from="agent"
        />
      </View>
      <View className="px-5">
        <Tab type="agentData" data={data} />
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
export default Home;
