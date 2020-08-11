<template>
  <div>
    <h1>Component</h1>
    <input type="color" v-model="component.color" />
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  data() {
    return {};
  },

  props: ["component"]
});
</script>

<style lnag="scss" scoped></style>
