<template>
  <div
    :class="!dragIndication ? 'invisible' : ''"
    class="dropzone"
    @dragover.prevent.self="ev => ev.target.classList.add('targeted')"
    @dragleave.self="ev => ev.target.classList.remove('targeted')"
    @drop.self="$emit('drop')"
    ref="zonee"
  ></div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  props: {
    dragIndication: { type: Boolean }
  },
  data() {
    return {};
  }
});
</script>

<style lang="scss" scoped></style>
