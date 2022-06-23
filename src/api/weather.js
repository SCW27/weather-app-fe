import axios from "axios";

export const getWeatherRequest = async (lat, lon) => {
  return await axios.get(
    `${process.env.VUE_APP_BE_BASE_URL}/weather?lat=${lat}&lon=${lon}`
  );
};

export const getPlaceRequest = (place = "") => {
  return axios.get(`${process.env.VUE_APP_BE_BASE_URL}/place?place=${place}`);
};
