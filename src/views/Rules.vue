<script lang="ts" setup>
import { ref } from "vue";
import { skills } from "../data/skills";
import { Dialog } from "primevue";
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
import TurnOrderComponent from "../components/rules/fighting-monsters/TurnOrderComponent.vue";
import ActionsComponent from "../components/rules/fighting-monsters/ActionsComponent.vue";
import AttackingComponent from "../components/rules/fighting-monsters/AttackingComponent.vue";
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
import ChannelingManaComponent from "../components/rules/casting-spells/ChannelingManaComponent.vue";
import SpellResolution from "../components/rules/casting-spells/SpellResolution.vue";
import SpellRulesComponent from "../components/rules/casting-spells/SpellRulesComponent.vue";
import ManaSurgeComponent from "../components/rules/casting-spells/ManaSurgeComponent.vue";
import SpellcastingComponent from "../components/rules/casting-spells/SpellcastingComponent.vue";
import MultiTargetingComponent from "../components/rules/casting-spells/MultiTargetingComponent.vue";
import AttackSpellComponent from "../components/rules/casting-spells/spell-resolution/AttackSpellComponent.vue";
import DefenseSpellComponent from "../components/rules/casting-spells/spell-resolution/DefenseSpellComponent.vue";
import UtilitySpellComponent from "../components/rules/casting-spells/spell-resolution/UtilitySpellComponent.vue";
import BlessingsComponent from "../components/rules/casting-spells/spell-resolution/BlessingsComponent.vue";
import CursesComponent from "../components/rules/casting-spells/spell-resolution/CursesComponent.vue";
import ApplyCurseComponent from "../components/rules/casting-spells/spell-resolution/ApplyCurseComponent.vue";
import ModifiersComponent from "../components/rules/fighting-monsters/ModifiersComponent.vue";

const isSkillsDialogOpen = ref<boolean>(false);
function openSkillsDialog() {
  isSkillsDialogOpen.value = true;
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
      },
      {
        title: "Death",
        content: DeathComponent,
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
        title: "Bonus & Penalty",
        content: BonusComponent,
      },
      {
        title: "Resurrection",
        content: ResurrectionComponent,
      },
      {
        title: "Traveling",
        content: TravelingComponent,
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
        title: "Turn Order",
        content: TurnOrderComponent,
        rows: 2,
      },
      {
        title: "Actions",
        content: ActionsComponent,
      },
      {
        title: "Attacking",
        content: AttackingComponent,
        rows: 2,
      },
      {
        title: "Movement",
        content: MovementComponent,
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
        title: "Channeling Mana",
        content: ChannelingManaComponent,
        rows: 2,
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
      { content: BlessingsComponent },
      { content: CursesComponent },
      { content: ApplyCurseComponent },
      { content: UtilitySpellComponent },
    ],
  },
];
</script>

<template>
  <Dialog modal v-model:visible="isSkillsDialogOpen" header="Skills">
    <div class="skill-examples">
      <div class="skill-example" v-for="skill in skills">
        <h4 class="text-contrast">{{ skill.name }}:</h4>
        <p v-for="desc in skill.description">
          {{ desc }}
        </p>
      </div>
    </div>
  </Dialog>
  <RulesComponent show-contents title="Rulebook" :data="data" />
</template>

<style lang="css">
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
