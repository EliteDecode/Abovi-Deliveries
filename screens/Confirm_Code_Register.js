import React, { useState } from "react";
import {
  Text,
  StyleSheet,
  View,
  Image,
  Alert,
  AsyncStorage,
} from "react-native";
import { ActivityIndicator, Button } from "@react-native-material/core";
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from "react-native-confirmation-code-field";
import waveTop from "../assets/waveTop2.png";
import waveBottom from "../assets/waveBottom.png";
import arrowImg from "../assets/arrow-right.png";
import { useNavigation, useRoute } from "@react-navigation/native";
import authService from "../utils/Api";
import { TouchableOpacity } from "react-native";
const CELL_COUNT = 5;

const Confirm_Code_Register = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [loadingSendCode, setLoadingSendCode] = useState(false);
  const route = useRoute();
  const [value, setValue] = useState("");
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  const handleVerify = () => {
    setLoading(true);
    const Verification_details = {
      userId: route.params.user._id,
      uniqueString: value,
    };

    authService.verify(Verification_details).then((data) => {
      if (data.message === "verified") {
        setLoading(false);
        navigation.replace("Home", data);
      } else {
        setLoading(false);
        setValue("");
        Alert.alert("Opps", `${data}`, [
          {
            text: "Cancel",
            onPress: () => console.log(""),
            style: "cancel",
          },
          { text: "OK", onPress: () => console.log("") },
        ]);
      }
    });
  };

  const handleResend = () => {
    setLoadingSendCode(true);
    const resendDetails = {
      Firstname: route.params.user.Firstname,
      Lastname: route.params.user.Lastname,
      Email: route.params.user.Email,
      Password: route.params.unhashed,
      ConfirmPassword: route.params.unhashed,
    };

    authService.register(resendDetails).then((data) => {
      if (data.message === "Verification email sent successfully") {
        setLoadingSendCode(false);

        navigation.navigate("Confirm_Register_code", data);
      } else {
        setLoadingSendCode(false);
        Alert.alert("Opps", `${data}`, [
          {
            text: "Cancel",
            onPress: () => console.log(""),
            style: "cancel",
          },
          { text: "OK", onPress: () => console.log("") },
        ]);
      }
    });
  };

  return (
    <View
      style={styles.root}
      className="flex-1  relative"
      softwareKeyboardLayoutMode="pan"
    >
      <View className=" py-10 mx-2 rounded-md shadow-2xl bg-white mt-48">
        <View className="px-10">
          <Text className="font-bold text-[22px]">Please Verify 🔒</Text>
          <Text className="mt-2 text-[11px] opacity-75">
            A 5 digit password code has been sent to{" "}
            {route?.params?.user?.Email}, please enter the code here
          </Text>
        </View>
        <CodeField
          ref={ref}
          {...props}
          // Use `caretHidden={false}` when users can't paste a text value, because context menu doesn't appear
          value={value}
          onChangeText={setValue}
          cellCount={CELL_COUNT}
          rootStyle={styles.codeFieldRoot}
          keyboardType="number-pad"
          textContentType="oneTimeCode"
          renderCell={({ index, symbol, isFocused }) => (
            <Text
              key={index}
              style={[styles.cell, isFocused && styles.focusCell]}
              onLayout={getCellOnLayoutHandler(index)}
            >
              {symbol || (isFocused ? <Cursor /> : null)}
            </Text>
          )}
        />
        <View className="px-10 mt-5 flex-row space-x-3">
          {loading ? (
            <Button
              title="Verifying.."
              color="#1C44A6"
              disabled
              style={{ width: "100%", marginTop: 10 }}
              trailing={(props) => (
                <ActivityIndicator size="small" color="#fff" />
              )}
            />
          ) : (
            <Button
              onPress={handleVerify}
              title="Verify"
              color="#1C44A6"
              style={{ width: "100%", marginTop: 10 }}
              trailing={(props) => (
                <Image source={arrowImg} className="w-3 h-3" />
              )}
            />
          )}
        </View>
      </View>
      {loadingSendCode ? (
        <TouchableOpacity
          className={` ${
            Platform.OS === "ios" ? "py-5" : "py-3"
          } w-5/12 mt-20  bg-[#F3661E] rounded-r-full  pr-12 pl-6 shadow-2xl flex-row items-center space-x-2`}
          onPress={handleResend}
        >
          <Text className="font-bold text-white text-[15px]">
            Please wait...
          </Text>
          <ActivityIndicator size="small" color="#fff" />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          className={` ${
            Platform.OS === "ios" ? "py-5" : "py-3"
          } w-5/12 mt-20  bg-[#F3661E] rounded-r-full  pr-12 pl-6 shadow-2xl flex-row items-center space-x-2`}
          onPress={handleResend}
        >
          <Text className="font-bold text-white text-[12px]">Resend Code</Text>
          <Image source={arrowImg} className="w-4 h-4" />
        </TouchableOpacity>
      )}

      {/* <View
        className={`absolute w-full ${
          Platform.OS === "ios" ? "top-0" : "top-0"
        }`}
      >
        <Image source={waveTop} className="w-full" />
      </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1 },
  title: { textAlign: "center", fontSize: 30 },
  codeFieldRoot: { marginTop: 20, paddingHorizontal: 32 },
  cell: {
    width: 40,
    height: 40,
    lineHeight: 38,
    fontSize: 24,
    borderWidth: 2,
    borderColor: "#00000030",
    textAlign: "center",
    marginHorizontal: 8,
  },
  focusCell: {
    borderColor: "#000",
  },
});

export default Confirm_Code_Register;
