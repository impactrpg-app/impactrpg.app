import { ref, computed } from "vue";

export const currentTasks = ref(new Set<Task>());
export const isRunningTask = computed(() => currentTasks.value.size > 0);

export type Task = () => Promise<void>;
export function runTask(task: Task) {
  currentTasks.value.add(task);
  task().finally(() => currentTasks.value.delete(task));
}
