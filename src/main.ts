import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { PrimeVue } from "@primevue/core";
import Material from "@primevue/themes/material";
import "primeicons/primeicons.css";
import {
  ConfirmationService,
  DialogService,
  ToastService,
  Tooltip,
} from "primevue";

const app = createApp(App);

app.use(router);
app.use(PrimeVue, {
  theme: {
    preset: Material,
    options: {
      prefix: "p",
    },
  },
});
app.directive("tooltip", Tooltip);
app.use(ConfirmationService);
app.use(ToastService);
app.use(DialogService);
app.mount("#app");
