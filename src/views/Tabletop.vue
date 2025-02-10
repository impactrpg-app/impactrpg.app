<script setup lang="ts">
import { InputText, Button } from 'primevue';
import { computed, ref, useTemplateRef, onMounted, onUnmounted } from 'vue';
import { loadFromFile } from '../service/io';
import { onUpdate, tabletopObjects, onKeyDown, onKeyUp, onMouseDown, onMousemove, onMouseUp } from '../service/tabletop';

const generator = ref('');
const updateInterval = ref<NodeJS.Timeout | null>(null);
const canvas = useTemplateRef<HTMLCanvasElement>('canvas');
const context = computed(() => canvas.value?.getContext('2d'));

async function uploadImage() {
    const image = await loadFromFile('image/*');
    if (!context.value) return;
    const imageElement = new Image();
    imageElement.src = `data:image/png;base64,${btoa(image ?? '')}`;
    imageElement.crossOrigin = 'Anonymous';
    tabletopObjects.value.push({
        image: imageElement,
        position: [0, 0],
        rotation: 0,
        scale: 1,
    });
}

onMounted(() => {
    onresize();
    window.addEventListener('resize', onresize);
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('mousemove', onMousemove);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('mousedown', onMouseDown);
    updateInterval.value = setInterval(() => {
        if (!canvas.value || !context.value) return;
        onUpdate(canvas.value, context.value);
    }, 100);
});

onUnmounted(() => {
    if (updateInterval.value)
        clearInterval(updateInterval.value);
    window.removeEventListener('resize', onresize);
    window.removeEventListener('keydown', onKeyDown);
    window.removeEventListener('keyup', onKeyUp);
    window.removeEventListener('mousemove', onMousemove);
    window.removeEventListener('mouseup', onMouseUp);
    window.removeEventListener('mousedown', onMouseDown);
});

function onresize() {
    if (!canvas.value) return;
    canvas.value.width = canvas.value.clientWidth;
    canvas.value.height = canvas.value.clientHeight;
}
</script>

<template>
    <div class="tabletop">
        <canvas class="tabletop-canvas" ref="canvas" />
        <div class="tools">
            <Button
                class="upload-button"
                v-tooltip.top="'Upload Image'"
                icon="pi pi-upload"
                @click="uploadImage"
            />
            <InputText
                class="search-input"
                v-model="generator"
                placeholder="Generate image using Ai..."
            />
        </div>
    </div>
</template>

<style scoped lang="css">
.tabletop-canvas {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}
.tools {
    position: absolute;
    bottom: 10px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
    z-index: 10;
    padding: 10px 15px;
    background-color: rgba(0, 0, 0, 0.4);
    border-radius: 50px;

    .upload-button, .generate-button {
        border-radius: 50%;
    }

    .search-input {
        border-radius: 20px;
        min-width: 400px;
    }
}
</style>