<script setup lang="ts">
import { Button, ContextMenu } from 'primevue';
import { computed, ref, useTemplateRef, onMounted, onUnmounted } from 'vue';
import { loadFromFile } from '../service/io';
import * as TabletopService from '../service/tabletop';

const menu = ref();
const updateInterval = ref<NodeJS.Timeout | null>(null);
const canvas = useTemplateRef<HTMLCanvasElement>('canvas');
const context = computed(() => canvas.value?.getContext('2d'));

async function uploadImage() {
    const image = await loadFromFile('image/*');
    if (!image) return;
    if (!context.value) return;
    const imageElement = new Image();
    imageElement.src = `data:image/png;base64,${btoa(image ?? '')}`;
    imageElement.crossOrigin = 'Anonymous';
    TabletopService.addObjectToScene(imageElement);
}

onMounted(() => {
    TabletopService.init(canvas.value);
    TabletopService.onResize(new UIEvent('resize'));
    window.addEventListener('resize', TabletopService.onResize);
    window.addEventListener('mousemove', TabletopService.onMousemove);
    window.addEventListener('mouseup', TabletopService.onMouseUp);
    window.addEventListener('mousedown', TabletopService.onMouseDown);
    window.addEventListener('wheel', TabletopService.onScroll);
    updateInterval.value = setInterval(() => {
        if (!canvas.value || !context.value) return;
        TabletopService.onUpdate(canvas.value, context.value);
    }, 10);
});

onUnmounted(() => {
    if (updateInterval.value)
        clearInterval(updateInterval.value);
    window.removeEventListener('resize', TabletopService.onResize);
    window.removeEventListener('mousemove', TabletopService.onMousemove);
    window.removeEventListener('mouseup', TabletopService.onMouseUp);
    window.removeEventListener('mousedown', TabletopService.onMouseDown);
    window.removeEventListener('wheel', TabletopService.onScroll);
});

function handleContextMenu(event: MouseEvent) {
    event.preventDefault();
    if (TabletopService.selectedObject.value === -1) return;
    menu.value?.show(event);
}
</script>

<template>
    <div class="tabletop">
        <ContextMenu ref="menu" :model="TabletopService.contextMenuItems.value" />
        <canvas class="tabletop-canvas" ref="canvas" @contextmenu="handleContextMenu" />
        <div class="tools">
            <Button
                variant="outlined"
                class="upload-button"
                icon="pi pi-upload"
                v-tooltip.top="'Upload Image'"
                @click="uploadImage"
            />
            <template v-for="tool in TabletopService.ALL_TOOLS">
                <Button
                    :variant="TabletopService.tool.value.name !== tool.name ? 'outlined' : undefined"
                    class="generate-button"
                    :icon="tool.icon"
                    v-tooltip.top="tool.name"
                    @click="TabletopService.tool.value = tool"
                />
            </template>
        </div>
    </div>
</template>

<style scoped lang="css">
.tabletop-canvas {
    display: block;
    position: relative;
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
    background-color: rgba(0, 0, 0, 0.7);
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