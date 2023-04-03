import {
  View,
  Text,
  SafeAreaView,
  Image,
  ImageBackground,
  Animated,
} from "react-native";
import React, { useEffect, useRef } from "react";
import banner from "../assets/welcome3-min.jpg";
import { Dimensions } from "react-native";
import { useWindowDimensions } from "react-native";
import { Button } from "@react-native-material/core";
import { TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

const Welcome = () => {
  const naviagtion = useNavigation();
  const windowWidth = Dimensions.get("window").width;
  const windowHeight = Dimensions.get("screen").height;

  const FadeInView = (props) => {
    const fadeAnim = useRef(new Animated.Value(0)).current; // Initial value for opacity: 0

    useEffect(() => {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      }).start();
    }, [fadeAnim]);

    return (
      <Animated.View // Special animatable View
        style={{
          ...props.style,
          opacity: fadeAnim, // Bind opacity to animated value
        }}
      >
        {props.children}
      </Animated.View>
    );
  };

  return (
    <FadeInView className="flex-1">
      <ImageBackground
        source={banner}
        style={{
          width: windowWidth,
          opacity: 0.9,
          height: windowHeight,
        }}
      >
        <View
          className="flex-1 px-5 "
          style={{ backgroundColor: "rgba(21, 101, 192, 0.45)" }}
        >
          <View className="flex-1 items-center justify-center">
            <Text className="text-[40px] font-black text-white">
              Abovi<Text className=" text-[#F3661E]">PH</Text>
            </Text>
            <Text className="pl-12 text-[12px] -mt-2 font-bold text-white">
              Delivery on the go...
            </Text>
          </View>
          <View className="flex-row bottom-20 space-x-2">
            <TouchableOpacity
              className="py-4 w-6/12 items-center justify-center bg-[#F3661E] rounded-md"
              onPress={() => naviagtion.navigate("Login")}
            >
              <Text className="uppercase text-white text-[12px] font-semibold ">
                Customer
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="py-4 w-6/12 items-center justify-center bg-[#1C44A6] rounded-md"
              onPress={() => naviagtion.navigate("Agent_Login")}
            >
              <Text className="uppercase text-white text-[12px] font-semibold ">
                AbovePh-Rep
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </FadeInView>
  );
};

export default Welcome;
