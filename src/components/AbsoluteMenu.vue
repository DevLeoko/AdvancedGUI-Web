<template>
  <div class="absoluteMenu" ref="menu">
    <div v-for="(entry, index) in entries" :key="index">
      <div class="divider" v-if="index != 0"></div>
      <div class="entry" @click.stop="entry.action">
        <span class="material-icons">{{ entry.icon }}</span>
        {{ entry.name }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    entries: {
      type: Array as () => {
        name: string;
        icon: string;
        action: VoidFunction;
      }[],
      required: true
    }
  },

  mounted() {
    document.addEventListener("click", this.checkClose, { capture: true });
  },

  unmounted() {
    document.removeEventListener("click", this.checkClose, { capture: true });
  },

  data() {
    return {};
  },

  methods: {
    checkClose(ev: MouseEvent) {
      const menuComp = this.$refs.menu as HTMLElement;
      if (ev.target != menuComp) menuComp.style.display = "none";
    },

    open(x: number, y: number) {
      const menu = this.$refs.menu as HTMLElement;
      menu.style.display = "block";
      menu.style.opacity = "0";

      setTimeout(() => {
        if (y + menu.offsetHeight > window.innerHeight)
          y = y - menu.offsetHeight - 5;

        menu.style.opacity = "1";
        menu.style.top = y + "px";
        menu.style.left = x + "px";
      }, 3);
    }
  }
});
</script>

<style lang="scss" scoped></style>
