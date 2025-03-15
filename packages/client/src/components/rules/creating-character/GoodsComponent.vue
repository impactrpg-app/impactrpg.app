<script setup lang="ts">
import { armors } from "../../../data/armor";
import { goods } from "../../../data/goods";
</script>

<template>
  <h3>ARMOR</h3>
  <p>
    Armor provides protection by increasing your armor value, which reduces the damage you
    take in combat. The amount of armor you wear determines whether you are considered
    lightly armored or heavily armored.
  </p>
  <div class="goods">
    <div class="good" v-for="armor in armors">
      <h4>{{ armor.name }}</h4>
      <p>
        {{ armor.description }}
      </p>
      <p><b>Effect:</b> Add {{ armor.armor }} to your armor value</p>
    </div>
  </div>

  <h3>OTHER GOODS</h3>
  <div class="goods">
    <div class="good" v-for="good in goods">
      <h4>{{ good.name }}</h4>
      <p><b>Size:</b> {{ good.size }}</p>
      <p v-for="text in good.description">
        {{ text }}
      </p>
    </div>
  </div>
</template>
