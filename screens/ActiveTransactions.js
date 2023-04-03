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
import { TextInput } from "react-native-element-textinput";
import arrow from "../assets/backb.png";
import Tab from "../components/Tab";
import { ActivityIndicator, Avatar, Chip } from "@react-native-material/core";
import data from "../utils/transaction_data";
import RenderTransaction from "../components/RenderTransaction";
import io from "socket.io-client";
import { useGlobalContext } from "../utils/Context";
import nothing from "../assets/void2.png";
import { Picker } from "@react-native-picker/picker";
import { url } from "../utils/Api";
const ActiveTransactions = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [selectedOption, setSelectedOption] = useState("all");
  const [filteredTransactions, setFilteredTransactions] =
    useState(transactions);

  useEffect(() => {
    setLoading(true);
    // establish a connection with the socket
    const socket = io(url);

    // listen to the "connect" event
    socket.on("connect", () => {
      // listen to the "getTransactions" event
      socket.emit(
        "getPendingTransactionsByAgent",
        { data: route?.params?.data?.Email },
        (error, transaction) => {
          if (error) {
            setLoading(false);
          } else {
            setLoading(false);
            setTransactions(transaction);
            setFilteredTransactions(transaction);
          }
        }
      );
    });

    // return a cleanup function to disconnect the socket
    return () => {
      socket.disconnect();
    };
  }, []);

  const handleOptionChange = (option) => {
    setLoading(true);
    setSelectedOption(option);
    if (option === "all") {
      setFilteredTransactions(transactions);
      setLoading(false);
    } else {
      setFilteredTransactions(
        transactions.filter((transaction) => transaction.Status === option)
      );
      setLoading(false);
    }
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
      <View className=" mt-5 flex-1">
        <View className="flex-row space-x-3 px-5">
          <TouchableOpacity onPress={() => navigation.navigate("Agent_Home")}>
            <Image source={arrow} className="w-5 h-5" />
          </TouchableOpacity>
          <Text className="text-[16px] font-black text-blue-900">
            Transaction History
          </Text>
        </View>
        <View className="px-5">
          <View className=" mt-5 border-2 rounded-lg border-blue-900">
            <Picker
              className=" rounded-md p-2"
              style={{ borderColor: "#ccc" }}
              selectedValue={selectedOption}
              onValueChange={(option) => handleOptionChange(option)}
            >
              <Picker.Item
                label="All Transactions"
                value="all"
                color="#1C44A6"
              />
              <Picker.Item
                label="Completed"
                value="Completed"
                color="#1C44A6"
              />
              <Picker.Item label="Pending" value="Pending" color="#1C44A6" />
              <Picker.Item
                label="Cancelled"
                value="Cancelled"
                color="#1C44A6"
              />
            </Picker>
          </View>
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
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate("Preform", route?.params)
                    }
                    className="w-full bg-[#F3661E] items-center justify-center rounded-lg text-center py-3 mt-2"
                  >
                    <Text className="font-semibold text-white text-[12px] ">
                      Initaite a Transaction
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <FlatList
                  data={filteredTransactions}
                  renderItem={({ item, index }) => {
                    return (
                      <RenderTransaction
                        item={item}
                        index={index}
                        from="activeTransaction"
                        data={route?.params}
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

export default ActiveTransactions;
