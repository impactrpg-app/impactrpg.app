<script setup lang="ts">
import { Button, Dialog } from "primevue";
import { abilities } from "../data/ability";
import { ages } from "../data/age";
import { personalities } from "../data/personality";
import { weapons } from "../data/weapons";
import { armors } from "../data/armor";
import { goods } from "../data/goods";
import { targets } from "../data/target";
import { efforts } from "../data/effort";
import { injuryEffects } from "../data/injury";
import { restActions, restEvents } from "../data/rest";
import {
  craftingTargets,
  materialProperties,
  materials,
} from "../data/crafting";
import { skills } from "../data/skills";
import { ref } from "vue";

const isSkillsDialogOpen = ref<boolean>(false);

function openSkillsDialog() {
  isSkillsDialogOpen.value = true;
}
</script>

<template>
  <div class="rules">
    <Button
      as="a"
      icon="pi pi-chevron-up"
      href="#"
      style="
        position: fixed;
        top: 20px;
        border-radius: 50%;
        width: 50px;
        height: 50px;
      "
    />
    <Dialog
      modal
      v-model:visible="isSkillsDialogOpen"
      header="Skills"
      :style="{}"
    >
      <div class="skill-examples">
        <div class="skill-example" v-for="skill in skills">
          <h4 class="text-contrast">{{ skill.name }}:</h4>
          <p v-for="desc in skill.description">
            {{ desc }}
          </p>
        </div>
      </div>
    </Dialog>
    <h1>Impact Rules</h1>
    <div class="contents">
      <div class="section">
        <a href="#create-character">
          <h6 class="heading">Creating a Character</h6>
        </a>
        <a href="#abilities">
          <h6>Abilities</h6>
        </a>
        <a href="#age">
          <h6>Age</h6>
        </a>
        <a href="#personality">
          <h6>Personality</h6>
        </a>
        <a href="#apperance">
          <h6>Apperance</h6>
        </a>
        <a href="#endurance">
          <h6>Endurance</h6>
        </a>
        <a href="#corruption">
          <h6>Corruption</h6>
        </a>
        <a href="#progression">
          <h6>Progression</h6>
        </a>
        <a href="#skills">
          <h6>Skills</h6>
        </a>
        <a href="#gear">
          <h6>Gear</h6>
        </a>
      </div>
      <div class="section">
        <a href="#playing-the-game">
          <h6 class="heading">Playing the Game</h6>
        </a>
        <a href="#role-playing">
          <h6>Role-playing</h6>
        </a>
        <a href="#ability-checks">
          <h6>Ability Checks</h6>
        </a>
        <a href="#target">
          <h6>Target</h6>
        </a>
        <a href="#effort">
          <h6>Effort</h6>
        </a>
        <a href="#bonus-and-penalty">
          <h6>Bonus & Penalty</h6>
        </a>
        <a href="#helping">
          <h6>Helping</h6>
        </a>
        <a href="#wounds">
          <h6>Wounds</h6>
        </a>
        <a href="#healing">
          <h6>Healing</h6>
        </a>
        <a href="#death">
          <h6>Death</h6>
        </a>
        <a href="#injury">
          <h6>Injury</h6>
        </a>
        <a href="#resurrection">
          <h6>Resurrection</h6>
        </a>
        <a href="#corruption">
          <h6>Corruption</h6>
        </a>
        <a href="#traveling">
          <h6>Traveling</h6>
        </a>
        <a href="#resting">
          <h6>Resting</h6>
        </a>
        <a href="#crafting">
          <h6>Crafting</h6>
        </a>
      </div>
      <div class="section">
        <a href="#fighting-monsters">
          <h6 class="heading">Fighting Monsters</h6>
        </a>
        <a href="#turn-order">
          <h6>Turn Order</h6>
        </a>
        <a href="#actions">
          <h6>Actions</h6>
        </a>
        <a href="#attacking">
          <h6>Attacking</h6>
        </a>
        <a href="#movement">
          <h6>Movement</h6>
        </a>
        <a href="#maneuvers">
          <h6>Maneuvers</h6>
        </a>
        <a href="#unarmed-combat">
          <h6>Unarmed Combat</h6>
        </a>
        <a href="#advantage">
          <h6>Advantage</h6>
        </a>
        <a href="#throwing">
          <h6>Throwing</h6>
        </a>
        <a href="#reflex">
          <h6>Reflex</h6>
        </a>
        <a href="#difficult-terrain">
          <h6>Difficult Terrain</h6>
        </a>
        <a href="#fleeing">
          <h6>Fleeing</h6>
        </a>
        <a href="#ambush">
          <h6>Ambush</h6>
        </a>
        <a href="#poison">
          <h6>Poison</h6>
        </a>
      </div>
      <div class="section">
        <a href="#casting-spells">
          <h6 class="heading">Casting Spells</h6>
        </a>
        <a href="#channeling-mana">
          <h6>Channeling Mana</h6>
        </a>
        <a href="#mana-surge">
          <h6>Mana Surge</h6>
        </a>
        <a href="#spellcasting">
          <h6>Spellcasting</h6>
        </a>
        <a href="#spell-resolution">
          <h6>Spell Resolution</h6>
        </a>
        <a href="#multi-targeting">
          <h6>Multi-Targeting</h6>
        </a>
        <a href="#rules-and-limitations">
          <h6>Rules & Limitations</h6>
        </a>
      </div>
    </div>
    <h1 id="create-character">Creating a Character</h1>
    <div class="page">
      <div class="column">
        <div class="block">
          <h2 id="abilities">ABILITIES</h2>
          <p>
            Each character possesses three core abilities that define their
            strengths and weaknesses. These abilities shape how your character
            interacts with the world and excels in various tasks.
          </p>
          <template v-for="ability in abilities">
            <h3 class="text-contrast">{{ ability.name }}</h3>
            <p>{{ ability.description }}</p>
          </template>
          <p>
            Distribute values among your abilities: assign 3 to one ability, 2
            to another, and 1 to the last.
          </p>
        </div>
      </div>
      <div class="column">
        <h2 id="age">AGE</h2>
        <p>
          Your age represents how old your character is. You can write down a
          number but you must select one of the 3 options.
        </p>
        <template v-for="(age, index) in ages">
          <h3 class="text-contrast">{{ index + 1 }}. {{ age.name }}</h3>
          <p>
            <i>{{ age.description }}</i>
          </p>
          <p><b>Benefit: </b> {{ age.benefit }}</p>
        </template>
      </div>
    </div>
    <div class="page">
      <div class="column">
        <h2 id="personality">PERSONALITY</h2>
        <p>
          Your character's personality defines how they respond to situations
          and interact with others. When role-playing, strive to act in line
          with your character's chosen traits. For example, an agreeable
          character might be easily deceived by lies.
        </p>
        <p>
          Regardless of your personality choice, remember to work cooperatively
          with the party and avoid actions that intentionally disrupt group
          cohesion.
        </p>
        <template v-for="(personality, index) in personalities">
          <h3 class="text-contrast">{{ index + 1 }}. {{ personality.name }}</h3>
          <p>{{ personality.description }}</p>
        </template>
      </div>
      <div class="column">
        <h2 id="apperance">APPERANCE</h2>
        <p>
          Decide how your character looks, including their race and physical
          features. They might be an elf, a towering giant, or even a giant
          rat—the choice is yours! Your character's appearance is purely
          cosmetic and does not provide any mechanical advantages or
          disadvantages.
        </p>
        <h2 id="endurance">ENDURANCE</h2>
        <p>
          Endurance represents your character's stamina, determining how long
          they can endure in combat or navigate challenging terrain.
        </p>
        <p><b>Maximum Endurance: </b> Calculated as 10 + your Agility score.</p>
        <p><b>Starting Endurance:</b> Begins at your Maximum Endurance.</p>
        <h2 id="corruption">CORRUPTION</h2>
        <p>
          Corruption reflects the toll of witnessing horrors and enduring
          fear-inducing experiences. Each time your character encounters a
          terrifying event or faces a foe that strikes fear into their heart,
          they gain Corruption.
        </p>
        <p><b>Starting corruption:</b> 0</p>
        <h2 id="progression">PROGRESSION</h2>
        <p>
          Whenever you roll a 6 on an ability check, attack roll, or while
          channeling magic, you gain 1 progression point.
        </p>
        <p>
          Once you accumulate 6 progression points, you may pick a new skill or
          improve an existing one.
        </p>
      </div>
    </div>
    <div class="page">
      <div class="column">
        <h2 id="skills">SKILLS</h2>
        <p>
          At character creation, you may select 2 different skills. Skills
          provide unique abilities or advantages, allowing you to customize your
          character's strengths and playstyle.
        </p>
        <p>
          You cannot choose the same skill more than once but you may choose to
          upgrade the skill instead.
        </p>
        <p>
          A skill can be more than a bonus. It can give the character a unique
          ability or modify the rules. Players and DMs can work together to
          create unique skills for each player.
        </p>
      </div>
      <div class="column">
        <h3>Skill Examples</h3>
        <p>You have a bonus to <b class="text-contrast">stealth</b></p>
        <p>You have a bonus to <b class="text-contrast">lockpicking</b></p>
        <p>
          <b class="text-contrast">Parry:</b> If your defense roll exceeds an
          attacker's roll, you may spend 1 Endurance to inflict 1 wound on the
          attacker.
        </p>
        <p>
          <b class="text-contrast">Divine Light:</b> Spend 2 Endurance to heal 1
          wound from a character.
        </p>
        <p>
          <b class="text-contrast">Blood Magic:</b> Transfer wounds between
          willing characters.
        </p>
        <Button variant="text" @click="openSkillsDialog">View More</Button>
      </div>
    </div>
    <div class="page">
      <div class="column" :style="{ height: '1945px' }">
        <div class="block">
          <h2 id="gear">GEAR</h2>
          <p>
            Anything your character carries is considered goods, including
            weapons, armor, tools, and trinkets.
          </p>
          <p>There are two types of goods: small goods and large goods.</p>
          <p>
            <b>Small Goods:</b>
            Items that can be held in one hand or fit inside your pocket.
          </p>
          <p>
            <b>Large Goods:</b>
            Items that require both hands to carry and cannot fit in your
            pockets or be easily concealed.
          </p>
          <p>
            At character creation, you may choose 2 large goods worth of items.
          </p>
          <p>Two small goods can be counted as one large good.</p>
        </div>
        <h3>WEAPONS</h3>
        <div class="block" v-for="weapon in weapons">
          <h4>{{ weapon.name }}</h4>
          <p>
            <i>{{ weapon.description }}</i>
          </p>
          <p>
            <span v-if="weapon.attack">
              <b>Attack: </b> {{ weapon.attack }},
            </span>
            <span v-if="weapon.armor">
              <b>Armor: </b> {{ weapon.armor }},
            </span>
            <span v-if="weapon.size"> <b>Size: </b> {{ weapon.size }} </span>
          </p>
          <p v-for="keyword in weapon.keywords">
            <b>{{ keyword[0] }}:</b>
            {{ keyword[1] }}
          </p>
        </div>
      </div>
    </div>
    <div class="page">
      <div class="column" :style="{ height: '1425px' }">
        <div class="block">
          <h3>ARMOR</h3>
          <p>
            Armor provides protection by increasing your armor value, which
            reduces the damage you take in combat. The amount of armor you wear
            determines whether you are considered lightly armored or heavily
            armored.
          </p>
        </div>
        <div class="block" v-for="armor in armors">
          <h4>{{ armor.name }}</h4>
          <p>
            {{ armor.description }}
          </p>
          <p><b>Effect:</b> Add {{ armor.armor }} to your armor value</p>
        </div>
        <h3>OTHER GOODS</h3>
        <div class="block" v-for="good in goods">
          <h4>{{ good.name }}</h4>
          <p><b>Size:</b> {{ good.size }}</p>
          <p v-for="text in good.description">
            {{ text }}
          </p>
        </div>
      </div>
    </div>
    <h1 id="playing-the-game">Playing the Game</h1>
    <div class="page">
      <div class="column" :style="{ height: '1570px' }">
        <div class="block">
          <p>
            This game requires a minimum of three players: one will serve as the
            referee, referred to as the DM (Dungeon Master), and the others will
            create characters and role-play their adventures.
          </p>
        </div>
        <div class="block">
          <h2 id="role-playing">ROLE-PLAYING</h2>
          <p>
            The DM sets the scene, describing the environment, challenges, and
            interactive elements. Players respond by narrating their characters'
            actions within the world.
          </p>
          <p>
            Players and the DM collaborate to tell a cohesive story rather than
            compete against one another.
          </p>
          <p>
            Actions must align with the world's logic; impossible feats like
            flying without wings are not permitted.
          </p>
        </div>
        <div class="block">
          <h2 id="ability-checks">ABILITY CHECK</h2>
          <p>
            When a character attempts an uncertain action, the DM may call for
            an ability check to determine the outcome.
          </p>
          <p>
            The DM specifies the ability involved (e.g., Strength,
            Intelligence).
          </p>
          <p>
            Checks can only be attempted once; failure assumes all attempts have
            failed.
          </p>
          <p>
            Use six-sided dice (D6) for checks. Rolls of 4 or 5 yield 1 success
            and Rolls of 6 yield 2 successes.
          </p>
          <p>
            The number of successes required depends on the task's difficulty,
            as set by the DM.
          </p>
          <p><b>Example</b></p>
          <p>
            DM:
            <i>
              "There's a gap to jump. Make an Easy Strength Check (2
              successes)."
            </i>
          </p>
          <p>
            Player:
            <i
              >"I have 2 Strength and +1D6 from my Athletics skill. I'll roll
              3D6."
            </i>
          </p>
          <p>
            Player rolls:
            <i>[2, 4, 5] → 2 successes. </i>
          </p>
          <p>DM: <i>"You successfully jump the gap."</i></p>
        </div>
        <div class="block">
          <h2 id="target">TARGET</h2>
          <p>
            The DM sets a target, which is the number of successes required to
            complete a task. Use natural language when describing difficulty
            levels:
          </p>
          <p v-for="target in targets">
            <b class="text-contrast">{{ target.name }}:</b>
            {{ target.value }} success
          </p>
          <p>
            If the target exceeds twice the dice pool (e.g., 9 required
            successes with 4D6), the task automatically fails.
          </p>
          <p>Tasks requiring 0 successes automatically succeed.</p>
        </div>
        <div class="block">
          <h2 id="effort">EFFORT</h2>
          <p>
            For tasks that require cumulative progress (e.g., breaking a door),
            use Effort.
          </p>
          <p>Each attempt adds to the total number of successes.</p>
          <p>Failure isn't possible, but attempts may cost time.</p>
          <p><b>Example</b></p>
          <p>DM: <i>"Break the door. Roll a Strength Check."</i></p>
          <p>Player rolls: <i>[3 successes].</i></p>
          <p>
            DM:
            <i>
              "The door starts to splinter, but a guard notices you." Player
              rolls again: [2 successes].
            </i>
          </p>
          <p>DM: <i>"The door breaks open."</i></p>
          <p>
            Effort can also be used competitively to compare progress between
            characters, such as in a race.
          </p>
          <p v-for="effort in efforts">
            <b class="text-contrast">{{ effort.name }}:</b>
            {{ effort.value }} success
          </p>
        </div>
      </div>
    </div>
    <div class="page">
      <div class="column">
        <div class="block">
          <h2 id="helping">HELPING</h2>
          <p>
            When attempting an ability check, other players can assist to
            improve your chances of success. Each player helping you allows you
            to re-roll one die during your check.
          </p>
          <p>
            The DM may decide the maximum number of players who can assist,
            based on the situation.
          </p>
          <p><b>Examples</b></p>
          <p><i>Breaking down a door might allow up to two helpers.</i></p>
          <p>
            <i>
              Lockpicking is a solitary task and does not allow assistance.
            </i>
          </p>
        </div>
        <div class="block">
          <h2 id="wounds">WOUNDS</h2>
          <p>Wounds replace traditional health, adding urgency to survival.</p>
          <p>Characters can sustain 3 + Strength wounds before perishing.</p>
          <p>
            If a character takes 3 wounds from a single source, they also suffer
            an injury.
          </p>
        </div>
      </div>
      <div class="column">
        <div class="block">
          <h2 id="bonus-and-penalty">BONUS & PENALTY</h2>
          <p><b>Bonus:</b> Add +1D6 to your roll.</p>
          <p><b>Penalty:</b> Remove -1D6 to your roll.</p>
          <p>Bonuses and Penalties stack (e.g., +2D6 or -2D6).</p>
        </div>
        <div class="block">
          <h2 id="healing">HEALING</h2>
          <p>Characters can heal others with an Intelligence Check.</p>
          <p>
            The target of the intelligence check equals to the number of wounds
            the injured character has.
          </p>
          <p>
            If you pass the intelligence check you can successfully heal 1 wound
            from the target.
          </p>
          <p>
            Healing is only possible for willing creatures. Insane characters or
            unwilling creatures cannot be healed.
          </p>
        </div>
        <div class="block">
          <h2 id="death">DEATH</h2>
          <p>When wounds exceed the threshold, the character dies instantly.</p>
          <p>
            A deceased body is treated as a large good if another character
            wishes to carry it.
          </p>
        </div>
      </div>
    </div>
    <div class="page">
      <div class="column">
        <div class="block">
          <h2 id="injury">INJURY</h2>
          <p>Injuries occur when a character takes significant damage.</p>
          <p>Roll for injuries using the table below.</p>
          <p v-for="(injury, index) in injuryEffects">
            <b class="text-contrast">{{ index + 1 }}. {{ injury.name }}:</b>
            {{ injury.description }}
          </p>
        </div>
        <div class="block">
          <h2 id="corruption">CORRUPTION</h2>
          <p>
            Corruption reflects the character's mental state. Gain corruption
            from:
          </p>
          <ul>
            <li>Witnessing horrifying events (e.g. massacres).</li>
            <li>Performing evil actions (e.g. killing innocents)</li>
            <li>Losing a party member</li>
          </ul>
          <h3>INSANITY</h3>
          <p>
            If corruption reaches 3, the character goes insane. While insane you
            have the following effects.
          </p>
          <ul>
            <li>
              Role-play as hopeless and defeatist, discouraging the group.
            </li>
            <li>
              Penalties to attack rolls, defense rolls and channeling magic.
            </li>
            <li>
              You refused to be healed by anyone and you cannot heal others.
            </li>
            <li>
              During rest you can only sleep or tell a story. (while telling a
              story explain to everyone how the world will end tomorrow)
            </li>
          </ul>
        </div>
      </div>
      <div class="column">
        <div class="block">
          <h2 id="resurrection">RESURRECTION</h2>
          <p>
            When a player character dies, they can be brought back to life
            through a ritual. This ritual involves communing with a god,
            requesting their intervention to resurrect the fallen character.
          </p>
          <p>
            Only player characters can be resurrected using this method.
            Non-player characters are not eligible.
          </p>
          <p>
            The ritual does not guarantee contact with the desired god. You
            might reach a different entity, such as a daemon, whose resurrection
            comes with its own risks and conditions.
          </p>
          <h3>RESURRECTION PAYMENT</h3>
          <p>
            Resurrection always comes at a cost. The entity performing the
            resurrection will demand payment after the character is revived. The
            payment is binding and directly affects the resurrected character or
            the party.
          </p>
          <p>
            he DM will determine a suitable payment based on the story.
            Alternatively, you can roll on the following table to decide the
            payment:
          </p>
          <p>
            <b class="text-contrast">1.</b>
            Sacrifice 2 large goods worth of items.
          </p>
          <p>
            <b class="text-contrast">2.</b>
            Undertake a quest to retrieve an item or artifact requested by the
            entity.
          </p>
          <p>
            <b class="text-contrast">3.</b>
            Become a pawn of the resurrecting entity, compelled to do their
            bidding. Defying them results in punishment.
          </p>
          <p>
            <b class="text-contrast">4.</b>
            Lose 1 skill of your choice.
          </p>
          <p>
            <b class="text-contrast">5.</b>
            Reduce the maximum wounds you can take by one.
          </p>
          <p>
            <b class="text-contrast">6.</b>
            Lower your maximum endurance by 2.
          </p>
        </div>
      </div>
    </div>
    <div class="page">
      <div class="column">
        <div class="block">
          <h2 id="traveling">TRAVELING</h2>
          <p>
            When traveling across the world, distances are categorized into
            three types: Short, Far, and Journey. Each type of travel determines
            the number and frequency of Travel Events that the party will
            encounter.
          </p>
          <h3>TRAVEL DISTANCES</h3>
          <h4>Short</h4>
          <p>
            A short distance takes less than a day to complete. You can reach
            the destination and return the same day.
          </p>
          <p><b>Roll 1D6</b> for each success, trigger one travel event</p>
          <h4>Far</h4>
          <p>
            Far travel consumes most of the day. You will need to rest before
            heading back.
          </p>
          <p><b>Roll 2D6</b> for each success, trigger one travel event</p>
          <h4>Journey</h4>
          <p>
            Journey travel spans multiple days or even months. It requires
            preparation and endurance.
          </p>
          <p><b>Roll 2D6</b> for each success, trigger one travel event.</p>
          <p>
            Trigger 2 planned events on the travels. This can be combat focused
            or the players may come across a mini dungeon and key landmarks.
          </p>
        </div>
        <div class="block">
          <h3>TERRAIN</h3>
          <h4>IMPOSSIBLE TERRAIN</h4>
          <p>
            Certain paths are blocked and cannot be traversed without special
            tools or abilities.
          </p>
          <p>
            <i>
              A mountain blocks the route. You'll need climbing gear to proceed
              or find an alternate path.
            </i>
          </p>
          <h4>DIFFICULT TERRAIN</h4>
          <p>
            Some areas require significant effort and endurance to traverse.
          </p>
          <p>
            <i>
              Wading through hip-deep mud costs 3 endurance per character.
            </i>
          </p>
        </div>
        <div class="block">
          <h3>TRAVEL EVENTS</h3>
          <p>
            Travel events add narrative depth to journeys. These events should
            be:
          </p>
          <p><b>Quick</b> They should not derail the main story.</p>
          <p>
            <b>Decision-Driven</b> The players must make meaningful choices,
            each with consequences.
          </p>
          <p>
            <b>Dynamic</b> Avoid repeating the same event too often unless
            players explore different outcomes.
          </p>
          <p><b>The DM May.</b></p>
          <ul>
            <li>Randomly roll for events.</li>
            <li>Choose specific events based on the story or region.</li>
            <li>Design custom events to fit the setting or environment.</li>
          </ul>
        </div>
      </div>
      <div class="column">
        <div class="block">
          <h3>TRAVEL EVENTS TABLE</h3>
          <h4>1. Bandit Trap</h4>
          <p>
            You stumble into a trap set by bandits. They demand valuables in
            exchange for your safety.
          </p>
          <p>
            <b>A:</b> Refuse to negotiate and fight. Each player takes 2 wounds.
          </p>
          <p>
            <b>B:</b> Surrender valuables. Each player loses 1 good of their
            choice.
          </p>
        </div>
        <div class="block">
          <h4>2. Bear Attack</h4>
          <p>You hear screams and see a bear attacking villagers.</p>
          <p>
            <b>A:</b> Help the villagers. After defeating the bear, you receive
            camp supplies as a reward. Lose 3 endurance.
          </p>
          <p>
            <b>B:</b> Leave the villagers. The guilt haunts you. Gain 1
            corruption.
          </p>
          <p>
            <b>C:</b> Wait for the bear to finish, then loot the corpses. Gain 2
            corruption and camp supplies for each character.
          </p>
        </div>
        <div class="block">
          <h4>3. Broken Wagon</h4>
          <p>An old man's wagon wheel has broken.</p>
          <p>
            <b>A:</b> Help fix the wagon. Lose 2 endurance, but receive 1
            healing balm as thanks.
          </p>
          <p><b>B:</b> Rob the man. Gain 2 corruption and 2 random goods.</p>
          <p>
            <b>C:</b> Ignore him. Gain 1 corruption for leaving him in need.
          </p>
        </div>
        <div class="block">
          <h4>4. Storm</h4>
          <p>Clouds gather, and a storm is approaching.</p>
          <p>
            <b>A:</b> Find shelter in a shed and wait out the storm. Lose 2
            endurance.
          </p>
          <p>
            <b>B:</b> Brave the storm, enduring bruises and cuts. Gain 1 wound.
          </p>
        </div>
        <div class="block">
          <h4>5. Unfamiliar Path</h4>
          <p>You enter a dark, uncharted area.</p>
          <p>
            <b>A:</b> Retrace your steps and find a safer route. Lose 2
            endurance.
          </p>
          <p>
            <b>B:</b> Proceed and witness a massacre. Gain 2 corruption from the
            horrific sight.
          </p>
        </div>
        <div class="block">
          <h4>6. Sickly Woman</h4>
          <p>A coughing woman begs for help.</p>
          <p>
            <b>A:</b> Cook a meal for her. She gives you a torch in gratitude.
            Lose 2 endurance.
          </p>
          <p>
            <b>B:</b> Ignore her. Gain 1 corruption, wondering about her fate.
          </p>
          <p><b>C:</b> Rob her belongings. Gain 1 corruption and a torch.</p>
          <p>
            <b>D:</b> Attack her. You're unsure if she's alive afterward. Gain 2
            corruption.
          </p>
        </div>
      </div>
    </div>
    <div class="page">
      <div class="column">
        <div class="block">
          <h2 id="resting">RESTING</h2>
          <p>
            When resting, it is assumed that characters gather the necessary
            ingredients for any actions taken during the rest.
          </p>
          <p>
            Resting actions should align with the environment: for example, you
            cannot cook in a desert without ingredients or resources.
          </p>
          <p>
            Resting lasts for 4-8 hours. Anything above 8 hours counts as two
            rests.
          </p>
        </div>
        <div class="block">
          <h3>RESTING ACTIONS</h3>
          <p>
            While you are inside of a town or safe location you may do 2 free
            rest actions and no more.
          </p>
          <template v-for="action in restActions">
            <h4>{{ action.name }}</h4>
            <p v-for="desc in action.description">
              {{ desc }}
            </p>
          </template>
        </div>
      </div>
      <div class="column">
        <div class="block">
          <h3>RESTING EVENTS</h3>
          <p>
            When the party rests outside of a town or safe location, Resting
            Events may reduce the number of actions players can perform during
            that rest. The number of events is based on how many rests the party
            has taken since leaving a town.
          </p>
          <p><b>First Rest After Leaving:</b> No events.</p>
          <p><b>Second Rest:</b> 1 event.</p>
          <p><b>Third Rest:</b> 2 events, and so on.</p>
          <p>
            Roll on the Resting Events Table once for each event to determine
            what occurs.
          </p>
          <p>
            You should roll on the table after the characters have decided what
            they will be doing during the rest.
          </p>
          <p>
            The Resting Event Count resets to 0 when the party enters a town or
            fortified safe location. If the party leaves again, the event count
            starts accumulating anew.
          </p>
          <p>Resting events only effect the current rest.</p>
        </div>
        <div class="block">
          <template v-for="(event, index) in restEvents">
            <h4>{{ index + 1 }}. {{ event.name }}</h4>
            <p v-for="desc in event.description">
              {{ desc }}
            </p>
          </template>
        </div>
      </div>
    </div>
    <div class="page">
      <div class="column">
        <div class="block">
          <h2 id="crafting">CRAFTING</h2>
          <p>
            Crafting allows characters to use rest actions to create valuable
            items using materials they have gathered.
          </p>
          <p>
            Each time you take the Crafting rest action, roll a Strength Check.
          </p>
          <p>
            The successes from each check are cumulative and contribute to the
            total effort needed to complete the item.
          </p>
          <p>Once you reach the required effort, the item is crafted.</p>
        </div>
        <div class="block">
          <h3>RULES FOR CRAFTING</h3>
          <p>
            <b class="text-contrast">Materials:</b> You must consume a material
            appropriate for the item you wish to craft. Materials can be
            obtained from monsters, merchants, or exploration.
          </p>
          <p>
            <b class="text-contrast">Item Loss:</b> If you try to craft another
            item while you are already crafting something than the item and the
            material are lost.
          </p>
          <p>
            <b class="text-contrast">Progress:</b> You cannot fail at crafting;
            each roll brings you closer to completion. However, crafting takes
            time and may require multiple rests.
          </p>
        </div>
        <div class="block">
          <h3>COMMON MATERIALS</h3>
          <p>These materials are widely available from merchants or smiths:</p>
          <p v-for="material in materials">
            <b class="text-contrast">{{ material.name }}:</b>
            {{ material.description }}
          </p>
        </div>
      </div>
      <div class="column">
        <div class="block">
          <h3>RARE MATERIALS</h3>
          <p>
            Rare materials are obtained from special monsters, treasures, or
            unique rewards.
          </p>
          <p>
            Rare materials usually require higher effort to craft compared to
            common materials.
          </p>
          <p>
            Rare materials imbue crafted items with unique properties based on
            the material.
          </p>
          <h5>RARE MATERIAL PROPERTIES</h5>
          <p v-for="property in materialProperties">
            <b class="text-contrast">{{ property.name }}:</b>
            {{ property.description }}
          </p>
        </div>
        <div class="block">
          <h3>CRAFTING TARGET</h3>
          <p>
            The difficulty of crafting depends on the complexity and quality of
            the item.
          </p>
          <p v-for="target in craftingTargets">
            <b class="text-contrast">{{ target.name }}:</b>
            {{ target.value }}
          </p>
          <p>
            The DM should assign crafting targets based on the materials used
            and the quality of the item being crafted.
          </p>
        </div>
      </div>
    </div>
    <div class="page">
      <div class="column">
        <div class="block"></div>
      </div>
    </div>
    <h1 id="fighting-monsters">Fighting Monsters</h1>
    <div class="page">
      <div class="column">
        <div class="block">
          <p>
            Combat unfolds in a series of turns, with each turn representing 5
            seconds of in-game time.
          </p>
        </div>
        <div class="block">
          <p>
            Each character can typically perform one main action per turn.
            Additionally, they may engage in free actions, such as multitasking
            or brief communication with allies, while attacking or otherwise
            acting.
          </p>
        </div>
        <div class="block">
          <h2 id="turn-order">TURN ORDER</h2>
          <p>
            Turn order is determined by agility, with the character who has the
            highest agility acting first.
          </p>
          <p>
            If multiple characters have the same agility, players always act
            before non-player characters.
          </p>
          <p>
            When player characters tie for agility, they may decide among
            themselves who acts first.
          </p>
        </div>
        <div class="block">
          <h2 id="actions">ACTIONS</h2>
          <p>
            At the start of your turn, you gain one action. Unused actions do
            not carry over to subsequent turns.
          </p>
          <ul>
            <li>Attack</li>
            <li>Performing Maneuvers</li>
            <li>Throwing Items</li>
            <li>Casting Spell</li>
            <li>Or any other activity that comes to your imagination.</li>
          </ul>
        </div>
        <div class="block">
          <h3>DELAYING YOUR TURN</h3>
          <p>
            You may choose to delay your turn by notifying the DM. This allows
            you to act at any point before your next turn.
          </p>
          <p>
            If you delay but fail to act before your next turn, the delayed
            action is lost.
          </p>
          <p>You cannot save or carry over unused delayed actions.</p>
        </div>
      </div>
      <div class="column">
        <div class="block">
          <h2 id="attacking">ATTACKING</h2>
          <p>To attack, spend 1 action and 1 endurance.</p>
          <h4>Roll to Attack</h4>
          <p>
            Perform a Strength check, adding your weapon's attack value as bonus
            dice.
          </p>
          <h4>Defender's Roll</h4>
          <p>
            The defender makes an Agility check, adding their armor value as
            bonus dice.
          </p>
          <h4>Resolve the Outcome</h4>
          <p>Each success on the attack roll represents a potential wound.</p>
          <p>
            The defender cancels one wound for each success on their defense
            roll. Any uncanceled wounds are applied to the defender.
          </p>
          <p>
            If the defender takes 3 or more wounds from a single attack, they
            also suffer an Injury.
          </p>
          <p>
            Defenders do not deal damage to attackers, even if their defense
            roll exceeds the attack roll.
          </p>
        </div>
        <div class="block">
          <h2 id="movement">MOVEMNET</h2>
          <p>
            Movement is assumed to be part of any attack unless otherwise
            restricted.
          </p>
          <h4>BLOCKING MELEE ATTACKS</h4>
          <p>
            If a melee attacker targets a ranged character, any ally of the
            defender may choose to block the attack.
          </p>
          <p>The blocking ally becomes the new target.</p>
          <p>Ranged and magic attacks cannot be blocked by allies.</p>
        </div>
      </div>
    </div>
    <div class="page">
      <div class="column">
        <div class="block">
          <h2 id="maneuvers">MANEUVERS</h2>
          <p>Spend 1 action and 1 endurance to perform a maneuver.</p>
          <p>Describe the maneuver to the DM, then roll an attack as usual.</p>
          <p>
            If your attack roll succeeds (i.e., has more successes than the
            defender's roll), the maneuver takes effect instead of causing
            wounds.
          </p>
          <h5>Examples</h5>
          <p>
            <b class="text-contrast">Grab:</b> The target can only attack you
            for 1 round.
          </p>
          <p>
            <b class="text-contrast">Knockdown:</b> The target's Agility is
            reduced to 0 for 1 round.
          </p>
          <p>
            <b class="text-contrast">Intimidate:</b>
            The target suffers a penalty to their attack rolls.
          </p>
        </div>
        <div class="block">
          <h2 id="unarmed-combat">UNARMED COMBAT</h2>
          <p>
            When attacking with your fists Perform a Strength check without
            adding any weapon bonuses. However, you only inflict 1 maximum
            wound.
          </p>
        </div>
        <div class="block">
          <h2 id="fleeing">FLEEING</h2>
          <p>
            To flee combat, Spend 1 action and 1 endurance to perform an Agility
            check against the highest Agility score among your enemies.
          </p>
          <p><b>On Success</b> You escape, and enemies cannot persue you.</p>
          <p>
            <b> On Failure </b>
            You remain in combat.
          </p>
        </div>
        <div class="block">
          <h2 id="poison">POISON</h2>
          <p>
            Poisoned characters take 1 additional wound from any source of
            damage.
          </p>
          <p>
            Poison cannot be cured by resting. You must consume an antidote to
            remove its effects.
          </p>
        </div>
      </div>
      <div class="column">
        <div class="block">
          <h2 id="advantage">ADVANTAGE</h2>
          <p>
            Characters in advantageous positions (such as higher ground or
            behind cover) receive a bonus to their attack rolls.
          </p>
        </div>
        <div class="block">
          <h2 id="throwing">THROWING</h2>
          <p>
            You may throw an object at a target. Throwing an object counts as a
            normal attack.
          </p>
        </div>
        <div class="block">
          <h2 id="reflex">REFLEX</h2>
          <p>
            Spend 1 endurance to gain a bonus die on either an attack or a
            defense roll. This may only be done once per roll.
          </p>
        </div>
        <div class="block">
          <h2 id="difficult-terrain">DIFFICULT TERRAIN</h2>
          <p>
            Combat in difficult terrain causes characters to lose an additional
            1 endurance when they perform an action.
          </p>
        </div>
        <div class="block">
          <h2 id="ambush">AMBUSH</h2>
          <p>Ambushed characters skip their first turn.</p>
          <p>
            To set up an ambush or a trap describe some information that could
            hint the player there is a trap or an ambush.
          </p>
          <p>
            Make the character's do an Intelligence check. Success allows you to
            gain key information about the situation or prepare for the ambush.
          </p>
          <h5>For example:</h5>
          <p>
            <i>
              If goblin totems are present, a successful check reveals their
              connection to goblins.
            </i>
          </p>
        </div>
      </div>
    </div>
    <h1 id="casting-spells">Casting Spells</h1>
    <div class="page">
      <div class="column">
        <div class="block">
          <p>
            Magic is in the very fabric of reality. All you have to do is reach
            for it to be able to use it.
          </p>
          <p>
            Although everyone has the capability to use magic, most people avoid
            using it for it is difficult to control.
          </p>
        </div>
        <div class="block">
          <h2 id="channeling-mana">CHANNELING MANA</h2>
          <h4>Expend Endurance</h4>
          <p>
            Spend an action to channel mana. When channeling mana choose how
            much endurance are you using to channel mana.
          </p>
          <h4>Generate Mana</h4>
          <p>
            Then do an intelligence check for every endurance lost; Adding up
            all of the successes for each check. All of those successes are
            turned into mana which can be used to cast spells.
          </p>
          <p>Mana persists until you rest or experience a mana surge.</p>
          <p>You may share your mana with any willing creature.</p>
          <p>
            Wearing armor imposes penalties to your Intelligence checks for
            channeling. The penalty equals the total armor value you are
            wearing.
          </p>
          <p>
            <i>
              If wearing heavy armor (2 armor), you suffer a penalty of 2 dice.
            </i>
          </p>
        </div>
        <div class="block">
          <h2 id="spell-resolution">SPELL RESOLUTION</h2>
          <p>This section provides guidance for DMs on adjudicating spells.</p>
          <p>
            Spells can generally be categorized as one or more of the following:
            Attack, Defense, Utility, Bless, or Curse.
          </p>
          <h3>ATTACK SPELLS</h3>
          <p>
            Convert mana into wounds against a target, functioning like a ranged
            attack.
          </p>
          <p>The defender rolls a defense check to resist the spell.</p>
          <p>If successful, unblocked wounds apply to the target.</p>
          <h5>ELEMENTAL EFFECTS</h5>
          <p>
            Attack spells should apply an elemental effect based on the spell's
            nature:
          </p>
          <ul>
            <li>
              <b class="text-contrast">Air</b> The target has a penalty to
              attack rolls for 1 round.
            </li>
            <li><b class="text-contrast">Earth</b> The target is poisoned.</li>
            <li>
              <b class="text-contrast">Fire</b> The target takes an additional
              wound.
            </li>
            <li>
              <b class="text-contrast">Water</b> The target's Agility is reduced
              by 1.
            </li>
          </ul>
        </div>
        <div class="block">
          <h2 id="multi-targeting">MULTI-TARGETING</h2>
          <p>Some spells affect multiple targets.</p>
          <p>
            For each new target divide the amount of mana by 2 then round up.
          </p>
          <p>
            Each target is affected as if the spell was cast individually with
            the adjusted mana.
          </p>
          <p>
            <i>
              When doing an attack targeting 3 characters you may spend 5 mana
              to do 2 potential wounds on each target.
            </i>
          </p>
        </div>
        <div class="block">
          <h2 id="rules-and-limitations">RULES & LIMITATIONS</h2>
          <p>
            The act of channeling mana draws upon the latent energy in the
            world, but it also taxes the body. Greater control over this process
            enables more potent spells.
          </p>
          <h4>MAGIC NULL ZONES</h4>
          <p>
            Certain areas lack magical energy. In these zones, all dice for
            channeling mana roll at their lowest possible value.
          </p>
          <p>
            Magic is raw energy. While it interacts with the physical world, it
            cannot create matter or life.
          </p>
          <h4>Magic Cannot</h4>
          <ul>
            <li>Heal wounds.</li>
            <li>Resurrect a character.</li>
            <li>Summon creatures.</li>
            <li>Create objects or resources.</li>
          </ul>
        </div>
      </div>
      <div class="column">
        <div class="block">
          <h2 id="mana-surge">MANA SURGE</h2>
          <p>
            Magic is inherently volatile, even for seasoned spellcasters. A mana
            surge occurs under two conditions:
          </p>
          <ul>
            <li>
              <b>Failed Channeling:</b> If you attempt to channel mana and gain
              no successes.
            </li>
            <li>
              <b>Mana Overload:</b> If your current mana exceeds your endurance
              value.
            </li>
          </ul>
          <h4>When a Mana Surge Happens</h4>
          <p>All stored mana is lost.</p>
          <p>You suffer an Injury (roll on the injury table).</p>
        </div>
        <div class="block">
          <h2 id="spellcasting">SPELLCASTING</h2>
          <p>Casting a spell involves shaping raw mana into an effect.</p>
          <p>
            Casting a spell does not require an action. You can cast spells as
            long as you have sufficient mana.
          </p>
          <p>
            Pouring more mana into a spell typically results in stronger
            effects.
          </p>
          <h3>How to cast a spell</h3>
          <p>
            <b class="text-contrast">Define Your Intent:</b>
            Describe the desired effect and the amount of mana to use.
          </p>
          <p>
            <b class="text-contrast"> DM Interpretation:</b>
            The DM determines the outcome, which may not align perfectly with
            your intent.
          </p>
          <p>
            <b class="text-contrast">Unpredictable Results:</b>
            Even identical spells may have varied effects. However, spells cast
            with significant mana are more likely to achieve precise results.
          </p>
        </div>
        <div class="block">
          <h3>DEFENSE SPELLS</h3>
          <p>
            Spend 2 mana to enhance a creature's armor value by 1 for 1 round.
            You may do this at any time as long as you have the mana.
          </p>
        </div>
        <div class="block">
          <h3>UTILITY SPELLS</h3>
          <p>
            These spells enable special actions, such as flying, lockpicking, or
            sealing doors.
          </p>
          <p>
            Treat utility spells as ability checks, using the mana spent as the
            successes rolled.
          </p>
          <p>
            Increase the target value required for utility spells by 1 when
            setting a target with the difficulty level.
          </p>
        </div>
        <div class="block">
          <h3>BLESSINGS</h3>
          <p>Blessings enhance objects or willing creatures.</p>
          <p>
            To increase a creature's ability score, the mana spent must match or
            exceed the current ability score.
          </p>
          <p>
            <i>
              Increasing the an ability from 3 to 4 requires at least 3 mana for
              a single round. Spending 5 mana would increase the duration to 3
              rounds but will not increase the ability score.
            </i>
          </p>
          <p>
            The mana spent determines how long the blessing lasts. However,
            there is a minimum limit on how much mana is required for the spell
            to function.
          </p>
        </div>
        <div class="block">
          <h3>CURSES</h3>
          <p>
            Curses impose negative effects on enemies, such as Hold Person,
            Slow, Fear, or Polymorph.
          </p>
          <p>The target must make a defense roll.</p>
          <p>
            If the roll fails to exceed the mana spent, the curse takes effect
            for a single round.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="css" scoped>
.skill-examples {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  gap: 40px;
  max-height: 1500px;
  width: 820px;

  .skill-example {
    display: flex;
    flex-direction: column;
    gap: 5px;
    width: 380px;
  }
}
.rules {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
  margin-top: 200px;
  margin-bottom: 200px;

  .contents {
    display: flex;
    flex-direction: row;
    gap: 50px;
    width: 100%;
    margin-bottom: 50px;
    align-items: flex-start;

    .section {
      display: flex;
      flex-direction: column;
      align-items: center;
      flex-basis: 25%;
      gap: 20px;

      .heading {
        color: var(--p-emerald-200);
      }
      h6 {
        color: var(--p-lime-200);
      }
    }
  }

  .page {
    display: flex;
    flex-direction: row;
    gap: 40px;
    width: 820px;

    .column {
      display: flex;
      flex-direction: column;
      flex-wrap: wrap;
      gap: 20px;
      min-width: 400px;

      .block {
        display: flex;
        flex-direction: column;
        flex-wrap: wrap;
        gap: 20px;
        max-width: 400px;
      }
    }
  }
}
</style>
