import { ref } from "vue";
import { TabletopTool } from "./base";
import { MoveTool } from "./move";
import { DrawTool } from "./draw";
export const ALL_TOOLS = [
    new MoveTool(),
    new DrawTool() 
];
export const tool = ref<TabletopTool>(ALL_TOOLS[0]);