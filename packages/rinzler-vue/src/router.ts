import Vue from "vue";
import Router from "vue-router";
import Dashboard from "@/views/Dashboard.vue"

Vue.use(Router);

export default new Router({
  routes: [{
    path: "/:db?/:collection?",
    name: "dashboard",
    component: Dashboard,
    props: (route) => {
      return ({ db: route.params.db, collection: route.params.collection });
    }
  }]
});
