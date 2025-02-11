<script lang="ts" setup>
import { ref } from "vue";
import { skills } from "../data/skills";
import { Dialog } from "primevue";
import { travelEvents } from "../data/travel";
import RulesComponent, { RulesContent } from "../components/RulesComponent.vue";
import AbilityComponent from "../components/rules/creating-character/AbilityComponent.vue";
import AgeComponent from "../components/rules/creating-character/AgeComponent.vue";
import ApperanceComponent from "../components/rules/creating-character/ApperanceComponent.vue";
import CorruptionComponent from "../components/rules/creating-character/CorruptionComponent.vue";
import EnduranceComponent from "../components/rules/creating-character/EnduranceComponent.vue";
import PersonalityComponent from "../components/rules/creating-character/PersonalityComponent.vue";
import ProgressionComponent from "../components/rules/creating-character/ProgressionComponent.vue";
import SkillsComponent from "../components/rules/creating-character/SkillsComponent.vue";
import GearComponent from "../components/rules/creating-character/GearComponent.vue";
import SkillsExampleComponent from "../components/rules/creating-character/SkillsExampleComponent.vue";
import GoodsComponent from "../components/rules/creating-character/GoodsComponent.vue";
import RolePlayingComponent from "../components/rules/playing-the-game/RolePlayingComponent.vue";
import AbilityCheckComponent from "../components/rules/playing-the-game/AbilityCheckComponent.vue";
import TargetComponent from "../components/rules/playing-the-game/TargetComponent.vue";
import EffortComponent from "../components/rules/playing-the-game/EffortComponent.vue";
import BonusComponent from "../components/rules/playing-the-game/BonusComponent.vue";
import HelpingComponent from "../components/rules/playing-the-game/HelpingComponent.vue";
import WoundsComponent from "../components/rules/playing-the-game/WoundsComponent.vue";
import HealingComponent from "../components/rules/playing-the-game/HealingComponent.vue";
import DeathComponent from "../components/rules/playing-the-game/DeathComponent.vue";
import InjuryComponent from "../components/rules/playing-the-game/InjuryComponent.vue";
import ResurrectionComponent from "../components/rules/playing-the-game/ResurrectionComponent.vue";
import TravelingComponent from "../components/rules/playing-the-game/TravelingComponent.vue";
import RestingComponent from "../components/rules/playing-the-game/RestingComponent.vue";
import RestingEventsComponent from "../components/rules/playing-the-game/RestingEventsComponent.vue";
import CraftingComponent from "../components/rules/playing-the-game/CraftingComponent.vue";
import CraftingMaterialsComponent from "../components/rules/playing-the-game/CraftingMaterialsComponent.vue";
import FightingMonstersComponent from "../components/rules/fighting-monsters/FightingMonstersComponent.vue";
import ActionsComponent from "../components/rules/fighting-monsters/ActionsComponent.vue";
import AttackingComponent from "../components/rules/fighting-monsters/AttackingComponent.vue";
import DefendingComponent from "../components/rules/fighting-monsters/DefendingComponent.vue";
import MovementComponent from "../components/rules/fighting-monsters/MovementComponent.vue";
import ManeuversComponent from "../components/rules/fighting-monsters/ManeuversComponent.vue";
import UnarmedCombat from "../components/rules/fighting-monsters/UnarmedCombat.vue";
import AdvantageComponent from "../components/rules/fighting-monsters/AdvantageComponent.vue";
import ThrowingComponent from "../components/rules/fighting-monsters/ThrowingComponent.vue";
import ReflexComponent from "../components/rules/fighting-monsters/ReflexComponent.vue";
import DifficultTerrainComponent from "../components/rules/fighting-monsters/DifficultTerrainComponent.vue";
import FleeingComponent from "../components/rules/fighting-monsters/FleeingComponent.vue";
import AmbushComponent from "../components/rules/fighting-monsters/AmbushComponent.vue";
import AilmentComponent from "../components/rules/fighting-monsters/AilmentComponent.vue";
import CastingSpellComponent from "../components/rules/casting-spells/CastingSpellComponent.vue";
import ManaComponent from "../components/rules/casting-spells/ManaComponent.vue";
import SpellResolution from "../components/rules/casting-spells/SpellResolution.vue";
import SpellRulesComponent from "../components/rules/casting-spells/SpellRulesComponent.vue";
import ManaSurgeComponent from "../components/rules/casting-spells/ManaSurgeComponent.vue";
import SpellcastingComponent from "../components/rules/casting-spells/SpellcastingComponent.vue";
import MultiTargetingComponent from "../components/rules/casting-spells/MultiTargetingComponent.vue";
import AttackSpellComponent from "../components/rules/casting-spells/spell-resolution/AttackSpellComponent.vue";
import DefenseSpellComponent from "../components/rules/casting-spells/spell-resolution/DefenseSpellComponent.vue";
import UtilitySpellComponent from "../components/rules/casting-spells/spell-resolution/UtilitySpellComponent.vue";
import BlessingSpellComponent from "../components/rules/casting-spells/spell-resolution/BlessingSpellComponent.vue";
import CurseSpellComponent from "../components/rules/casting-spells/spell-resolution/CurseSpellComponent.vue";
import ModifiersComponent from "../components/rules/fighting-monsters/ModifiersComponent.vue";
import InsanityComponent from "../components/rules/playing-the-game/InsanityComponent.vue";
import HealingSpellComponent from "../components/rules/casting-spells/spell-resolution/HealingSpellComponent.vue";
import SummoningSpellComponent from "../components/rules/casting-spells/spell-resolution/SummoningSpellComponent.vue";
import IllusionSpellComponent from "../components/rules/casting-spells/spell-resolution/IllusionSpellComponent.vue";

const isSkillsDialogOpen = ref<boolean>(false);
const isTravelingEventsDialogOpen = ref<boolean>(false);
function openSkillsDialog() {
  isSkillsDialogOpen.value = true;
}
function openTravelingEventsDialog() {
  isTravelingEventsDialogOpen.value = true;
}

const data: RulesContent[] = [
  {
    title: "Creating a Character",
    section: [
      {
        title: "Abilities",
        content: AbilityComponent,
      },
      {
        title: "Age",
        content: AgeComponent,
      },
      {
        title: "Personality",
        content: PersonalityComponent,
        rows: 4,
      },
      {
        title: "Apperance",
        content: ApperanceComponent,
      },
      {
        title: "Endurance",
        content: EnduranceComponent,
      },
      {
        title: "Corruption",
        content: CorruptionComponent,
      },
      {
        title: "Progression",
        content: ProgressionComponent,
      },
      {
        title: "Skills",
        content: SkillsComponent,
      },
      {
        content: SkillsExampleComponent,
        props: { openSkillsDialog },
      },
      {
        title: "Gear",
        content: GearComponent,
      },
      {
        content: GoodsComponent,
      },
    ],
  },
  {
    title: "Playing the Game",
    section: [
      {
        title: "Role-Playing",
        content: RolePlayingComponent,
      },
      {
        title: "Target",
        content: TargetComponent,
      },
      {
        title: "Ability Checks",
        content: AbilityCheckComponent,
      },
      {
        title: "Effort",
        content: EffortComponent,
      },
      {
        title: "Helping",
        content: HelpingComponent,
      },
      {
        title: "Wounds",
        content: WoundsComponent,
      },
      {
        title: "Healing",
        content: HealingComponent,
        rows: 2,
      },
      {
        title: "Death",
        content: DeathComponent,
      },
      {
        title: "Bonus & Penalty",
        content: BonusComponent,
      },
      {
        title: "Injury",
        content: InjuryComponent,
        rows: 2,
      },
      {
        title: "Corruption",
        content: CorruptionComponent,
      },
      {
        title: "Insanity",
        content: InsanityComponent
      },
      {
        title: "Resurrection",
        content: ResurrectionComponent,
      },
      {
        title: "Traveling",
        content: TravelingComponent,
        props: {
          openTravelingEventsDialog,
        }
      },
      {
        title: "Resting",
        content: RestingComponent,
      },
      { content: RestingEventsComponent },
      {
        title: "Crafting",
        content: CraftingComponent,
      },
      { content: CraftingMaterialsComponent },
    ],
  },
  {
    title: "Fighting Monsters",
    section: [
      { content: FightingMonstersComponent },
      {
        title: "Actions",
        content: ActionsComponent,
      },
      {
        title: "Movement",
        content: MovementComponent,
        rows: 2,
      },
      {
        title: "Attacking",
        content: AttackingComponent
      },
      {
        title: "Defending",
        content: DefendingComponent
      },
      {
        title: "Unarmed Combat",
        content: UnarmedCombat,
      },
      {
        title: "Maneuvers",
        content: ManeuversComponent,
        rows: 3,
      },
      {
        title: "Advantage",
        content: AdvantageComponent,
      },
      {
        title: "Throwing",
        content: ThrowingComponent,
      },
      {
        title: "Reflex",
        content: ReflexComponent,
      },
      {
        title: "Difficult Terrain",
        content: DifficultTerrainComponent,
      },
      {
        title: "Fleeing",
        content: FleeingComponent,
      },
      {
        title: "Ambush",
        content: AmbushComponent,
      },
      {
        title: "Ailments",
        content: AilmentComponent,
        rows: 2
      },
      {
        title: 'Modifiers',
        content: ModifiersComponent
      }
    ],
  },
  {
    title: "Casting Spells",
    section: [
      { content: CastingSpellComponent },
      {
        title: "Spellcasting",
        content: SpellcastingComponent,
        rows: 2,
      },
      {
        title: "Mana",
        content: ManaComponent,
      },
      {
        title: "Mana Surge",
        content: ManaSurgeComponent,
      },
      {
        title: "Multi-Targeting",
        content: MultiTargetingComponent,
      },
      {
        title: "Rules & Limitations",
        content: SpellRulesComponent,
        rows: 2,
      },
      {
        title: "Spell Resolution",
        content: SpellResolution,
      },
      { content: AttackSpellComponent, rows: 2 },
      { content: DefenseSpellComponent },
      { content: BlessingSpellComponent },
      { content: CurseSpellComponent, rows: 2 },
      { content: UtilitySpellComponent },
      { content: IllusionSpellComponent },
      { content: SummoningSpellComponent, rows: 2 },
      { content: HealingSpellComponent },
    ],
  },
];
</script>

<template>
  <Dialog modal v-model:visible="isSkillsDialogOpen" header="Skills">
    <div class="dialog-popup">
      <div class="item" v-for="skill in skills">
        <p>
          <b class="text-contrast">{{ skill.name }}: </b>
          <template v-for="desc in skill.description">
            {{ desc }}
          </template>
        </p>
      </div>
    </div>
  </Dialog>
  <Dialog modal v-model:visible="isTravelingEventsDialogOpen" header="Travel Events">
    <div class="dialog-popup">
      <div class="item" v-for="(travelEvent, index) in travelEvents">
        <p>
          <b class="text-contrast">{{index + 1}}. {{ travelEvent.name }}</b>
        </p>
        <p>
          {{ travelEvent.description }}
        </p>
        <template v-for="(option, optionIndex) in travelEvent.options">
          <p>
            <b class="text-contrast">{{ String.fromCharCode(65 + optionIndex) }}. </b>
            {{ option.description }}
          </p>
          <p>
            {{ option.outcome }}
          </p>
        </template>
      </div>
    </div>
  </Dialog>
  <RulesComponent show-contents title="Rulebook" :data="data" />
</template>

<style lang="css">
.dialog-popup {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 800px;
  gap: 20px;
  
  .item {
    display: flex;
    flex-direction: column;
    width: calc(50% - 20px);
    gap: 10px;
  }
}
p {
  color: var(--p-stone-200);
}
.p-dialog {
  font-family: "Roboto", sans-serif;
  font-weight: 500;
  font-style: normal;
  color: var(--p-stone-200);
  font-size: 24px;
}

.goods {
  display: flex;
  gap: 20px;
  flex-direction: column;

  .good {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
}
</style>
