<template>
    <DBList :list="dblist" :active="db">
        <template :v-if="db" :slot="db">
            <Collections :db="db" :collection="collection"/>
        </template>
    </DBList>
</template>

<script lang="ts">
    import Vue from 'vue';
    import Component from 'vue-class-component';
    import { State, Action, namespace } from 'vuex-class';
    import { Prop } from 'vue-property-decorator';
    import { IDB } from '@/dto/DataBaseList';
    import DBList from '@/components/DBList.vue';
    import Collections from './Collections.vue';

    const databases = namespace('databases');

    @Component({
        components: {DBList, Collections}
    })
    export default class Dashboard extends Vue {
        @Prop() db!: string;
        @Prop() collection!: string;
        @databases.State('list') dblist!: IDB[];
        @databases.Action('refresh') refresh!: () => void;

        mounted() {
            this.refresh();
        }
    }
</script>

<style lang="scss">
    .dashboard {
        .db-list {
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            margin: 0;
            padding: 0;
            list-style: none;
            text-align: left;

            .db-item {
                width: 100px;
                height: 50px;

                .size {
                    font-size: x-small;
                }
            }
        }
    }
</style>
