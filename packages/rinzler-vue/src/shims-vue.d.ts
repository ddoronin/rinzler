declare module "*.vue" {
  import Vue from "vue";
  export default Vue;
}

declare module "ant-design-vue" {
  import Vue, { PluginObject } from "vue";
  class Ant implements PluginObject<{}>{
    install(): void;
  }
  export default Ant;
} 

declare module "vue-json-pretty" {
  import Vue, { Component } from "vue";
  export default class VJP extends Vue {
  }
} 
