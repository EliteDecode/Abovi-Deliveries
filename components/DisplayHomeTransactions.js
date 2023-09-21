import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { Image } from "react-native";
import { Avatar, Button } from "@react-native-material/core";
import nothing from "../assets/ab-nothing1.png";

import { FlatList } from "react-native";
import { useGlobalContext } from "../utils/Context";
import RenderTransaction from "./RenderTransaction";
import { ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";

const DisplayHomeTransactions = ({ transactions, data, from, loading }) => {
  const navigation = useNavigation();
  const today = new Date().setHours(0, 0, 0, 0);
  return (
    <View className="items-center w-full justify-center flex-1">
      {loading ? (
        <View className="items-center mt-20 flex-1">
          <ActivityIndicator size="large" color="#1C44A6" />
        </View>
      ) : (
        <>
          {transactions?.length === 0 ? (
            <ScrollView
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
            >
              <View className="justify-center w-full items-center mb-20">
                <Image
                  source={nothing}
                  style={{ resizeMode: "contain" }}
                  className={`w-11/12  ${
                    Platform.OS === "ios" ? "h-[350px]" : "h-[300px]"
                  }`}
                />
                <Text className=" text-[14px]">
                  Ooops, No Transactions Today!
                </Text>
                {/* <TouchableOpacity
                onPress={() => navigation.navigate("Transactions", { ...data })}
                className="w-full bg-[#F3661E] items-center justify-center rounded-md text-center py-3 mt-2"
              >
                <Text className="font-semibold text-white text-[16px] ">
                  ScrollView All Transactions
                </Text>
              </TouchableOpacity> */}
              </View>
            </ScrollView>
          ) : (
            <View
              className={`py-2 flex-1  w-full ${
                from === "agent" ? "mt-1 mb-24" : "mt-3 mb-20"
              }`}
            >
              <Text className="text-[23px] font-bold">
                {from === "agent"
                  ? "Your Transactions"
                  : "Today's Transactions"}
              </Text>
              <View className={`${from === "agent" ? "mt-1" : "mt-3"}`}>
                <FlatList
                  data={
                    from === "agent"
                      ? transactions.slice(0, 10)
                      : transactions.slice(0, 10)
                  }
                  renderItem={({ item, index }) => {
                    return (
                      <RenderTransaction
                        item={item}
                        data={data}
                        route="home"
                        from={from}
                      />
                    );
                  }}
                  keyExtractor={(item) => item._id}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{
                    paddingHorizontal: 8,
                    backgroundColor: "#fff",
                    paddingVertical: 5,
                  }}
                />
                {/* <TouchableOpacity
                  onPress={() => {
                    if (from === "agent") {
                      navigation.navigate("ActiveTransactions", { ...data });
                    } else {
                      navigation.navigate("Transactions", { ...data });
                    }
                  }}
                  className="w-full bg-[#F3661E] items-center justify-center rounded-md text-center py-3 mt-2 mb-10"
                >
                  <Text className="font-semibold text-white text-[16px] ">
                    View All Transactions
                  </Text>
                </TouchableOpacity> */}
              </View>
            </View>
          )}
        </>
      )}
    </View>
  );
};

export default DisplayHomeTransactions;
