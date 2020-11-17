<template>
  <div id="imageEditor">
    <div class="label heading">
      {{ gifMode ? "GIF" : "Image" }}
      <input
        type="text"
        class="imageNameInput"
        @input="val => component.setImage(val.target.value)"
        :value="component.image"
      />
    </div>
    <div class="settings-row imageList">
      <div
        class="imageBox"
        v-for="img in regImages
          .map(key => images[key])
          .filter(image => image.isGif == gifMode)"
        :key="img.name"
        :style="{ backgroundImage: `url(${img.data.src})` }"
        @click="component.setImage(img.name)"
        :class="component.image == img.name ? 'active' : ''"
      >
        <div class="delImage" @click.stop="unregisterImage(img.name)">
          <span class="material-icons">close</span>
        </div>
        <div class="imageName">{{ img.name }}</div>
      </div>
    </div>
    <div class="btn" @click="triggerFileSelector()">
      <span class="material-icons">add</span>
      Upload {{ gifMode ? "GIF" : "image" }}
      <input
        type="file"
        ref="fileDownload"
        :accept="gifMode ? '.gif' : '.png,.jpg'"
        style="display: none"
        multiple
        @change="checkForUpload()"
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
    <div class="settings-row" v-if="gifMode">
      <span class="label">Pause by default</span>
      <input type="checkbox" v-model="component.pausedByDefault" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Image } from "@/utils/components/Image";
import {
  images,
  regImages,
  registerImage,
  unregisterImage
} from "@/utils/manager/ImageManager";
import { Template } from "@/utils/components/Template";
import { GIF } from "@/utils/components/GIF";

export default defineComponent({
  data() {
    return {
      images,
      regImages,
      unregisterImage,
      inputTransformer: Template.inputTransformer
    };
  },

  props: {
    component: {
      type: Object as () => Image | GIF,
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
  .imageList {
    flex-wrap: wrap;
    justify-content: space-between;
    max-height: 150px;
    overflow-y: auto;
    margin-bottom: 10px !important;

    .imageBox {
      width: 80px;
      height: 80px;
      overflow: hidden;
      background-size: contain;
      background-position: center;
      background-repeat: no-repeat;
      image-rendering: pixelated;
      margin: 10px;
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      flex-direction: column;

      &.active {
        border: 2px solid $blue;
        box-sizing: border-box;
        background-color: $dark2;
      }

      &:hover {
        transform: scale(1.1);

        .imageName {
          white-space: normal;
        }
      }

      .imageName {
        background-color: rgba(0, 0, 0, 0.6);
        width: fit-content;
        white-space: nowrap;
        font-size: 12px;
        padding: 2px 10px;
      }

      .delImage {
        align-self: flex-end;
        padding-top: 3px;
        height: 17px;
        background-color: rgba(0, 0, 0, 0.6);

        .material-icons {
          color: $red;
          font-size: 20px !important;
          line-height: 0.4;
        }
      }
    }
  }
}
</style>
