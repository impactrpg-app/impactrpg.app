<script lang="ts" setup>
import DiceRollerComponent from '../components/DiceRollerComponent.vue';
import CustomMenuBar from '../components/CustomMenuBar.vue';
import CustomResourceComponent from '../components/CustomResourceComponent.vue';
import { MenuItem } from 'primevue/menuitem';
import { Button, InputText, Textarea, Checkbox, Dialog, useToast } from 'primevue';
import { computed, ref, onMounted } from 'vue';
import { getMonsterActionRollText, Monster, NewMonster } from '../data/monsters';
import { supabaseClient } from '../service/supabase';
import { useRoute } from 'vue-router';
import router from '../router';
import { handleLoading } from '../service/loading';

const route = useRoute();
const toast = useToast();
const monsters = ref<Monster[]>([]);
const encounterId = computed(() => {
  const encounterId = Number(route.params['encounterId']);
  if (!encounterId || isNaN(encounterId)) return null;
  return encounterId;
});
const encounterName = ref('');

const isDiceRollerOpen = ref(false);
const isEditActionRollDialogOpen = ref(false);
const isEditEncounterDialogOpen = ref(false);

const editActionRoll = ref({
  actionIndex: -1,
  monsterIndex: -1
});
const editActionRollBooleans = ref<boolean[]>(new Array(6).fill(false));

onMounted(() => {
  handleLoading(async () => {
    if (!encounterId.value) return;
    const encounter = await supabaseClient.from('encounter')
      .select('name,data').eq('id', encounterId.value).single();
    if (encounter.data) {
      monsters.value = encounter.data.data as Monster[];
      encounterName.value = encounter.data.name;
    }
  });
});

const menuItems: MenuItem[] = [
  {
    label: 'Roll dice',
    icon: 'casino',
    command: () => {
      isDiceRollerOpen.value = true;
    }
  },
  {
    label: "Save Encounter",
    icon: 'pi pi-save',
    command: async () => {
      saveEncounter();
    }
  },
  {
    label: 'Add New Monster',
    icon: 'pi pi-plus',
    command: () => {
      monsters.value.push({ ...NewMonster, actions: [], specials: [] });
    }
  },
  {
    label: 'Delete Encounter',
    icon: 'pi pi-trash',
    command: () => handleLoading(async () => {
      if (!encounterId.value) return;
      await supabaseClient.from('encounter').delete().eq('id', encounterId.value);
      router.push('/encounters');
    })
  },
  {
    label: 'Edit Encounter Name',
    icon: 'pi pi-pencil',
    command: () => {
      isEditEncounterDialogOpen.value = true;
    }
  }
];
function deleteMonster(index: number) {
  monsters.value = [
    ...monsters.value.filter((_,i) => i !== index)
  ];
}
function moveMonsterUp(index: number) {
  if (index === 0) return;
  const temp = monsters.value[index - 1];
  monsters.value[index - 1] = monsters.value[index];
  monsters.value[index] = temp;
}
function moveMonsterDown(index: number) {
  if (index + 1 === monsters.value.length) return;
  const temp = monsters.value[index + 1];
  monsters.value[index + 1] = monsters.value[index];
  monsters.value[index] = temp;
}
function addMonsterAction(index: number) {
  monsters.value[index].actions.push({
    name: 'Action Name',
    description: 'Description',
    rolls: [1,2,3]
  });
}
function removeMonsterAction(index: number, actionIndex: number) {
  monsters.value[index].actions = [
    ...monsters.value[index].actions.filter((_, i) => i !== actionIndex)
  ];
}
function addMonsterSpecial(index: number) {
  if (!monsters.value[index].specials) {
    monsters.value[index].specials = [];
  }
  monsters.value[index].specials.push({
    name: 'Special Name',
    description: 'Monster Special Description'
  })
}
function removeMonsterSpecial(index: number, specialIndex: number) {
  if (!monsters.value[index].specials) return;
  monsters.value[index].specials = [
    ...monsters.value[index].specials.filter((_, i) => i !== specialIndex)
  ];
}
function adjustActionNumbers(index: number, actionIndex: number) {
  editActionRoll.value = {
    monsterIndex: index,
    actionIndex,
  }
  for (let i = 0; i < editActionRollBooleans.value.length; i++) {
    editActionRollBooleans.value[i] = 
      monsters.value[index].actions[actionIndex].rolls.includes(i+1);
  }
  isEditActionRollDialogOpen.value = true;
}
function saveActionNumbers() {
  const rolls: number[] = [];
  for (let i = 0; i < editActionRollBooleans.value.length; i++) {
    if (editActionRollBooleans.value[i])
      rolls.push(i+1);
  }
  monsters.value[editActionRoll.value.monsterIndex]
    .actions[editActionRoll.value.actionIndex].rolls = [...rolls];
}
async function saveEncounter() {
  await handleLoading(async () => {
    if (!encounterId.value) return;
    await supabaseClient.from('encounter').update({
      data: [...monsters.value]
    }).eq('id', encounterId.value);
  });
  toast.add({
    severity: 'success',
    summary: 'Saved Encounter',
    life: 3000
  })
}
</script>

<template>
  <Dialog
    modal
    title="Edit Action Rolls"
    v-model:visible="isEditActionRollDialogOpen"
  >
    <div class="row align-items-center gap10" v-for="(_, index) in editActionRollBooleans">
      <Checkbox
        binary
        v-model="editActionRollBooleans[index]"
        @change="saveActionNumbers"
      />
      <p>{{ index + 1 }}</p>
    </div>
  </Dialog>
  <Dialog modal v-model:visible="isEditEncounterDialogOpen" title="Edit Encounter">
    <InputText v-model="encounterName" />
  </Dialog>
  <DiceRollerComponent v-model:is-open="isDiceRollerOpen" roll-author="DM" />
  <div class="encounter">
    <CustomMenuBar :items="menuItems" back-url="/encounters" :before-back-callback="saveEncounter" />
    <div class="monster" v-for="(monster, index) in monsters">
      <div class="row gap10 align-items-center">
        <h3>{{ index + 1 }}.</h3>
        <Button v-tooltip.bottom="'Delete Monster'" variant="text" icon="pi pi-trash" @click="deleteMonster(index)" />
        <Button v-tooltip.bottom="'Move up'"  variant="text" icon="pi pi-angle-up" @click="moveMonsterUp(index)" />
        <Button v-tooltip.bottom="'Move Down'" variant="text" icon="pi pi-angle-down" @click="moveMonsterDown(index)" />
      </div>
      <InputText class="grow" v-model="monster.name" placeholder="Monster Name" />
      <div class="stats">
        <span>Strength</span>
        <CustomResourceComponent v-model="monster.abilities.strength" />
      </div>
      <div class="stats">
        <span>Agility</span>
        <CustomResourceComponent v-model="monster.abilities.agility" />
      </div>
      <div class="stats">
        <span>Intelligence</span>
        <CustomResourceComponent v-model="monster.abilities.intelligence" />
      </div>
      <div class="stats">
        <span>Armor</span>
        <CustomResourceComponent v-model="monster.armor" />
      </div>
      <div class="stats">
        <span>Wounds</span>
        <CustomResourceComponent v-model="monster.wounds" />
      </div>
      <div class="stats">
        <span># of Actions</span>
        <CustomResourceComponent v-model="monster.actionsPerTurn" />
      </div>

      <div class="info">
        <div class="row align-items-center gap10">
          <h4>
            ACTIONS
            <span class="small-action-text">
              ({{ monster.actionsPerTurn }} 
              Action<template v-if="monster.actionsPerTurn > 1">s</template>)
            </span>
          </h4>
          <Button v-tooltip.bottom="'Add new Action'" variant="text" icon="pi pi-plus" @click="addMonsterAction(index)" />
        </div>
        <template v-for="(action, actionIndex) in monster.actions">
          <div class="column gap10 grow">
            <div class="row gap10 align-items-center">
              <Button
                variant="text"
                :label="getMonsterActionRollText(action.rolls)"
                @click="adjustActionNumbers(index, actionIndex)"
                size="small"
                style="min-width: 60px;"
              />
              <InputText class="grow" v-model="action.name" placeholder="Action Name" />
              <Button v-tooltip.bottom="`Delete '${action.name}' Action`" variant="text" icon="pi pi-trash" @click="removeMonsterAction(index, actionIndex)" />
            </div>
            <Textarea placeholder="Action Description" v-model="action.description" />
          </div>
        </template>
        <template v-if="monster.specials">
          <div class="row align-items-center gap10">
            <h4>SPECIALS</h4>
            <Button v-tooltip.bottom="'Add new Special'" variant="text" icon="pi pi-plus" @click="addMonsterSpecial(index)" />
          </div>
          <template v-for="(special, specialIndex) in monster.specials">
            <div class="column gap10">
              <div class="row gap10 align-items-center grow">
                <InputText class="grow" v-model="special.name" placeholder="Special Name" />
                <Button v-tooltip.bottom="`Delete '${special.name}' Special`" variant="text" icon="pi pi-trash" @click="removeMonsterSpecial(index, specialIndex)" />
              </div>
              <Textarea placeholder="Special Description" v-model="special.description" />
            </div>
          </template>
        </template>
      </div>
    </div>
  </div>
</template>

<style lang="css" scoped>
.encounter {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-around;
  align-items: start;
  max-width: 800px;
  flex-grow: 1;
  gap: 20px;

  .monster {
    display: flex;
    flex-direction: column;
    gap: 10px;
    flex-basis: calc(50% - 60px);
    margin-left: 20px;
    margin-right: 20px;

    .actions {
      display: flex;
      flex-direction: row;
      width: 100%;
      height: 20px;
    }

    .stats {
      display: flex;
      flex-direction: row;
      justify-content: space-between;

      span {
        width: 150px;
      }

    }
    .info {
      display: flex;
      flex-direction: column;
      gap: 10px;

      .action-rolls {
        cursor: pointer;
      }

      .small-action-text {
        font-size: 14px;
      }
    }
  }
}
</style>