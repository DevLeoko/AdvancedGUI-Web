<template>
  <div>
    <div class="moreMenu absoluteMenu" ref="moreMenu">
      <template v-if="optElem">
        <div class="entry" @click.stop="deleteOpt()">
          <span class="material-icons">delete</span> Delete
        </div>
        <div class="divider"></div>
        <div class="entry" @click.stop="duplicateOpt()">
          <span class="material-icons">content_copy</span>
          Duplicate
        </div>
        <div class="divider"></div>
        <div
          class="entry"
          v-if="optElem.hideable"
          @click.stop="visibilityOpt()"
        >
          <span class="material-icons">{{
            invisible.indexOf(optElem.id) != -1
              ? "visibility"
              : "visibility_off"
          }}</span>
          {{ invisible.indexOf(optElem.id) != -1 ? "Show" : "Hide" }}
        </div>
      </template>
    </div>
    <div>
      <drag-zone
        v-if="activeIndex != 0"
        :dragIndication="!!treeState.dragElement"
        @drop="dragDrop(0)"
      ></drag-zone>
      <div v-for="(elem, index) in components" :key="elem.id">
        <div
          class="item"
          :class="
            (value == elem ? 'active ' : '') +
              (elem.id && invisible.indexOf(elem.id) != -1 ? 'invisible' : '')
          "
          @click.stop="$emit('input', elem)"
          draggable="true"
          ondragstart="event.dataTransfer.setData('text/plain',null)"
          @dragstart.self="ev => dragStart(ev.target, elem, index)"
          @dragend.self="ev => dragEnd(ev.target)"
          @dragover.prevent
        >
          <div class="itemName row">
            <span class="material-icons dragIndicator">drag_indicator</span>
            <span class="material-icons"> {{ elem.icon }} </span>{{ elem.id }}

            <span
              class="material-icons moreMenuBtn"
              @click.stop="ev => openMenu(elem, ev)"
              >more_vert</span
            >
          </div>
          <div class="subFolder" v-if="elem.isGroup()">
            <component-list
              :components="elem.getItems()"
              :value="value"
              :treeState="treeState"
              @input="val => $emit('input', val)"
              @change="$emit('change')"
            ></component-list>
          </div>
        </div>
        <drag-zone
          :dragIndication="!!treeState.dragElement"
          @drop="dragDrop(index + 1)"
          v-if="activeIndex != index && activeIndex != index + 1"
        ></drag-zone>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import DragZone from "./DragZone.vue";
import Vue from "vue";
import { ListItem } from "@/utils/ListItem";
import { toggleVis, invisible } from "@/utils/ComponentManager";

export default Vue.extend({
  name: "ComponentList",

  components: { DragZone },

  data() {
    return {
      activeIndex: -2,
      optElem: null as null | ListItem,
      invisible,
      toggleVis
    };
  },

  props: {
    components: {
      type: Array as () => ListItem[]
    },
    value: {
      type: Object as () => ListItem
    },
    root: {
      type: Boolean,
      default: false
    },
    treeState: {
      type: Object as () => {
        dragElement: null | ListItem;
        dragElementsList: null | ListItem[];
      },
      default: () => ({
        dragElement: null as null | ListItem,
        dragElementsList: null as null | ListItem[]
      })
    }
  },

  mounted() {
    document.addEventListener("click", this.checkClose, { capture: true });
  },

  destroyed() {
    document.removeEventListener("click", this.checkClose, { capture: true });
  },

  methods: {
    dragStart(target: HTMLElement, elem: ListItem, index: number) {
      target.classList.add("dragging");
      this.treeState.dragElement = elem;
      this.treeState.dragElementsList = this.components;
      this.activeIndex = index;
    },

    dragEnd(target: HTMLElement) {
      target.classList.remove("dragging");
      this.treeState.dragElement = null;
      this.treeState.dragElementsList = null;
      this.activeIndex = -2;
    },

    dragDrop(index: number) {
      if (!this.treeState.dragElement) return;

      const oldIndex = this.treeState.dragElementsList?.indexOf(
        this.treeState.dragElement
      );

      if (oldIndex !== undefined && oldIndex != -1)
        this.treeState.dragElementsList?.splice(oldIndex, 1);

      this.components.splice(index, 0, this.treeState.dragElement);

      this.$emit("change");
    },

    openMenu(elem: ListItem, ev: MouseEvent) {
      const moreMenu = this.$refs.moreMenu as HTMLElement;
      moreMenu.style.top = ev.y + "px";
      moreMenu.style.left = ev.x + "px";
      moreMenu.style.display = "block";
      this.optElem = elem;
    },

    checkClose(ev: MouseEvent) {
      if (ev.target != this.$refs.moreMenu)
        (this.$refs.moreMenu as HTMLElement).style.display = "none";
    },

    duplicateOpt() {
      if (this.optElem) {
        const nComp = this.optElem.duplicate();
        if (nComp) {
          this.components.push(nComp);
        }
      }
      this.$emit("change");
    },

    deleteOpt() {
      const index = this.components.indexOf(this.optElem!);
      if (index != -1) this.components.splice(index, 1);
      this.$emit("change");
    },

    visibilityOpt() {
      toggleVis(this.optElem!.id!);
      this.$emit("change");
    }
  }
});
</script>

<style lang="scss" scoped>
.dropzone {
  height: 5px;
  width: 100%;
  background-color: $light4;
  transition-duration: 100ms;

  &.invisible {
    height: 0px;
  }

  &.targeted {
    background-color: #00adb5;
    height: 30px;
  }
}

.dragging {
  opacity: 0.5;
}

.dragging .dropzone {
  display: none;
}

.item {
  padding: 5px 0px 5px 10px;
  cursor: pointer;
}

.itemName {
  font-size: 17px;
  align-items: center;
  color: $light2;

  .material-icons {
    margin-right: 5px;
    font-size: 18px;
  }

  .dragIndicator {
    color: transparent;
    margin-left: -10px;
    margin-right: 0;
  }

  &:hover .dragIndicator {
    color: $light4;
  }

  .moreMenuBtn {
    margin-left: auto;
    color: $light3;

    &:hover {
      color: $light2;
    }
  }
}

.active {
  background-color: rgba(0, 0, 0, 0.2);

  .itemName {
    color: $light;
  }
}

.invisible .itemName {
  color: $light4;
}

.subFolder {
  margin-left: 20px;
}
</style>
