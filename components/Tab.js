import { View, Text, Platform, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";

const Tab = ({ type, data }) => {
  const [role, setRole] = useState("home");
  const navigation = useNavigation();
  const route = useRoute();

  useEffect(() => {
    setRole(route.name);
  }, [route]);

  const ButtonX = ({ icon, title }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          if (title === "Account") {
            navigation.navigate("Account", type);
          } else {
            navigation.navigate(title, { type, ...data });
          }
        }}
        style={[
          {
            backgroundColor: role === title ? "#fff" : "#1C44A6",
            height: 47,
            width: 47,
            borderRadius: 28,
            alignItems: "center",
            justifyContent: "center",
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 1,
            },
            shadowOpacity: 0.22,
            shadowRadius: 2.22,

            elevation: 3,
          },
        ]}
      >
        {icon}
      </TouchableOpacity>
    );
  };

  return (
    <View
      style={{
        position: "absolute",
        bottom: Platform.OS === "ios" ? 20 : 10,
        left: 20,
        right: 20,
        flexDirection: "row",
        justifyContent: "space-between",
        backgroundColor: "#1C44A6",
        borderRadius: 20,
        paddingVertical: 7,
        paddingHorizontal: 20,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,

        elevation: 3,
      }}
    >
      {type === "agentData" ? (
        <>
          <ButtonX
            icon={
              <Ionicons
                name="md-home"
                size={20}
                color={`${role === "Agent_Home" ? "#1C44A6" : "#fff"}`}
              />
            }
            title="Agent_Home"
          />
          <ButtonX
            icon={
              <FontAwesome5
                name="list"
                size={20}
                color={`${role === "ActiveTransactions" ? "#1C44A6" : "#fff"}`}
              />
            }
            title="ActiveTransactions"
          />
        </>
      ) : (
        <>
          <ButtonX
            icon={
              <Ionicons
                name="md-home"
                size={20}
                color={`${role === "Home" ? "#1C44A6" : "#fff"}`}
              />
            }
            title="Home"
          />

          <ButtonX
            icon={
              <FontAwesome5
                name="list"
                size={20}
                color={`${role === "Transactions" ? "#1C44A6" : "#fff"}`}
              />
            }
            title="Transactions"
          />
        </>
      )}

      <ButtonX
        icon={
          <FontAwesome5
            name="user-alt"
            size={20}
            color={`${role === "Account" ? "#1C44A6" : "#fff"}`}
          />
        }
        title="Account"
      />
    </View>
  );
};

export default Tab;
