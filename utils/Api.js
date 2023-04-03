import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const url = `https://backend-abovi-delivery-app.onrender.com`;
// export const url = `http://192.168.43.235:5000`;
//Register user
const register = async (userData) => {
  try {
    const { data } = await axios.post(`${url}/abovi/users/`, userData);
    return data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();

    return message;
  }
};
//verify

const verify = async (userData) => {
  try {
    const { data } = await axios.post(`${url}/abovi/users/verify`, userData);
    await AsyncStorage.setItem("userData", JSON.stringify(data));
    return data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();

    return message;
  }
};

//logout

const logout = async () => {
  await AsyncStorage.removeItem("userData");
};

//login

const login = async (userData) => {
  try {
    const { data } = await axios.post(`${url}/abovi/users/login`, userData);
    await AsyncStorage.setItem("userData", JSON.stringify(data));
    return data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();

    return message;
  }
};

//agentLogin

const agentLogin = async (userData) => {
  try {
    const { data } = await axios.post(`${url}/abovi/agents/login`, userData);
    await AsyncStorage.setItem("agentData", JSON.stringify(data));
    console.log(data);
    return data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();

    return message;
  }
};

//update

const authService = {
  register,
  logout,
  verify,
  login,
  agentLogin,
};

export default authService;
