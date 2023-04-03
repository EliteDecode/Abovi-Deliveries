import { View, Text, TouchableOpacity, Image } from "react-native";
import React, { useEffect } from "react";
import { Avatar } from "@react-native-material/core";
import bell from "../assets/bell-ring.png";
import { useNavigation } from "@react-navigation/native";
import verified from "../assets/verified.png";
import unverified from "../assets/unverified.png";
const Header = ({ name, fullname, data, type, transactions }) => {
  const navigation = useNavigation();

  return (
    <View className=" mt-7 flex-row items-center justify-between">
      <View className="flex-row space-x-2 items-center">
        <TouchableOpacity onPress={() => navigation.navigate("Account", type)}>
          <Avatar label={fullname} size={45} />
        </TouchableOpacity>
        <View className="justify-center flex-start">
          <View className=" justify-center flex-row items-center">
            <Text className="text-[15px] font-bold">Hi, {name}</Text>
            {data?.data?.VerifiedUser && (
              <Image source={verified} className="w-4 h-4" />
            )}
          </View>
          <Text className="text-[12px]">Welcome</Text>
        </View>
      </View>
      <View className="relative">
        <TouchableOpacity
          onPress={() => {
            if (type == "agentUser") {
              navigation.navigate("InactiveTransactions", data);
            } else {
              navigation.navigate("Transactions", data);
            }
          }}
        >
          <Image source={bell} className="w-6 h-6" />
        </TouchableOpacity>
        <View className="absolute -right-1 py-0.5 px-1 -top-1 bg-[#F3661E]  rounded-full">
          <Text className="text-white text-[8px]">
            {transactions?.length || 0}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default Header;
