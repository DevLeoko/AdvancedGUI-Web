<template>
  <div>
    <div class="moreMenu absoluteMenu" ref="moreMenu">
      <template v-if="optElem">
        <div class="entry" @click.stop="deleteOpt()">
          <span class="material-icons">delete</span> Delete
        </div>
        <div class="divider"></div>
        <div class="entry" @click.stop="copyOpt()">
          <span class="material-icons">content_copy</span>
          Copy
        </div>
        <div class="divider"></div>
        <template v-if="hasCapacity">
          <div class="entry" @click.stop="duplicateOpt()">
            <span class="material-icons">add_to_photos</span>
            Duplicate
          </div>
          <div class="divider"></div>
        </template>
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
        v-if="activeIndex != 0 && hasCapacity"
        :dragIndication="!!treeState.dragElement"
        @drop="dragDrop(0)"
      ></drag-zone>
      <div v-for="(elem, index) in components" :key="index">
        <div
          class="item"
          :class="
            (value == elem ? 'active ' : '') +
              (elem.id && invisible.indexOf(elem.id) != -1
                ? 'invisible '
                : '') +
              (itemClasses[index] || '')
          "
          @click.stop="$emit('input', value == elem ? null : elem)"
          draggable="true"
          ondragstart="event.dataTransfer.setData('text/plain',null)"
          @dragstart.self="ev => dragStart(ev.target, elem, index)"
          @dragend.self="ev => dragEnd(ev.target)"
          @dragover.prevent
        >
          <div class="itemName row">
            <span
              v-if="elem.isGroup()"
              class="material-icons expandBtn"
              @click.stop="elem.expaned = !elem.expaned"
              >{{
                elem.expaned ? "keyboard_arrow_down" : "keyboard_arrow_right"
              }}</span
            >
            <span class="material-icons"> {{ elem.icon }} </span>{{ elem.name }}

            <span class="material-icons dragIndicator">drag_indicator</span>
            <span
              class="material-icons moreMenuBtn"
              @click.stop="ev => openMenu(elem, ev)"
              >more_vert</span
            >
          </div>
          <div class="subFolder" v-if="elem.isGroup() && elem.expaned">
            <component-list
              :components="elem.getItems()"
              :value="value"
              :treeState="treeState"
              :itemLimit="elem.itemLimit"
              :itemClasses="elem.itemClasses"
              @input="val => $emit('input', val)"
              @copy="val => $emit('copy', val)"
            ></component-list>
          </div>
        </div>
        <drag-zone
          :dragIndication="!!treeState.dragElement"
          @drop="dragDrop(index + 1)"
          v-if="activeIndex != index && activeIndex != index + 1 && hasCapacity"
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
    itemLimit: {
      type: Number
    },
    itemClasses: {
      type: Array as () => string[],
      default: () => []
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

  computed: {
    hasCapacity() {
      if (this.itemLimit === undefined) return true;

      let current = this.components.length;
      if (this.activeIndex != -2) current--;

      return current < this.itemLimit;
    }
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
    },

    openMenu(elem: ListItem, ev: MouseEvent) {
      const moreMenu = this.$refs.moreMenu as HTMLElement;
      moreMenu.style.display = "block";

      setTimeout(() => {
        let x = ev.x;
        let y = ev.y;
        if (x + moreMenu.offsetWidth > window.innerWidth)
          x = window.innerWidth - moreMenu.offsetWidth - 5;

        if (y + moreMenu.offsetHeight > window.innerHeight)
          y = ev.y - moreMenu.offsetHeight - 5;

        moreMenu.style.top = y + "px";
        moreMenu.style.left = x + "px";
      }, 10);

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
          this.components.splice(0, 0, nComp);
        }
      }
    },

    deleteOpt() {
      const index = this.components.indexOf(this.optElem!);
      if (index != -1) {
        this.components.splice(index, 1);
        this.optElem?.delete();
      }
    },

    visibilityOpt() {
      toggleVis(this.optElem!.id!);
    },

    copyOpt() {
      this.$emit("copy", this.optElem?.toJson());
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

  &.posAction {
    border-left: 2px solid $green;
  }

  &.negAction {
    border-left: 2px solid $red;
  }

  &.not-hovered {
    border-left: 2px solid transparentize($color: $blue, $amount: 0.5);
    // margin-left: -3px;
  }

  &.primary {
    border-left: 2px solid transparentize($color: $blue, $amount: 0.5);
    // margin-left: -3px;
  }

  &.hovered {
    border-left: 2px solid transparentize($color: $blue, $amount: 0.8);
    // margin-left: -3px;
  }
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
    // margin-left: -10px;
    margin-left: auto;
    margin-right: 0;
  }

  &:hover .dragIndicator {
    color: $light4;
  }

  .expandBtn {
    margin-left: -6px;
    margin-right: 1px;
  }

  .moreMenuBtn,
  .expandBtn {
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
