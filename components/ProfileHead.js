import { View, Text, Image, Alert } from "react-native";
import React from "react";
import verified from "../assets/verified.png";
import unverified from "../assets/unverified.png";
import logout from "../assets/logout.png";
import { Avatar, Button, Stack } from "@react-native-material/core";
import { useNavigation } from "@react-navigation/native";
import authService from "../utils/Api";
import { useGlobalContext } from "../utils/Context";
const ProfileHead = ({ data, type }) => {
  const navigation = useNavigation();
  const { handleLogout, handleLogoutAgent } = useGlobalContext();
  const LogoutUser = async () => {
    Alert.alert(`Hey ${data?.data?.Lastname} `, `You are logging out? 😫`, [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        onPress: () => {
          if ((type = "userData")) {
            handleLogout().then(() => {
              navigation.replace("Welcome");
            });
          } else {
            handleLogoutAgent().then(() => {
              navigation.replace("Welcome");
            });
          }
        },
      },
    ]);
  };

  return (
    <View
      className={` py-3 mt-5 flex-row border-b-2 items-center justify-center border-gray-200 relative`}
    >
      <View className="items-center justify-center ">
        <Avatar
          label={`${data?.data?.Firstname} ${data?.data?.Lastname}`}
          size={70}
          color="#1C44A6"
        />

        <View className="flex-row items-center justify-center mt-3">
          <Text className="text-[16px] font-semibold ">{`${data?.data?.Firstname} ${data?.data?.Lastname}`}</Text>
          {data?.data?.VerifiedUser && (
            <Image source={verified} className="w-5 h-5" />
          )}
        </View>
        <Text className="text-[11px] mb-5">{data?.data?.Email}</Text>
        <Stack spacing={4} direction="row">
          {data?.data?.VerifiedUser ? (
            <Button
              variant="outlined"
              titleStyle={{ fontSize: 12 }}
              title="Verified"
              color="#1C44A6"
            />
          ) : (
            <Button
              variant="outlined"
              title="Unverified"
              titleStyle={{ fontSize: 12 }}
              color="#1C44A6"
              trailing={(props) => (
                <Image source={unverified} className="w-5 h-5" />
              )}
            />
          )}

          <Button
            title="Logout"
            variant="outlined"
            titleStyle={{ fontSize: 12 }}
            color="red"
            trailing={(props) => <Image source={logout} className="w-3 h-3" />}
            onPress={LogoutUser}
          />
        </Stack>
      </View>
    </View>
  );
};

export default ProfileHead;
