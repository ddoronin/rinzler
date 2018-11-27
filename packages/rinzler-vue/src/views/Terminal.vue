<template>
    <article class="terminal">
        <a-table 
            :columns="getColumns()" 
            :data-source="getData()"/>
    </article>
</template>

<script lang="ts">
    import Vue from 'vue'
    import Component from 'vue-class-component';
    import { State, Action, namespace } from 'vuex-class';
    import { Prop } from 'vue-property-decorator';

    const collections = namespace('terminal');

    type top100Params = {db: string, collection: string};

    @Component({
        components: {
        }
    })
    export default class Terminal extends Vue {
        @Prop() db!: string;
        @Prop() collection!: string;
        @collections.Action('top100') top100!: (params: top100Params) => void;
        @collections.Getter('getTop100') getTop100!: (params: top100Params) => any[];

        getColumns() {
            const data = this.getData()
            if (!data || data.length === 0) return [];
            const [head] = data;
            return Object.keys(head).map(dataIndex => ({
                title: dataIndex, 
                dataIndex
            }));
        }

        getData() {
            return this.getTop100({db: this.db, collection: this.collection});
        }

        mounted() {
            this.top100({db: this.db, collection: this.collection});
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
