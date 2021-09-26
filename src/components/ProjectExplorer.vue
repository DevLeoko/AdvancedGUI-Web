<template>
  <div id="projectExplorer">
    <h1>AdvancedGUI</h1>
    <h2>
      Your projects
      <span class="importBtn" @click="triggerFileSelector()"
        ><span class="material-icons">upload</span>import project</span
      >
    </h2>
    <div class="projectList">
      <div class="card createNew" @click="openNewProject">
        <span class="material-icons">add</span>
        <span>Create new project</span>
      </div>
      <div
        v-for="project in projects"
        :key="project.name"
        class="card projectCard"
        @click="openProject(project)"
        :ref="`proj#${project.name}`"
      >
        <div class="openNote">OPEN</div>
        <div class="bar">
          <div class="name">
            <h3>{{ project.name }}</h3>
            <span>{{
              ((JSON.stringify(project).length * 2) / 1000 / 1000).toFixed(2) +
                " MB"
            }}</span>
          </div>
          <div
            class="more"
            @click.stop="
              $refs[`projMenu#${project.name}`].open($event.x, $event.y)
            "
          >
            <span class="material-icons">expand_more</span>
            <span v-if="project.version != VERSION" class="material-icons info"
              >update</span
            >
          </div>
        </div>

        <absolute-menu
          :entries="getActions(project)"
          :ref="`projMenu#${project.name}`"
        ></absolute-menu>
      </div>
    </div>

    <div class="absInfoBar">
      <!-- <div class="storage">
        <div>
          <span>{{ summedSize.toFixed(2) }} MB / 5.00 MB</span>
          <span
            class="material-icons"
            @click="
              info(
                'This is an approximation of your browser\'s restriction on how much a website is allowed to store.'
              )
            "
            >info</span
          >
        </div>
        <div
          class="remaining"
          :style="{ width: `${Math.max(100 - (100 / 5) * summedSize, 0)}%` }"
        ></div>
      </div> -->

      <span
        class="material-icons openLicensePrompt"
        @click="licensePromptDoneAction = () => {}"
        >vpn_key</span
      >
    </div>

    <input
      type="file"
      ref="fileDownload"
      accept=".json"
      style="display: none"
      @change="checkForUpload()"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import {
  deleteProject,
  exportProject,
  getThumbnail,
  importProject,
  licensePromptDoneAction,
  openNewProject,
  openProject,
  projects
} from "../utils/manager/ProjectManager";
import { VERSION } from "../utils/manager/UpdateManager";
import { info, loading } from "../utils/manager/WorkspaceManager";
import { Project } from "../utils/Project";
import { vueRef } from "../utils/VueRef";
import AbsoluteMenu from "./AbsoluteMenu.vue";

export default defineComponent({
  data() {
    return {
      projects: vueRef(projects),
      licensePromptDoneAction: vueRef(licensePromptDoneAction),
      openNewProject,
      openProject,
      VERSION,
      info
    };
  },

  components: { AbsoluteMenu },

  computed: {
    summedSize(): number {
      return this.projects
        .map(p => (JSON.stringify(p).length * 2) / 1000 / 1000)
        .reduce((i, j) => i + j, 0);
    }
  },

  watch: {
    projects: {
      handler() {
        setTimeout(() => {
          this.projects.forEach(async project => {
            const elem = this.$refs[`proj#${project.name}`] as HTMLElement;
            if (elem)
              elem.style.backgroundImage = `url(${await getThumbnail(
                project.name
              )})`;
          });
        }, 30);
      },
      immediate: true,
      deep: true
    }
  },

  methods: {
    triggerFileSelector() {
      (this.$refs.fileDownload as HTMLElement).click();
    },

    async checkForUpload() {
      const selector = this.$refs.fileDownload as HTMLInputElement;

      if (selector.files?.length) {
        const file = selector.files[0];
        loading(true);

        const project = JSON.parse(await file.text()) as Project;
        await importProject(project);

        loading(false);
      }
    },

    getActions(project: Project) {
      const actions = [
        {
          icon: "download",
          name: "Download",
          action: () => exportProject(project.name)
        },
        {
          icon: "delete",
          name: "Delete",
          action: () => deleteProject(project.name)
        }
      ];

      if (project.version != VERSION) {
        actions.splice(0, 0, {
          icon: "update",
          name: "Open to update",
          action: () => {
            openProject(project);
          }
        });
      }

      return actions;
    }
  }
});
</script>

<style lang="scss">
#projectExplorer {
  height: 100%;
  width: 100%;
  color: $light;
  padding: 0 7.5vw;
  box-sizing: border-box;

  h1 {
    font-weight: 500;
    font-size: 2.5rem;
    margin: 12vh 0;
    text-align: center;
  }

  .importBtn {
    color: $blue;
    opacity: 0.7;
    font-size: 1rem;
    display: flex;
    align-items: center;
    margin-left: 1.5rem;
    cursor: pointer;

    .material-icons {
      font-size: 1rem;
      margin-right: 0.2rem;
    }

    &:hover {
      opacity: 1;
    }
  }

  h2 {
    font-weight: 500;
    font-size: 1.3em;
    display: flex;
  }

  .projectList {
    display: flex;
    margin-left: -2rem;
    justify-items: stretch;
    flex-wrap: wrap;

    .card {
      background-size: cover;
      background-position: center;
      margin-left: 2rem;
      margin-bottom: 2rem;
      cursor: pointer;
      height: 10rem;
      width: 15rem;
      box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.6);
      transition-duration: 70ms;

      &:hover {
        box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.6);
      }
    }

    .createNew {
      color: $green;
      border: solid 1px $green;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      box-sizing: border-box;

      .material-icons {
        font-size: 2.2rem;
      }

      &:hover {
        background-color: $dark1;
      }
    }

    .projectCard {
      display: flex;
      flex-direction: column;

      .bar {
        display: flex;
        align-items: center;
        width: 100%;
        background-color: rgba(0, 0, 0, 0.4);
        backdrop-filter: blur(2px);

        .name {
          padding: 2px 10px;

          h3 {
            margin: 0;
            margin-bottom: -3px;
            font-weight: 500;
            font-size: 0.9rem;
          }

          span {
            font-size: 0.8rem;
            color: $light4;
          }
        }

        .more {
          position: relative;
          box-sizing: border-box;
          margin-left: auto;
          border-left: 1px solid $light3;
          padding: 8px;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;

          &:hover {
            background-color: transparentize($color: $dark1, $amount: 0.7);
          }

          .info {
            opacity: 0.7;
            position: absolute;
            font-weight: 200;
            font-size: 1.2rem;
            background-color: $blue;
            padding: 2px;
            border-radius: 10px;
            // top: -15px;
            left: -35px;
          }
        }
      }

      .openNote {
        color: $light;
        margin: auto auto;
        padding-top: 1rem;
        font-weight: 700;
        opacity: 0;
        transition-duration: 120ms;
        transition-delay: 50ms;
      }

      &:hover {
        background-color: $dark1;

        .openNote {
          opacity: 1;
        }
      }
    }
  }

  .absInfoBar {
    position: absolute;
    top: 0;
    right: 0;
    display: flex;

    .storage {
      width: 10rem;
      color: $light2;
      padding: 1rem;

      font-size: 0.8rem;
      position: relative;
      display: flex;
      flex-direction: column;

      align-items: center;
      justify-content: center;

      border-bottom: 3px solid $light3;

      .material-icons {
        cursor: pointer;
        margin-left: 5px;
        font-size: 0.8rem;
      }

      .remaining {
        position: absolute;
        right: 0;
        bottom: -3px;
        height: 3px;
        background-color: $blue;
      }
    }

    .openLicensePrompt {
      height: 4rem;
      width: 4rem;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: $dark1;
      cursor: pointer;
    }
  }
}
</style>
