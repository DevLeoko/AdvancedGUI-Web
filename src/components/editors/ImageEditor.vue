<template>
  <div id="imageEditor">
    <div class="label heading">Image</div>
    <div class="settings-row imageList">
      <div
        class="imageBox"
        v-for="img in images"
        :key="img.name"
        :style="{ backgroundImage: `url(${img.data.src})` }"
        @click="component.setImage(img.name)"
        :class="component.image == img.name ? 'active' : ''"
      ></div>
    </div>
    <div class="btn" @click="triggerFileSelector()">
      <span class="material-icons">add</span>
      Upload image
      <input
        type="file"
        ref="fileDownload"
        accept=".png,.jpg"
        style="display: none"
        multiple
        @change="checkForUpload()"
      />
    </div>
    <br />
    <span class="label">Dimensions</span>
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
      <span class="label">Keep ratio</span>
      <input type="checkbox" v-model="component.keepImageRatio" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Image } from "@/utils/components/Image";
import { images, registerImage } from "@/utils/ImageManager";

export default Vue.extend({
  data() {
    return {
      images
    };
  },

  props: {
    component: {
      type: Object as () => Image
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

  methods: {
    ensureBounds() {
      const bounds = this.component.getBoundingBox();
      bounds.ensureBounds(this.maxWidth, this.maxHeight);
      this.component.modify(bounds, true);
    },

    triggerFileSelector() {
      (this.$refs.fileDownload as HTMLElement).click();
    },

    checkForUpload() {
      const selector = this.$refs.fileDownload as HTMLInputElement;

      if (selector.files?.length) {
        for (const file of selector.files) {
          registerImage(file, file.name.substr(0, file.name.length - 4));
        }
      }
    }
  }
});
</script>

<style lang="scss" scoped>
#imageEditor {
  .imageList {
    flex-wrap: wrap;
    justify-content: space-between;
    max-height: 150px;
    overflow-y: auto;
    margin-bottom: 10px !important;

    .imageBox {
      width: 80px;
      height: 80px;
      background-size: contain;
      background-position: center;
      background-repeat: no-repeat;
      margin: 10px;
      cursor: pointer;

      &.active {
        border: 2px solid $blue;
        box-sizing: border-box;
        background-color: $dark2;
      }

      &:hover {
        transform: scale(1.1);
      }
    }
  }
}
</style>
