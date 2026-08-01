<template>
  <div class="head">
    <div class="exitBtn" @click="exitToExplorer()">
      <span class="material-icons">exit_to_app</span>
    </div>
    <b class="label moreBtn">
      <i class="material-icons" style="padding-bottom: 2px; font-size: 18px"
        >expand_more</i
      >
      Project

      <div class="moreMenu">
        <div class="entry" @click="showShortcuts = true">Shortcuts</div>
        <div class="entry" @click="showPlaceholders = true">Placeholders</div>
        <div class="entry" @click="showDevMode = true">Dev-Mode</div>
        <div class="entry" @click="showAbout = true">About</div>
      </div>
    </b>
    <div class="center">
      <input
        class="inputProjectName"
        type="text"
        v-model="settings.projectName"
      />
      <div class="size">
        <input type="number" v-model="settings.width" />
        <span class="label">x</span>
        <input type="number" v-model="settings.height" />
        <span class="label">frames</span>
      </div>
    </div>

    <div
      v-if="syncStatus == SyncStatus.DISCONNECTED"
      class="btn sync"
      @click="openSyncPrompt()"
    >
      <span class="material-icons">cloud_upload</span>
      <span class="text">Live sync</span>
    </div>
    <div
      v-else
      class="syncStatus"
      :class="syncStatus != SyncStatus.CONNECTED ? 'pending' : ''"
    >
      <div class="row">
        <div class="dot"></div>
        {{ syncStatus == SyncStatus.CONNECTED ? "Connected" : "Syncing..." }}
      </div>
      <div class="detail">
        <a @click="syncStatus = SyncStatus.DISCONNECTED">Disconnect</a>
        <span v-if="syncType == SyncType.MANUAL"
          >| Use '/ag pull' to apply changes</span
        >
      </div>
    </div>
    <div
      class="btn save"
      :class="
        !unsavedChange || syncStatus == SyncStatus.SYNCING ? 'inactive' : ''
      "
      @click="saveCurrentProject"
    >
      <span class="material-icons">save</span>
      <span class="text"
        >Save{{ syncStatus != SyncStatus.DISCONNECTED ? " & sync" : "" }}</span
      >
    </div>
    <div class="btn export" @click="exportCurrentProject()">
      <span class="material-icons">get_app</span>
      <span class="text">Download</span>
    </div>
    <modal
      title="About this page"
      icon="help_outline"
      v-model="showAbout"
      closeBtn
    >
      <p>
        This is the AdvancedGUI web editor developed by
        <a href="https://leoko.dev/" target="_blank" rel="noopener noreferrer"
          >Leo Garbe</a
        >. <br />
        AdvancedGUI is a game extension for the sandbox video game Minecraft. It
        is available for purchase on
        <a
          href="https://www.spigotmc.org/resources/advancedgui-interactive-itemframe-guis.83636/"
          target="_blank"
          rel="noopener noreferrer"
          >SpigotMC</a
        >. <br />
        The code of this edtor is open-source on
        <a
          href="https://github.com/DevLeoko/AdvancedGUI-Web"
          target="_blank"
          rel="noopener noreferrer"
          >GitHub</a
        >. <br />
        For support join our
        <a
          href="https://discord.gg/ycDG6rS"
          target="_blank"
          rel="noopener noreferrer"
          >Discord</a
        >.
        <br />
        <br />
        Current format-version: {{ formatVersion }}
      </p>
    </modal>
    <modal title="Shortcuts" icon="keyboard" v-model="showShortcuts" closeBtn>
      <p class="shortcuts">
        <span>CTRL</span> <span>C</span> &ensp; Copy component <br />
        <span>CTRL</span> <span>V</span> &ensp; Paste component <br />
        <span>CTRL</span> <span>X</span> &ensp; Copy & delete component <br />
        <span>DELETE</span> &ensp; Delete component <br />
        <span>CTRL</span> <span>Z</span> &ensp; Undo <br />
        <span>CTRL</span> <span>Y</span> &ensp; Redo <br />
        <span>CTRL</span> <span>SCROLL</span> &ensp; Zoom in/out <br />
        <span>ARROW KEY</span> &ensp; Move component by 1 pixel <br />
        <span>SHIFT</span> <span>ARROW KEY</span> &ensp; Move component by 10
        pixel <br />
        <span>CTRL</span> <span>S</span> &ensp; Download savepoint <br />
        Press <span>SHIFT</span> while moving an element to snap to x- or y-axis
      </p>
    </modal>
    <modal title="Placeholders" icon="tag" v-model="showPlaceholders" closeBtn>
      <div class="placeholderContent">
        <p>
          Placeholders can be used in any text field: component texts,
          commands, messages, image URLs and checks.
        </p>
        <p>
          <b>Instance placeholders</b> resolve against the placed GUI, which
          makes layouts <i>portable</i>: place the GUI somewhere else and
          commands that interact with the world keep working without being
          edited. On wall GUIs the anchor is the top-left item frame; handheld
          GUIs resolve against the player holding the map.
        </p>
        <p class="placeholders">
          <span>%instance.x%</span> <span>%instance.y%</span>
          <span>%instance.z%</span> &ensp; Anchor block coordinates <br />
          <span>%instance.pos%</span> &ensp; Anchor as "x y z" — drop-in for
          command coordinates <br />
          <span>%instance.world%</span> &ensp; World name <br />
          <span>%instance.direction%</span> &ensp; Facing of the GUI (handheld:
          of the player) <br />
          <span>%instance.center%</span> &ensp; Center of the GUI plane (may
          contain decimals) <br />
          <span>%instance.id%</span> &ensp; Instance id (handheld: map id)
          <br />
          <span>%instance.layout%</span> &ensp; Layout name <br />
          <span>%instance.offset.&lt;dx&gt;.&lt;dy&gt;.&lt;dz&gt;%</span> &ensp;
          Anchor shifted along the world axes, as "x y z" <br />
          <span>%instance.rel.&lt;right&gt;.&lt;up&gt;.&lt;front&gt;%</span>
          &ensp; Anchor shifted relative to the GUI's orientation —
          <i>front</i> points out of the screen towards the viewer <br />
        </p>
        <p>
          Example:
          <span class="placeholders-chip">
            /setblock %instance.rel.0.0.-1% air</span
          >
          always targets the block the top-left frame hangs on, no matter where
          the GUI is placed or which way it faces.
        </p>
        <p>
          Also available:
          <span class="placeholders-chip">%meta.&lt;key&gt;%</span>
          (values stored by metadata actions), and every
          <a
            href="https://wiki.placeholderapi.com/users/placeholder-list/"
            target="_blank"
            rel="noopener noreferrer"
            >PlaceholderAPI</a
          >
          placeholder when installed on the server.
        </p>
      </div>
    </modal>
    <modal title="Dev-Mode" icon="code" v-model="showDevMode" closeBtn>
      <p>
        The AdvancedGUI web editor is designed to have a very intuitive user
        interface. But some users might require some more advanced features that
        would only confuse or dirsturb the average user. This is why we added
        <b>dev-mode</b>. <br />
        You can toggle the dev-mode by clicking on the
        <span
          class="material-icons"
          style="font-size:16px; vertical-align: middle;"
          >tune</span
        >-icon next to <i>"General setting"</i> in the left options tab.
        <br /><br />
        The dev-mode allows you to:
      </p>
      <ul>
        <li>Move component partially outside of the GUI view</li>
        <li>Change the ID of components</li>
        <li>Preview how the GUI will be divided into item-frames</li>
        <li>
          Preview the GUI in the exact colors Minecraft will render
        </li>
        <li>
          Set the direct RGBA color value of components (useful for using
          template variables for colors)
        </li>
      </ul>
    </modal>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import Modal from "@/components/Modal.vue";
import { VERSION } from "../utils/manager/UpdateManager";
import { settings } from "../utils/manager/SettingsManager";
import {
  undo,
  redo,
  history,
  unsavedChange
} from "../utils/manager/HistoryManager";
import {
  exportCurrentProject,
  projectExplorerOpen,
  saveCurrentProject
} from "../utils/manager/ProjectManager";
import { vueRef } from "../utils/VueRef";
import {
  openSyncPrompt,
  SyncStatus,
  syncStatus,
  syncType,
  SyncType
} from "../utils/manager/SyncManager";
import { info } from "../utils/manager/WorkspaceManager";

export default defineComponent({
  components: { Modal },

  data() {
    return {
      settings,
      undo,
      redo,
      history,
      importComponent: false,
      showAbout: false,
      showShortcuts: false,
      showPlaceholders: false,
      showDevMode: false,
      formatVersion: VERSION,
      projectExplorerOpen: vueRef(projectExplorerOpen),
      unsavedChange: vueRef(unsavedChange),
      syncStatus: vueRef(syncStatus),
      SyncStatus,
      syncType: vueRef(syncType),
      SyncType,

      openSyncPrompt,

      saveCurrentProject,
      exportCurrentProject
    };
  },

  methods: {
    exitToExplorer() {
      if (this.unsavedChange) {
        info("Unsaved changes! Save all your changes before you exit.", false, {
          label: "Discard changes and exit",
          callback: () => {
            this.projectExplorerOpen = true;
          }
        });
      } else {
        this.projectExplorerOpen = true;
      }
    }
  }
});
</script>

<style lang="scss" scoped>
.shortcuts {
  line-height: 2;

  span {
    font-size: 14px;
    background-color: $light4;
    padding: 2px 4px 0px;
    border-bottom: $light3 3px solid;
  }
}

.placeholderContent {
  max-height: 60vh;
  overflow-y: auto;
  padding-right: 10px;

  p:first-child {
    margin-top: 0;
  }

  p:last-child {
    margin-bottom: 0;
  }
}

.placeholders {
  line-height: 2.2;

  span {
    font-size: 13px;
    font-family: monospace;
    background-color: $light4;
    padding: 2px 4px 0px;
    border-bottom: $light3 3px solid;
    white-space: nowrap;
  }
}

.placeholders-chip {
  font-size: 13px;
  font-family: monospace;
  background-color: $light4;
  padding: 2px 4px 0px;
  border-bottom: $light3 3px solid;
  white-space: nowrap;
}

.moreBtn {
  display: flex;
  align-items: center;
  position: relative;

  .moreMenu {
    top: 100%;
    position: absolute;
    display: none;
    flex-direction: column;
    background-color: $light4;
    box-shadow: $shadowStrong;
    padding-bottom: 1px;

    .entry {
      margin: 1px;
      margin-bottom: 0;
      padding: 4px 10px;
      font-size: 13px;
      background-color: $dark3;
      color: $light3;
      cursor: pointer;

      &:hover {
        background-color: $dark2;
        color: $light2;
      }
    }
  }

  &:hover .moreMenu {
    display: flex;
  }
}
</style>
