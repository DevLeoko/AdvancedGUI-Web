<template>
  <div id="textEditor">
    <div class="settings-row">
      <span class="label">Color</span>
      <input type="color" v-model="component.color" />
      <input type="text" class="colorInput" v-model="component.color" />
    </div>
    <div class="settings-row">
      <span class="label">Text</span>
      <input type="text" v-model="component.text" />
    </div>
    <div class="settings-row">
      <span class="label">Contains placeholders</span>
      <input type="checkbox" v-model="component.placeholder" />
    </div>
    <br />
    <span class="label">Style</span>
    <div class="settings-row">
      <div class="input-box">
        <input type="number" v-model.number="component.size" />
        <span>Size</span>
      </div>
    </div>
    <div class="settings-row">
      <div class="input-box">
        <select v-model="component.font">
          <option
            v-for="font in Object.keys(fonts)"
            :key="font"
            :value="font"
            >{{ font }}</option
          >
        </select>
        <span>Font</span>
      </div>
    </div>
    <div class="settings-row">
      <a @click="triggerFileSelector()">Upload custom font</a>
      <input
        type="file"
        ref="fileDownload"
        accept=".ttf"
        style="display: none"
        @change="checkForUpload()"
      />
    </div>
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
import Vue from "vue";
import { Text } from "@/utils/components/Text";
import { registerFont, fonts } from "@/utils/FontManager";

export default Vue.extend({
  data() {
    return {
      fonts
    };
  },

  props: {
    component: {
      type: Object as () => Text
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
    },

    triggerFileSelector() {
      (this.$refs.fileDownload as HTMLElement).click();
    },

    checkForUpload() {
      const selector = this.$refs.fileDownload as HTMLInputElement;

      if (selector.files?.length) {
        const file = selector.files[0];
        registerFont(file, file.name.substr(0, file.name.length - 4));
      }
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

  select {
    width: 150px !important;
  }
}
</style>
