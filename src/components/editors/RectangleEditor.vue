<template>
  <div id="rectEditor">
    <div class="settings-row">
      <span class="label">Color</span>
      <input type="color" v-model="component.color" />
      <input type="text" class="colorInput" v-model="component.color" />
    </div>
    <div class="settings-row">
      <span class="label">Transparent</span>
      <input
        type="checkbox"
        :checked="component.color == 'transparent'"
        @change="setTransparent"
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

export default defineComponent({
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
    },

    setTransparent(ev: InputEvent) {
      if ((ev?.target as HTMLInputElement).checked)
        this.component.color = "transparent";
      else this.component.color = "#ffffff";
    }
  }
});
</script>

<style lang="scss" scoped>
#rectEditor {
  .colorInput {
    width: 80px;
  }
}
</style>
