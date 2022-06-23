<template>
  <div class="col-md-6">
    <h2 class="section-title">Details</h2>
    <ul class="arrow-feature">
      <li>
        <h3>State</h3>
        <p>
          {{ state }}
        </p>
      </li>
      <li>
        <h3>City</h3>
        <p>
          {{ city }}
        </p>
      </li>
      <li>
        <h3>Address</h3>
        <p>
          {{ address }}
        </p>
      </li>
      <li>
        <h3>Population</h3>
        <p>
          {{ population }}
        </p>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "PlaceDetails",
  props: {
    state: String,
    city: String,
    address: String,
    population: String
  },
  mounted() {}
};
</script>
