<script lang="ts" setup>
import { MenuItem } from 'primevue/menuitem';
import CustomMenuBar from '../components/CustomMenuBar.vue';
import { onMounted, onUnmounted, ref } from 'vue';
import { supabaseClient } from '../service/supabase';
import { REALTIME_SUBSCRIBE_STATES } from '@supabase/supabase-js';
import { useRoute } from 'vue-router';

const channelId = ref<string | null>(null);
const route = useRoute();
const menuItems: MenuItem[] = [
  {
    label: `Copy room link`,
    icon: 'pi pi-globe',
    command: () => {
      navigator.clipboard.writeText(`${window.location.host}/room/${channelId.value}`);
    }
  }
];

function messageEvents(status: REALTIME_SUBSCRIBE_STATES, err?: Error) {
  console.log(status);
}
onMounted(async () => {
  const roomId = String(route.params['roomId']);
  if (!roomId) {
    throw new Error('could not find room');
  }
  channelId.value = roomId;
  await supabaseClient.channel(channelId.value).subscribe(messageEvents);
  await supabaseClient.channel(channelId.value).send({
    type: 'broadcast',
    event: 'JOIN'
  });
  console.log('connected');
});
onUnmounted(async () => {
  await supabaseClient.channel(channelId.value!).unsubscribe();
});
</script>

<template>
  <div class="room">
    <CustomMenuBar :items="menuItems" back-url="/" />
  </div>
</template>

<style lang="css" scoped>
.room {
  display: flex;
  flex-direction: column;
  max-width: 800px;
  gap: 20px;
  flex-grow: 1;
}
</style>