<template>
  <div id="textEditor">
    <color-input v-model:color="component.color"></color-input>
    <div class="settings-row">
      <span class="label">Text</span>
      <textarea :rows="5" v-model="component.text" />
    </div>
    <p style="font-size: 10pt;">
      You can change the color of words by using minecraft color codes <br>(e.g. <i
        style="font-family: 'Courier New', Courier, monospace;">§aTest</i> for green).
    </p>
    <div class="settings-row">
      <span class="label">Contains placeholders</span>
      <input type="checkbox" v-model="component.placeholder" />
    </div>
    <div class="settings-row" v-if="component.placeholder">
      <span class="label">Preview Text</span>
      <textarea v-model="component.previewText" />
    </div>
    <br />
    <span class="label">Style</span>
    <div class="settings-row">
      <div class="alignOptions">
        <i class="material-icons" @click="component.alignment = 0" :class="component.alignment == 0 ? 'active' : ''">
          format_align_left
        </i>
        <i class="material-icons" @click="component.alignment = 1" :class="component.alignment == 1 ? 'active' : ''">
          format_align_center
        </i>
        <i class="material-icons" @click="component.alignment = 2" :class="component.alignment == 2 ? 'active' : ''">
          format_align_right
        </i>
      </div>
    </div>
    <font-editor v-model:font="component.font" v-model:size="component.size"></font-editor>
    <div class="label heading">Position</div>
    <div class="settings-row">
      <div class="input-box">
        <input type="number" v-model.number="component.x" /> <span>X</span>
      </div>
      <div class="input-box">
        <input type="number" v-model.number="component.y" /> <span>Y</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Text } from "@/utils/components/Text";
import FontEditor from "@/components/FontEditor.vue";
import ColorInput from "../ColorInput.vue";

export default defineComponent({
  data() {
    return {};
  },

  components: { FontEditor, ColorInput },

  props: {
    component: {
      type: Object as () => Text,
      required: true
    }
  },

  watch: {
    component: {
      deep: true,
      handler() {
        this.ensureValues();
      }
    }
  },

  methods: {
    ensureValues() {
      if (this.component.x == undefined) this.component.x = 0;
      if (this.component.y == undefined) this.component.y = 0;
      if (this.component.size == undefined) this.component.size = 0;
    }
  }
});
</script>

<style lang="scss" scoped>
#textEditor {
  .colorInput {
    width: 80px;
  }

  a {
    font-size: 14px;
  }

  .alignOptions {
    display: flex;
    align-items: center;

    color: $light4;
    border: $inputBorder;
    padding: 5px 10px;
    border-radius: 5px;

    i {
      cursor: pointer;
      font-size: 20px;

      &:hover {
        color: $light2;
      }

      &.active {
        color: $light;
      }

      &:nth-child(2) {
        margin: 0px 10px;
      }
    }
  }
}
</style>
