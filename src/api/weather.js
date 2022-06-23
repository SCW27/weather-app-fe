import axios from "axios";

export const getWeatherRequest = async (lat, lon) => {
  return await axios.get(
    `${process.env.VUE_APP_BE_BASE_URL}/weather?lat=${lat}&lon=${lon}`,
    {
      headers: {
        accept: "application/json"
      }
    }
  );
};

export const getPlaceRequest = (place = "") => {
  return axios.get(`${process.env.VUE_APP_BE_BASE_URL}/place?place=${place}`, {
    headers: {
      accept: "application/json"
    }
  });
};

export const getPlaceDetailsRequest = (lat = "", lon = "") => {
  return axios.post(
    `${process.env.VUE_APP_BE_BASE_URL}/place/details`,
    {
      lat,
      lon
    },
    {
      headers: {
        accept: "application/json"
      }
    }
  );
};
