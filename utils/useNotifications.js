import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { url } from "./Api";
import axios from "axios";

export const useNotification = () => {
  async function registerForPushNotificationsAsync() {
    let token;

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!");
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
      if (token) {
        try {
          await axios.post(`${url}/abovi/notifications`, { token });
        } catch (error) {
          console.log(error);
        }
      }
    } else {
      alert("Must use physical device for Push Notifications");
    }
  }

  return { registerForPushNotificationsAsync };
};
