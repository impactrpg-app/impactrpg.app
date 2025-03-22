<script setup lang="ts">
import { Button } from "primevue";
import { defineComponent } from "vue";

export type RulesContent = {
  title: string;
  section: {
    titleType?: string;
    title?: string;
    content?: ReturnType<typeof defineComponent>;
    props?: Record<string, unknown>;
    rows?: number;
  }[];
};

const props = defineProps<{
  showContents?: boolean;
  title?: string;
  data: RulesContent[];
  container?: HTMLDivElement | null;
}>();

function scrollToTop() {
  props.container?.scrollTo({ top: 0, behavior: "smooth" });
}
</script>

<template>
  <div class="rules">
    <Button
      v-if="props.container"
      class="back-button"
      icon="pi pi-chevron-up"
      @click="scrollToTop"
    />
    <h1 v-if="props.title">{{ title }}</h1>
    <div class="contents" v-if="props.showContents">
      <div class="section" v-for="section in props.data">
        <a :href="`#${section.title}`">
          <h6 class="heading">{{ section.title }}</h6>
        </a>
        <template v-for="block in section.section">
          <a v-if="block.title" :href="`#${block.title}`">
            <h6>{{ block.title }}</h6>
          </a>
        </template>
      </div>
    </div>
    <template v-for="section in props.data">
      <h1 v-if="title" :id="section.title">{{ section.title }}</h1>
      <div class="container">
        <div
          class="item"
          v-for="block in section.section"
          :style="{ gridRowEnd: `span ${block.rows ?? 1}` }"
        >
          <component
            v-if="block.title"
            :id="block.title"
            :is="block.titleType ?? 'h2'"
            style="text-transform: uppercase"
          >
            {{ block.title }}
          </component>
          <component v-if="block.content" :is="block.content" v-bind="block.props" />
        </div>
      </div>
    </template>
  </div>
</template>

<style lang="css">
ul {
  display: flex;
  flex-direction: column;
  gap: 10px;
  list-style: disc;
  padding-left: 0;
  margin: 0;
}

li {
  font-size: 24px;
  font-weight: normal;
}
</style>

<style lang="css" scoped>
.back-button {
  position: fixed;
  top: 20px;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  transition: 0.3s;
}

.rules {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
  margin-top: 50px;
  margin-bottom: 200px;

  h1 {
    align-items: center;
    justify-content: center;
    text-align: center;
  }

  .contents {
    display: flex;
    flex-direction: row;
    gap: 50px;
    width: 100%;
    margin-bottom: 50px;
    align-items: flex-start;
    justify-content: center;

    h6 {
      text-align: center;
    }

    @media (max-width: 820px) {
      align-items: center;
      flex-direction: column;
    }

    .section {
      display: flex;
      flex-direction: column;
      align-items: center;
      flex-basis: 25%;
      gap: 20px;

      @media (max-width: 820px) {
        min-width: 175px;
      }

      .heading {
        color: var(--p-emerald-200);
        min-width: 175px;
      }

      h6 {
        color: var(--p-lime-200);
      }
    }
  }

  .container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: start;
    width: 820px;
    gap: 40px;

    @media (max-width: 820px) {
      width: 400px;
      grid-template-columns: 1fr;
    }

    .item {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
  }
}
</style>
