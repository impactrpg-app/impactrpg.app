<script lang="ts" setup>
import * as PackageJson from '../../package.json';
import { FloatLabel, InputText, Button, Dialog } from 'primevue'
import { ref } from 'vue';
import { supabaseClient } from '../service/supabase';

const email = ref<string>('');
const showSignInDialog = ref<boolean>(false);

async function signIn() {
  localStorage.setItem('login:email', email.value);

  await supabaseClient.auth.signInWithOtp({
    email: email.value,
    options: {
      emailRedirectTo: `${window.location.origin}`
    }
  });
  showSignInDialog.value = true;
}
</script>

<template>
  <Dialog modal v-model:visible="showSignInDialog">
    <p>
      Please check your email for a link. You can close this page.
    </p>
  </Dialog>
  <div class="login">
    <h1>impact</h1>
    <div class="version">{{ PackageJson.version }}</div>
    <p>A Free Tabletop Role Playing game.</p>
    <FloatLabel class="field">
      <InputText id="email" v-model="email" />
      <label for="email">Email</label>
    </FloatLabel>
    <div class="buttons">
    <Button @click="signIn">Continue</Button>
    </div>
  </div>
</template>

<style lang="css" scoped>
.login {
  display: flex;
  flex-direction: column;
  text-align: center;
  gap: 10px;

  .version {
    display: block;
    position: relative;
    height: 0;
    top: -40px;
    left: 125px;
    color: var(--p-lime-200);
  }

  .buttons {
    display: flex;
    flex-direction: row;
    gap: 10px;
    margin-top: 10px;
  }
}
</style>