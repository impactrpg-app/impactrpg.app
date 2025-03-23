<script lang="ts" setup>
import { FloatLabel, InputText, Button, Dialog } from 'primevue'
import { ref } from 'vue';
import { login, makeRequest } from '../service/api';
import { useRouter } from 'vue-router';
import { LoginResponseDto } from '@impact/shared';

const router = useRouter();
const email = ref<string>('');
const password = ref<string>('');
const showErrorMessage = ref<string | null>(null);

async function register() {
    const data = await makeRequest<LoginResponseDto>('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email: email.value, password: password.value }),
    });

    login(data.accessToken);
    router.push('/tabletop');
}
</script>

<template>
  <Dialog modal :visible="showErrorMessage !== null" @update:visible="showErrorMessage = null">
    <p> {{ showErrorMessage }} </p>
  </Dialog>
  <div class="login">
    <h1>New Account</h1>
    <FloatLabel class="field">
      <InputText id="email" v-model="email" />
      <label for="email">Email</label>
    </FloatLabel>
    <FloatLabel class="field">
      <InputText id="password" v-model="password" />
      <label for="password">Password</label>
    </FloatLabel>
    <div class="buttons">
      <Button @click="register">Create an Account</Button>
      <Button variant="link" as="router-link" to="/login">Back to login</Button>
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