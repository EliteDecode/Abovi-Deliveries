import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { url } from "./Api";
const AppContext = React.createContext();

const AppProvider = ({ children, handleLogout, handleLogoutAgent }) => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [Email, setEmail] = useState("");
  const [Firstname, setFirstname] = useState("");
  const [Lastname, setLastname] = useState("");
  const [Address, setAddress] = useState("");
  const [Phone, setPhone] = useState(null);

  const [EmailAgent, setEmailAgent] = useState("");
  const [FirstnameAgent, setFirstnameAgent] = useState("");
  const [LastnameAgent, setLastnameAgent] = useState("");
  const [AddressAgent, setAddressAgent] = useState("");
  const [PhoneAgent, setPhoneAgent] = useState(null);

  const update = async (userData, userId, token) => {
    console.log("here");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const { data } = await axios.put(
        `${url}/abovi/users/${userId}/update_profile`,
        userData,
        config
      );

      console.log(data);

      if (data.message.includes("Congratulations")) {
        await AsyncStorage.setItem("userData", JSON.stringify(data));
        setAddress(data.data.Address);
        setEmail(data.data.Email);
        setFirstname(data.data.Firstname);
        setLastname(data.data.Lastname);
        setPhone(data.data.Phone);
      }
      return data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      console.log(message);
      return message;
    }
  };

  const deleteAccount = async (userId, token) => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const { data } = await axios.delete(
        `${url}/abovi/users/${userId}/delete_account`,
        config
      );

      if (data.message.includes("deleted")) {
        await AsyncStorage.removeItem("userData");
      }
      return data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();

      return message;
    }
  };

  const Verify_update = async (userData) => {
    try {
      const { data } = await axios.post(
        `${url}/abovi/users/verify_update_profile`,
        userData
      );
      await AsyncStorage.setItem("userData", JSON.stringify(data));
      console.log(data);

      if (data.message.includes("verified")) {
        await AsyncStorage.setItem("userData", JSON.stringify(data));
        setAddress(data.data.Address);
        setEmail(data.data.Email);
        setFirstname(data.data.Firstname);
        setLastname(data.data.Lastname);
        setPhone(data.data.Phone);
      }
      return data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      console.log(message);
      return message;
    }
  };

  const updatePassword = async (userData, userId, token) => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const { data } = await axios.put(
        `${url}/abovi/users/${userId}/update_password`,
        userData,
        config
      );
      console.log(data);
      return data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();

      return message;
    }
  };

  const forgotPassword = async (userData) => {
    try {
      const { data } = await axios.post(`${url}/abovi/users/forgot_password`, {
        email: userData,
      });
      console.log(data);
      return data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      console.log(error);
      return message;
    }
  };

  return (
    <AppContext.Provider
      value={{
        update,
        loading,
        setLoading,
        updatePassword,
        Phone,
        Email,
        Firstname,
        Lastname,
        Address,
        PhoneAgent,
        EmailAgent,
        FirstnameAgent,
        LastnameAgent,
        AddressAgent,
        setAddress,
        setEmail,
        setFirstname,
        setLastname,
        setPhone,
        setAddressAgent,
        setEmailAgent,
        setFirstnameAgent,
        setLastnameAgent,
        setPhoneAgent,
        Verify_update,
        deleteAccount,
        forgotPassword,
        handleLogout,
        handleLogoutAgent,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useGlobalContext = () => {
  return useContext(AppContext);
};

export { AppContext, AppProvider };
