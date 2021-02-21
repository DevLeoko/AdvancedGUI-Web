<template>
  <div class="settings-row">
    <span class="label">Color</span>
    <input type="color" v-model="colorHex" />
    <input type="text" style="max-width: 60px" v-model="colorHex" />
    <input
      type="number"
      style="max-width: 40px; text-align: right"
      :value="alpha * 100"
      @input="
        alpha = Math.max(Math.min(Math.round($event.target.value) / 100, 1), 0);
        $event.target.value = alpha * 100;
      "
    />
    <i style="opacity: 0.5">%</i>
  </div>
  <div class="settings-row" v-if="devMode">
    <span class="label">Dev Color</span>
    <input
      type="text"
      style="max-width: 157px"
      :value="color"
      @input="$emit('update:color', $event.target.value)"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { hexToRgba, rgbaToHex } from "../utils/ColorUtils";
import { devMode } from "@/App.vue";

export default defineComponent({
  data() {
    return {
      devMode,
      colorHex: "#FFFFFF",
      alpha: 1.0
    };
  },

  props: {
    color: {
      type: String,
      required: true
    }
  },

  emits: ["update:color"],

  watch: {
    color: {
      immediate: true,
      handler(val: string) {
        const conv = rgbaToHex(val);
        this.colorHex = conv.hex;
        this.alpha = conv.alpha;
      }
    },

    alpha() {
      this.updateColor();
    },

    colorHex() {
      this.updateColor();
    }
  },

  methods: {
    updateColor() {
      this.$emit("update:color", hexToRgba(this.colorHex, this.alpha));
    }
  }
});
</script>

<style lang="scss" scoped></style>
