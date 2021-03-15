<template>
  <div id="rectEditor">
    <color-input v-model:color="component.color"></color-input>
    <div class="settings-row">
      <span class="label">Border-radius</span>
      <input
        type="number"
        onkeypress="return event.charCode >= 48 && event.charCode <= 57"
        style="width: 48px"
        v-model.number="component.radius"
      />
    </div>
    <br />
    <span class="label">Dimensions</span>
    <div class="settings-row">
      <div class="input-box">
        <input
          type="number"
          @keypress="inputTransformer($event, component.x)"
          v-model.number="component.x"
        />
        <span>X</span>
      </div>
      <div class="input-box">
        <input
          type="number"
          @keypress="inputTransformer($event, component.width)"
          v-model.number="component.width"
        />
        <span>W</span>
      </div>
    </div>
    <div class="settings-row">
      <div class="input-box">
        <input
          type="number"
          @keypress="inputTransformer($event, component.y)"
          v-model.number="component.y"
        />
        <span>Y</span>
      </div>
      <div class="input-box">
        <input
          type="number"
          @keypress="inputTransformer($event, component.height)"
          v-model.number="component.height"
        />
        <span>H</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Rect } from "@/utils/components/Rect";
import { Template } from "@/utils/components/Template";
import ColorInput from "../ColorInput.vue";

export default defineComponent({
  components: { ColorInput },
  data() {
    return {
      inputTransformer: Template.inputTransformer
    };
  },

  props: {
    component: {
      type: Object as () => Rect,
      required: true
    },
    maxHeight: {
      type: Number,
      required: true
    },
    maxWidth: {
      type: Number,
      required: true
    }
  },

  watch: {
    component: {
      deep: true,
      handler() {
        this.ensureBounds();
      }
    }
  },

  methods: {
    ensureBounds() {
      const bounds = this.component.getBoundingBox();
      bounds.ensureBounds(this.maxWidth, this.maxHeight);
      this.component.modify(bounds);

      const minDim = Math.min(this.component.height, this.component.width);
      if (this.component.radius > minDim / 2) {
        this.component.radius = Math.floor(minDim / 2);
      }
    }
  }
});
</script>

<style lang="scss" scoped>
#rectEditor {
}
</style>
