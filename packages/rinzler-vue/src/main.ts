import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import { store } from "./store";

import Antd from 'ant-design-vue';
import './main.less'

Vue.config.productionTip = false

Vue.use(Antd as any);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
