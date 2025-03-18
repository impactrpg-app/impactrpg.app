import { ref } from "vue";
import { TabletopTool } from "./base";

export const ALL_TOOLS = [
    new TabletopTool(),
];
export const tool = ref<TabletopTool>(ALL_TOOLS[0]);