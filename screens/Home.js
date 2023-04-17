import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";

import Tab from "../components/Tab";
import React, { useEffect, useLayoutEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import bus from "../assets/deliveryzz.png";
import bike from "../assets/deliveryyy.png";
import { useNavigation, useRoute } from "@react-navigation/native";
import Header from "../components/Header";
import { useGlobalContext } from "../utils/Context";
import DisplayHomeTransactions from "../components/DisplayHomeTransactions";
import io from "socket.io-client";
import { url } from "../utils/Api";
let socket;
const Home = () => {
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const { setAddress, setEmail, setFirstname, setLastname, setPhone } =
    useGlobalContext();
  const navigation = useNavigation();
  const route = useRoute();
  const [data, setData] = useState();

  useEffect(() => {
    setLoading(true);
    async function fetchStoredData() {
      try {
        const dataX = await AsyncStorage.getItem("userData");
        setData(JSON.parse(dataX));
        const dataParsed = JSON.parse(dataX);
        setAddress(dataParsed.data.Address);
        setEmail(dataParsed.data.Email);
        setFirstname(dataParsed.data.Firstname);
        setLastname(dataParsed.data.Lastname);
        setPhone(dataParsed.data.Phone);
      } catch (error) {}
    }

    fetchStoredData();
  }, [route]);

  useEffect(() => {
    socket = io(url, {
      transportOptions: {
        polling: {
          extraHeaders: {
            Authorization: `Bearer ${data?.data?.token}`,
          },
        },
      },
    });

    // listen to the "connect" event
    socket.on("connect", () => {
      // listen to the "getTransactions" event
      socket.emit(
        "getTransactions",
        { id: data?.data?._id },
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

    // return a cleanup function to disconnect the socket
    return () => {
      socket.disconnect();
    };
  }, [data, route]);

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
          type="userData"
          transactions={transactions}
        />
        <View className="mt-5">
          <Text className="font-bold text-[22px] text-blue-900">
            Hey Champ 👋,
          </Text>
          <Text className="text-[12px] text-blue-900 opacity-90">
            Tell Us What You Are Doing Today.
          </Text>
          <View className=" flex flex-row justify-center items-center space-x-3 mt-3">
            <TouchableOpacity
              onPress={() => navigation.navigate("Preform", data)}
              className={` justify-center p-3 border-gray-50 bg-[#1c43a6]  rounded-lg shadow-md w-6/12 ${
                Platform.OS === "ios" ? "py-4 px-3" : "py-3 px-2"
              }  `}
            >
              <Image source={bus} className="w-10 h-10" />
              <Text className=" text-[11px]  text-white mt-1">
                Pick Up and Deliver
              </Text>
              <Text className=" text-[11px]  text-white ">Today </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate("Preform", data)}
              className={` bg-[#F3661E] p-3 border-gray-50  rounded-lg shadow-md w-6/12 ${
                Platform.OS === "ios" ? "py-4 px-3" : "py-3 px-2"
              }  `}
            >
              <Image source={bike} className="w-10 h-10" />
              <Text className=" text-[11px]  text-white mt-1">
                Pick Up, Package and
              </Text>
              <Text className=" text-[11px]  text-white ">Deliver Today </Text>
            </TouchableOpacity>
          </View>
        </View>

        <DisplayHomeTransactions transactions={transactions} data={data} />
      </View>
      <View className="">
        <Tab type="userData" data={data} />
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
