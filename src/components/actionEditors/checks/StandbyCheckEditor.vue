<template>
  <div>
    <p>
      This check has no options. <br />
      Used to check whether the player is outside of the interaction-radius of
      the GUI.
    </p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { StandbyCheck } from "@/utils/checks/StandbyCheck";

export default defineComponent({
  data() {
    return {};
  },
  props: {
    action: {
      type: Object as () => StandbyCheck,
      required: true
    }
  }
});
</script>
