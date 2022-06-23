<template>
  <div class="col-md-6">
    <h2 class="section-title">Forecast</h2>
    <ul class="arrow-feature">
      <li>
        <h3>Sunrise</h3>
        <p>
          {{ sunrise }}
        </p>
      </li>
      <li>
        <h3>Sunset</h3>
        <p>
          {{ sunset }}
        </p>
      </li>
      <li>
        <h3>Temperature</h3>
        <p>{{ tempature_min }}°C - {{ tempature_max }}°C</p>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "ForcastDetails",
  props: {
    sunrise: String,
    sunset: String,
    tempature_min: String,
    tempature_max: String
  },
  mounted() {}
};
</script>
