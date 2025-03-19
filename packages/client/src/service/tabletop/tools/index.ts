import { ref } from "vue";
import { TabletopTool } from "./base";
import { MoveTool } from "./move";

export const ALL_TOOLS = [
    new MoveTool(), 
];
export const tool = ref<TabletopTool>(ALL_TOOLS[0]);