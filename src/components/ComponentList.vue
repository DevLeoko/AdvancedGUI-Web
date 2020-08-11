<template>
  <h1>Component-List</h1>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "@/utils/Component";

export default Vue.extend({
  data() {
    return {};
  },
  props: {
    components: {
      type: Array as () => Component[]
    }
  }
});
</script>

<style lnag="scss" scoped></style>
