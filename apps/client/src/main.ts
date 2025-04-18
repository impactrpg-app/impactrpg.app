import App from "./App.vue";
import router from "./router";
import Material from "@primeuix/themes/material";
import "primeicons/primeicons.css";
import { createApp } from "vue";
import { PrimeVue } from "@primevue/core";
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
      darkModeSelector: ".my-app-dark",
    },
  },
});
app.directive("tooltip", Tooltip);
app.use(ConfirmationService);
app.use(ToastService);
app.use(DialogService);
app.mount("#app");
