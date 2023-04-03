import { View, Text, TouchableOpacity } from "react-native";
import { Avatar, Chip } from "@react-native-material/core";
import React from "react";
import { useNavigation } from "@react-navigation/native";

const RenderTransaction = ({
  item,
  route,
  data,
  from,
  handleAcceptTransaction,
}) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("Transaction_Details", { item, ...data, from })
      }
      className={`px-3 my-1 flex-row items-center w-full justify-between rounded-xl ${
        Platform.OS === "ios"
          ? "py-3 shadow-md  shadow-blue-200"
          : "py-2 shadow-md  shadow-blue-900 "
      } bg-white `}
    >
      <View className="flex-row items-center space-x-2">
        <TouchableOpacity>
          <Avatar
            label={`${item.ProductName} ${item.ProductLocation}`}
            size={route === "home" ? 35 : 40}
            color="#F3661E"
            tintColor="#fff"
          />
        </TouchableOpacity>
        <View>
          <Text
            className={`${
              route === "home" ? "text-[12px]" : "text-[14px]"
            } font-bold`}
          >
            AB-{item.TransactionID}
          </Text>
          <Text
            className={`${
              route === "home" ? "text-[8px]" : "text-[10px]"
            }  opacity-75 `}
          >
            Click to view Transaction details
          </Text>
        </View>
      </View>
      <View>
        {from === "inactiveTransactions" ? (
          <Chip
            onPress={() => handleAcceptTransaction(item._id)}
            variant="filled"
            label={item.Active === false ? "Accept" : ""}
            color={item.Active === false ? "green" : "red"}
            labelStyle={{ fontSize: 10 }}
          />
        ) : (
          <Chip
            variant="filled"
            label={item.Status}
            color={
              item.Status === "Completed"
                ? "green"
                : item.Status === "Pending"
                ? "orange"
                : "error"
            }
            labelStyle={{ fontSize: 10 }}
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

export default RenderTransaction;
