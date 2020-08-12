<template>
  <div>
    <div>
      <div
        v-for="(elem, index) in components"
        :key="elem.id"
        @click.stop="$emit('input', elem)"
        :class="value == elem ? 'active ' : ''"
        class="item"
        draggable="true"
        ondragstart="event.dataTransfer.setData('text/plain',null)"
        @dragstart.self="ev => ev.target.classList.add('dragging')"
        @dragend.self="ev => ev.target.classList.remove('dragging')"
        @dragover.prevent
        :component="elem"
      >
        <drag-zone
          v-if="index == 0"
          :dragIndication="dragIndication"
        ></drag-zone>
        <div class="itemName row">
          <span class="material-icons"> {{ elem.icon }} </span>{{ elem.id }}
        </div>
        <div class="subFolder" v-if="elem.isGroup()">
          <component-list
            :components="elem.getItems()"
            :value="value"
            @input="val => $emit('input', val)"
            @removeitem="item => $emit('removeitem', item)"
          ></component-list>
        </div>
        <drag-zone :dragIndication="dragIndication"></drag-zone>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import DragZone from "./DragZone.vue";
import Vue from "vue";
import { ListItem } from "@/utils/ListItem";

export default Vue.extend({
  name: "ComponentList",

  components: { DragZone },

  data() {
    return {
      dragIndication: false
    };
  },

  mounted() {
    document.addEventListener("dragstart", () => (this.dragIndication = true));
    document.addEventListener("dragend", () => (this.dragIndication = false));
  },

  props: {
    components: {
      type: Array as () => ListItem[]
    },
    value: {
      type: Object as () => ListItem
    }
  }
});
</script>

<style lang="scss" scoped>
.active {
  background-color: rgba(0, 0, 0, 0.2);
}

.dropzone {
  height: 5px;
  width: 100%;
  background-color: $darkPrimary;
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
  padding: 5px 10px;
  cursor: pointer;
}

.itemName {
  align-items: center;

  .material-icons {
    margin-right: 5px;
  }
}

.subFolder {
  margin-left: 20px;
}
</style>
