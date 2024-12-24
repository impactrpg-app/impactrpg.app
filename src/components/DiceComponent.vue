<script lang="ts" setup>
import { computed, onMounted, ref, watch, type StyleValue } from "vue";
const props = defineProps<{
  showNumber?: number;
  size?: number;
  diceColor?: string;
}>();
type PropType = typeof props;
const rotations: [number, number, number][] = [
  // face, rotX, rotY
  [1, 0, 0],
  [2, -90, 0],
  [3, 90, 0],
  [4, 0, -90],
  [5, 90, 0],
  [6, 180, 0],
];
const scale = computed(() => {
  if (props.size === undefined) return 1;
  return props.size;
});
const rotation = ref<[number, number]>([0, 0]);
const diceColorComputed = computed(() => {
  return props.diceColor ? props.diceColor : 'var(--p-stone-200)';
})
const diceFaceStyle = computed<StyleValue>(() => ({
  background: diceColorComputed.value,
  border: `5px solid ${diceColorComputed.value}`,
}));

function init(props: PropType) {
  rotation.value = [0, 0];
  const numberToShow = rotations.find((r) => r[0] === props.showNumber);
  let rot: [number, number] = [rotations[0][1], rotations[0][2]];
  if (numberToShow) {
    rot = [numberToShow[1], numberToShow[2]];
  }

  rotation.value = rot;
}
watch(props, init);
onMounted(() => init(props));
</script>

<template>
  <div class="dice" :style="{
    transform: `
      rotateX(${rotation[0]}deg) rotateY(${rotation[1]}deg) 
      scale3d(${scale}, ${scale}, ${scale})
      `,
    transition: '0.3s',
  }">
    <div :style="diceFaceStyle" class="face front"></div>
    <div :style="diceFaceStyle" class="face back"></div>
    <div :style="diceFaceStyle" class="face top"></div>
    <div :style="diceFaceStyle" class="face bottom"></div>
    <div :style="diceFaceStyle" class="face right"></div>
    <div :style="diceFaceStyle" class="face left"></div>
  </div>
</template>

<style lang="css" scoped>
.dice {
  transform-style: preserve-3d;
  position: relative;
  width: 100px;
  height: 100px;

  .face {
    transform-style: preserve-3d;
    position: absolute;
    display: block;
    width: 100px;
    height: 100px;
    border-radius: 5px;
    transition: 0.3s;

    &::after {
      content: "";
      position: absolute;
      top: 50%;
      left: 50%;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background: black;
      transition: 0.3s;
    }

    &.front {
      transform: translateZ(50px);

      &::after {
        width: 30px;
        height: 30px;
        background-color: black;
        margin: -15px 0 0 -15px;
      }
    }

    &.back {
      transform: rotateX(180deg) translateZ(50px);

      &::after {
        color: black;
        margin: -35px 0 0 -30px;
        box-shadow: 40px 0, 0 25px, 40px 25px, 0 50px, 40px 50px;
      }
    }

    &.top {
      transform: rotateX(90deg) translateZ(50px);

      &::after {
        color: black;
        margin: -30px 0 0 -30px;
        box-shadow: 40px 40px;
      }
    }

    &.bottom {
      transform: rotateX(-90deg) translateZ(50px);

      &::after {
        color: black;
        margin: -36px 0 0 -36px;
        box-shadow: 26px 26px, 52px 52px, 52px 0, 0 52px;
      }
    }

    &.right {
      transform: rotateY(90deg) translateZ(50px);

      &::after {
        color: black;
        margin: -30px 0 0 -30px;
        box-shadow: 40px 0, 0 40px, 40px 40px;
      }
    }

    &.left {
      transform: rotateY(-90deg) translateZ(50px);

      &::after {
        color: black;
        margin: -35px 0 0 -35px;
        box-shadow: 25px 25px, 50px 50px;
      }
    }
  }
}
</style>
