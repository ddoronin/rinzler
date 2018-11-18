<template>
    <article class="terminal">
        <vue-json-pretty 
            :style="{fontSize: 'small'}"
            :data="getTop10({db, collection})"/>
    </article>
</template>

<script lang="ts">
    import Vue from 'vue'
    import Component from 'vue-class-component';
    import { State, Action, namespace } from 'vuex-class';
    import { Prop } from 'vue-property-decorator';
    import VueJsonPretty from 'vue-json-pretty'

    const collections = namespace('terminal');

    type top10Params = {db: string, collection: string};

    @Component({
        components: {VueJsonPretty}
    })
    export default class Terminal extends Vue {
        @Prop() db!: string;
        @Prop() collection!: string;
        @collections.Action('top10') top10!: (params: top10Params) => void;
        @collections.Getter('getTop10') getTop10!: (params: top10Params) => any[];

        mounted() {
            this.top10({db: this.db, collection: this.collection});
        }
    }
</script>

<style>
.terminal{
    text-align: left;
}
.vjs__tree{
    font-size: smaller;
}
</style>
