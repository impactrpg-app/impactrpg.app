<script lang="ts" setup>
import { computed, ref } from 'vue';
import { CharacterDto, ImageUploadResponse } from '@impact/shared';
import { loadFromFile } from '../../service/io';
import { Age, ages } from '../../data/age';
import { personalities } from "../../data/personality";
import { injuryEffects } from "../../data/injury";
import AutoCompleteDropdown from '../AutoCompleteDropdownComponent.vue'
import {
  FloatLabel,
  InputText,
} from "primevue";
import { API_URL, makeRequest } from '@/service/api';

const props = defineProps<{
  modelValue: CharacterDto
}>();
const emits = defineEmits<{
  (e: 'update:modelValue', data: CharacterDto): void;
}>();

const value = computed({
  get() {
    return props.modelValue;
  },
  set(val: CharacterDto) {
    emits('update:modelValue', val);
  }
});

const ageOptions = ref<Age[]>(ages);

async function updateCharacterImage() {
  const fileContents = await loadFromFile();
  if (fileContents === null) return;
  const formData = new FormData();
  formData.append("image", new Blob([fileContents]));
  const data: ImageUploadResponse = await makeRequest("/image", {
    method: "POST",
    body: formData,
  }, true);
  value.value.info.image = `${API_URL}/image/${encodeURIComponent(data.path)}`;
}
</script>

<template>
  <div class="row gap20">
    <div class="column">
      <div :style="{
        width: '215px',
        height: '215px',
        borderRadius: '10px',
        background: `url('${value.info.image ?? ''}')`,
        backgroundColor: 'var(--p-stone-700)',
        backgroundSize: 'auto 100%',
        boxShadow: '0 0 5px 1px var(--p-stone-950)',
        cursor: 'pointer',
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        textAlign: 'center',
      }" @click="updateCharacterImage">
        <i class="pi pi-image" v-if="value.info.image === ''"></i>
      </div>
    </div>
    <div class="column" style="flex-basis: calc(50% + 90px); gap: 10px">
      <FloatLabel class="field">
        <InputText id="character-name" v-model="value.info.name"  />
        <label for="character-name">Character Name</label>
      </FloatLabel>
      <div class="row" style="gap: 20px;">
        <FloatLabel class="field" style="width: 150px">
          <AutoCompleteDropdown
            id="character-age"
            v-model="value.info.age"
            :suggestions="ageOptions"
            option-label="name"
          />
          <label for="character-age">Age</label>
        </FloatLabel>
        <FloatLabel class="field">
          <AutoCompleteDropdown
            id="character-personality"
            v-model="value.info.personality"
            :suggestions="personalities"
            option-label="name"
          />
          <label for="character-personality">Personality</label>
        </FloatLabel>
      </div>
      <FloatLabel class="field">
        <AutoCompleteDropdown
          id="character-injury"
          v-model="value.resources.injury"
          :suggestions="injuryEffects"
          option-label="name"
        />
        <label for="character-injury">Injury</label>
      </FloatLabel>
    </div>
  </div>
</template>