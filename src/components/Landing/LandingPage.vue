<template>
  <div class="site-content">
    <div class="site-header">
      <div class="container">
        <a href="index.html" class="branding">
          <img
            src="https://www.bizmates.ph/common/images/logo_big.png"
            alt=""
            class="logo"
          />
          <div class="logo-type">
            <h1 class="site-title">Bizmate PH</h1>
            <small class="site-description">Weather App</small>
          </div>
        </a>

        <div class="mobile-navigation"></div>
      </div>
    </div>
    <!-- .site-header -->

    <div class="hero" data-bg-image="images/banner.png">
      <div class="container">
        <form class="find-location">
          <input
            type="text"
            placeholder="Find your location..."
            v-model="search"
          />
          <input type="submit" value="Find" @click="getPlace" />
        </form>
      </div>
    </div>
    <div
      class="forecast-table"
      v-if="!loading && currentDate && place && weather && weather.length > 0"
    >
      <div class="container">
        <div class="forecast-container">
          <div class="today forecast">
            <div class="forecast-header">
              <div class="day">{{ currentDate?.format("dddd") }}</div>
              <div class="date">{{ currentDate?.format("DD MMM") }}</div>
            </div>
            <!-- .forecast-header -->
            <div class="forecast-content">
              <div class="location">
                {{
                  place.data[0].name + " " + "(" + place.data[0].country + ")"
                }}
              </div>
              <div class="degree">
                <div class="num">
                  {{ Math.floor(weatherToday?.main?.temp) }}<sup>o</sup>C
                </div>
              </div>
              <span
                ><img src="images/icon-umberella.png" alt="" />{{
                  weatherToday?.rain
                }}%</span
              >
              <span
                ><img src="images/icon-wind.png" alt="" />{{
                  weather[0].wind.gust
                }}km/h</span
              >
              <span>{{
                weatherToday?.weather[0]?.description?.toUpperCase()
              }}</span>
            </div>
          </div>
          <div class="forecast" v-for="day in weather" :key="day.dt">
            <div class="forecast-header">
              <div class="day">{{ day.date }}</div>
            </div>
            <!-- .forecast-header -->
            <div class="forecast-content">
              <div>
                <div class="forecast-icon">LIGHT RAIN</div>
                <div class="degree">23<sup>o</sup>C</div>
                <small>18<sup>o</sup></small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="forecast-table" v-else>
      <div class="container">
        <div class="forecast-container loading">
          <img src="/images/loading.png" />
          <br />
          <h2>LOADING...</h2>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getPlaceRequest, getWeatherRequest } from "@/api/weather";
import moment from "moment";

export default {
  name: "LandingPage",
  props: {
    msg: String
  },
  data() {
    return {
      place: null,
      search: "Tokyo",
      loading: false,
      currentDate: null,
      weather: null,
      weatherToday: null
    };
  },
  mounted() {
    this.getPlace();
    this.currentDate = moment();
  },
  methods: {
    async getWeather(lat, lon) {
      return await getWeatherRequest(lat, lon);
    },
    getPlace() {
      this.loading = true;
      getPlaceRequest(this.search)
        .then((res) => {
          this.place = res.data;
          if (res?.data?.data[0]) {
            this.getWeather(res.data.data[0].lat, res.data.data[0].lon).then(
              (response) => {
                this.weather = response.data.data.list.filter((day, index) => {
                  console.log(new Date(day.dt * 1000));
                  if (index !== 0) {
                    // console.log(moment.unix(day.dt).format("dddd"));
                    return {
                      ...day,
                      date: moment.unix(day.dt),
                      rain: day.rain ? Object.values(day.rain)[0] * 100 : 0,
                      nameOfDay: moment.unix(day.dt).format("dddd")
                    };
                  } else {
                    this.weatherToday = {
                      ...day,
                      date: moment.unix(day.dt),
                      rain: day.rain ? Object.values(day.rain)[0] * 100 : 0
                    };
                    return;
                  }
                });
              }
            );
          }
          this.loading = false;
        })
        .catch((e) => {
          console.log(e);
          this.loading = false;
        });
    }
  }
};
</script>

<style>
.logo {
  width: 15rem;
}
.hero {
  background-image: url("https://3dwarehouse.sketchup.com/warehouse/v1.0/publiccontent/220f4dbe-de31-40d5-9a0b-a2827a6e05d2");
  background-size: cover;
  background-position: 0rem;
}
.loading {
  text-align: center;
}
</style>
