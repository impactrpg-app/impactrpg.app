<script lang="ts" setup>
import { weapons } from "../../../data/weapons";
</script>

<template>
  <p>
    Anything your character carries is considered goods, including weapons,
    armor, tools, and trinkets.
  </p>
  <p>There are two types of goods: small goods and large goods.</p>
  <p>
    <b>Small Goods:</b>
    Items that can be held in one hand or fit inside your pocket.
  </p>
  <p>
    <b>Large Goods:</b>
    Items that require both hands to carry and cannot fit in your pockets or be
    easily concealed.
  </p>
  <p>At character creation, you may choose 2 large goods worth of items.</p>
  <p>Your character can carry 5 large goods worth of items.</p>
  <p>Two small goods can be counted as one large good.</p>

  <h3>WEAPONS</h3>
  <div class="goods">
    <div class="good" v-for="weapon in weapons">
      <h4>{{ weapon.name }}</h4>
      <p>
        <i>{{ weapon.description }}</i>
      </p>
      <p>
        <span v-if="weapon.attack"> <b>Attack: </b> {{ weapon.attack }}, </span>
        <span v-if="weapon.armor"> <b>Armor: </b> {{ weapon.armor }}, </span>
        <span v-if="weapon.size"> <b>Size: </b> {{ weapon.size }} </span>
      </p>
      <p v-for="keyword in weapon.keywords">
        <b>{{ keyword[0] }}:</b>
        {{ keyword[1] }}
      </p>
    </div>
  </div>
</template>
