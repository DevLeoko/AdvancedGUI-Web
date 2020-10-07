<template>
  <div id="imageEditor">
    <div class="label heading">
      {{ gifMode ? "GIF" : "Image" }}
      <input
        type="text"
        class="imageNameInput"
        @input="val => component.setImageUrl(val.target.value)"
        :value="component.imageUrl"
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
    <div class="settings-row">
      <span class="label">Keep ratio</span>
      <input type="checkbox" v-model="component.keepImageRatio" />
    </div>
    <div class="settings-row">
      <span class="label">Dithering</span>
      <input type="checkbox" v-model="component.dithering" />
    </div>
    <div class="settings-row">
      <span class="label">Preview loading component</span>
      <input type="checkbox" v-model="component.drawLoading" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import {
  images,
  registerImage,
  unregisterImage
} from "@/utils/manager/ImageManager";
import { Template } from "@/utils/components/Template";
import { RemoteImage } from "@/utils/components/RemoteImage";

export default Vue.extend({
  data() {
    return {
      images,
      unregisterImage,
      inputTransformer: Template.inputTransformer
    };
  },

  props: {
    component: {
      type: Object as () => RemoteImage
    },
    maxHeight: {
      type: Number
    },
    maxWidth: {
      type: Number
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

  computed: {
    gifMode(): boolean {
      return this.component.displayName == "GIF";
    }
  },

  methods: {
    ensureBounds() {
      const bounds = this.component.getBoundingBox();
      bounds.ensureBounds(this.maxWidth, this.maxHeight);
      this.component.modify(bounds);
    },

    triggerFileSelector() {
      (this.$refs.fileDownload as HTMLElement).click();
    },

    checkForUpload() {
      const selector = this.$refs.fileDownload as HTMLInputElement;

      if (selector.files?.length) {
        for (const file of selector.files) {
          registerImage(
            file,
            file.name.substr(0, file.name.length - 4),
            this.gifMode
          );
        }
      }
    }
  }
});
</script>

<style lang="scss" scoped>
#imageEditor {
}
</style>
