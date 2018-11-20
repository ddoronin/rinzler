import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import { store } from "./store";

Vue.config.productionTip = false

import Ant from 'ant-design-vue';

Vue.use(Ant as any);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
