<script lang="ts" setup>
import { FloatLabel, InputText, Button, Dialog, Password } from "primevue";
import { ref } from "vue";
import { login, makeRequest } from "../service/api";
import { useRouter } from "vue-router";
import { LoginResponseDto } from "@impact/shared";

const router = useRouter();
const displayName = ref<string>("");
const email = ref<string>("");
const password = ref<string>("");
const password2 = ref<string>("");
const showErrorMessage = ref<string | null>(null);

async function register() {
  if (password.value !== password2.value) {
    showErrorMessage.value = "Passwords do not match";
    return;
  }
  const data = await makeRequest<LoginResponseDto>("/auth/register", {
    method: "POST",
    body: JSON.stringify({
      email: email.value,
      password: password.value,
      displayName: displayName.value,
    }),
  });

  login(data.accessToken);
  router.push("/tabletop");
}
</script>

<template>
  <Dialog
    modal
    :visible="showErrorMessage !== null"
    @update:visible="showErrorMessage = null"
  >
    <p>{{ showErrorMessage }}</p>
  </Dialog>
  <div class="login">
    <h1>New Account</h1>
    <FloatLabel class="field">
      <InputText id="displayName" v-model="displayName" />
      <label for="displayName">Display Name</label>
    </FloatLabel>
    <FloatLabel class="field">
      <InputText id="email" v-model="email" />
      <label for="email">Email</label>
    </FloatLabel>
    <FloatLabel class="field">
      <Password toggle-mask id="password" v-model="password" />
      <label for="password">Password</label>
    </FloatLabel>
    <FloatLabel class="field">
      <Password toggle-mask id="password2" v-model="password2" />
      <label for="password2">Re-Password</label>
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
