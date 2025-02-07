import { ref } from "vue";

export const isLoading = ref<boolean>(false);

export async function handleLoading(callback: () => Promise<void>) {
  isLoading.value = true;
  await callback();
  isLoading.value = false;
}