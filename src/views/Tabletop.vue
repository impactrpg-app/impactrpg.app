<script setup lang="ts">
import TabletopComponent from '../components/TabletopComponent.vue';
</script>

<template>
    <div class="tabletop">
        <iframe src="/" />
        <TabletopComponent />
    </div>
</template>

<style scoped lang="css">
.tabletop {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    height: 100vh;
    width: 100vw;
    overflow: hidden;

    iframe {
        min-width: 700px;
        min-height: 100%;
        border: none;
    }
}

</style>