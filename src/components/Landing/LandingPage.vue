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
            <h1 class="site-title">Bizmates PH</h1>
            <small class="site-description">Weather App</small>
          </div>
        </a>

        <div class="mobile-navigation"></div>
      </div>
    </div>
    <!-- .site-header -->

    <div class="hero" data-bg-image="images/banner.png">
      <div class="container">
        <form class="find-location" @submit="getPlace">
          <input
            type="text"
            placeholder="Find your location..."
            v-model="search"
          />
          <input type="submit" value="Find" />
        </form>
      </div>
    </div>
    <div
      class="forecast-table"
      v-if="!loading && currentDate && place && weather && weather.length > 0"
    >
      <div class="container">
        <div class="forecast-container">
          <div class="row">
            <div class="today forecast col-lg-4 col-sm-12">
              <div class="forecast-header">
                <div class="day">{{ currentDate?.format("dddd") }}</div>
                <div class="date">
                  {{ currentDate?.format("DD MMM hh:mm A") }}
                </div>
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
                  ><img src="images/icon-wind.png" alt="" />{{
                    weatherToday?.wind?.gust
                  }}
                  km/h</span
                >
                <span>{{
                  weatherToday?.weather[0]?.description?.toUpperCase()
                }}</span>
              </div>
            </div>

            <div
              class="forecast col-lg-2 col-md-3 col-12"
              v-for="day in weather"
              :key="day.dt"
            >
              <div class="forecast-header">
                <div class="day">{{ day.date.format("DD MMM") }}</div>
              </div>
              <!-- .forecast-header -->
              <div class="forecast-content">
                <div>
                  <div class="forecast-icon">
                    <b> {{ day.date.format("hh:mm A") }} </b>
                  </div>
                  <div class="degree">
                    {{ Math.floor(day.main.temp) }}<sup>o</sup>C
                  </div>
                  <small>
                    {{ day.weather.description.toUpperCase() }}
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <main class="main-content">
        <div class="fullwidth-block">
          <div class="container">
            <div class="row">
              <PlaceDetails
                :state="placeDetail?.state"
                :city="placeDetail?.city"
                :address="placeDetail?.formatted"
                :population="searchDetail?.population"
              />
              <ForcastDetails
                :sunset="searchDetail.sunset"
                :sunrise="searchDetail.sunrise"
                :tempature_min="weatherToday?.main?.temp_min"
                :tempature_max="weatherToday?.main?.temp_max"
              />
            </div>
          </div>
        </div>
      </main>
    </div>

    <div class="forecast-table" v-if="!hasError && loading">
      {{ !hasError }}
      {{ loading }}
      <div class="container">
        <div class="forecast-container loading">
          <img src="/images/loading.png" />
          <br />
          <h2>LOADING...</h2>
        </div>
      </div>
    </div>

    <div class="forecast-table" v-if="hasError && !loading">
      <div class="container">
        <div class="forecast-container loading">
          <br />
          <h2>Unable to connect to server</h2>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getPlaceRequest,
  getWeatherRequest,
  getPlaceDetailsRequest
} from "@/api/weather";

import moment from "moment";
import PlaceDetails from "./components/PlaceDetails.vue";
import ForcastDetails from "./components/ForcastDetails.vue";

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
      weatherToday: null,
      hasError: false,
      placeDetail: null,
      searchDetail: null
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
    getPlace(e) {
      if (e) {
        console.log(e);
        e.preventDefault();
      }
      this.loading = true;
      getPlaceRequest(this.search)
        .then((res) => {
          this.place = res.data;

          if (res?.data?.data.length > 0 && res?.data?.data[0]) {
            this.getWeather(res.data.data[0].lat, res.data.data[0].lon).then(
              (response) => {
                this.searchDetail = {
                  ...response.data.data.city,
                  sunset: moment
                    .unix(response.data.data.city.sunset)
                    .format("hh:mm:ss A"),
                  sunrise: moment
                    .unix(response.data.data.city.sunrise)
                    .format("hh:mm:ss A")
                };
                this.weather = response.data.data.list.map((day, index) => {
                  if (index !== 0) {
                    return {
                      ...day,
                      weather: day.weather[0],
                      date: moment.unix(day.dt)
                    };
                  } else {
                    this.weatherToday = {
                      ...day,
                      date: moment.unix(day.dt)
                    };
                    return {
                      ...day,
                      date: moment.unix(day.dt)
                    };
                  }
                });
                this.weather.splice(0, 1);
                this.hasError = false;
              }
            );
            getPlaceDetailsRequest(
              res.data.data[0].lat,
              res.data.data[0].lon
            ).then((details) => {
              if (
                details &&
                details.data &&
                details.data.data.results &&
                details.data.data.results.length > 0
              ) {
                this.placeDetail = details.data.data.results[0];
              }
            });
            this.loading = false;
          } else if (res.data.data.cod === "400") {
            this.hasError = true;
            this.loading = true;
            this.$swal({
              title: "Unable to locate place, please try again",
              icon: "error"
            });
          }
        })
        .catch((e) => {
          console.log(e);
          this.$swal({
            title: "Unable to connect to server",
            icon: "error"
          });
          this.loading = false;
          this.hasError = true;
        });
    }
  },
  components: { PlaceDetails, ForcastDetails }
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
.forecast-content {
  width: 100% !important;
}
</style>
