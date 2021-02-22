<template>
  <div id="textInputEditor">
    <color-input
      label="Background color"
      v-model:color="component.backgroundColor"
    ></color-input>
    <color-input
      label="Active background color"
      v-model:color="component.backgroundColorActive"
    ></color-input>
    <div class="settings-row">
      <span class="label">Placeholder</span>
      <input type="text" v-model="component.placeHolder" />
    </div>
    <div class="settings-row">
      <span class="label">Default input</span>
      <input type="text" v-model="component.defaultInput" />
    </div>
    <div class="settings-row">
      <span class="label">Max input length</span>
      <input
        type="number"
        style="max-width: 40px"
        v-model.number="component.maxLength"
      />
    </div>
    <br />
    <span class="label heading">Text-Style</span>
    <color-input v-model:color="component.fontColor"></color-input>
    <color-input
      label="Placeholder Color"
      v-model:color="component.fontColorPlaceholder"
    ></color-input>
    <font-editor
      v-model:font="component.font"
      v-model:size="component.size"
    ></font-editor>
    <div class="label heading">Position</div>
    <div class="settings-row">
      <div class="input-box">
        <input type="number" v-model.number="component.x" /> <span>X</span>
      </div>
      <div class="input-box">
        <input type="number" v-model.number="component.width" /> <span>W</span>
      </div>
    </div>
    <div class="settings-row">
      <div class="input-box">
        <input type="number" v-model.number="component.y" /> <span>Y</span>
      </div>
      <div class="input-box">
        <input type="number" v-model.number="component.height" /> <span>H</span>
      </div>
    </div>
    <div class="settings-row">
      <div class="input-box">
        <input type="number" v-model.number="component.padding" />
        <span>Padding</span>
      </div>
    </div>
    <p style="margin-top: 15px">
      The user's input of this component is available through the placeholder
      <i>%advancedgui_textinput_{{ component.id }}%</i>. You will need to have
      PlaceholderAPI installed for the placeholder to work.
    </p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { TextInput } from "@/utils/components/TextInput";
import FontEditor from "@/components/FontEditor.vue";
import ColorInput from "../ColorInput.vue";

export default defineComponent({
  data() {
    return {};
  },

  components: { FontEditor, ColorInput },

  props: {
    component: {
      type: Object as () => TextInput,
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
        this.ensureValues();
      }
    }
  },

  methods: {
    ensureValues() {
      if (this.component.x == undefined) this.component.x = 0;
      if (this.component.y == undefined) this.component.y = 0;
      if (this.component.size == undefined) this.component.size = 0;

      const bounds = this.component.getBoundingBox();
      bounds.ensureBounds(this.maxWidth, this.maxHeight);
      this.component.modify(bounds);
    }
  }
});
</script>

<style lang="scss" scoped>
#textInputEditor {
  .heading {
    font-weight: bold;
  }

  .colorInput {
    width: 80px;
  }

  p i {
    color: $light3;
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
