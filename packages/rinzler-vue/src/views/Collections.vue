<template>
    <article class="collections" :key="db">
        <Cols 
            :key="db" 
            :db="db" 
            :collection="collection"
            :collections="getCollections(db)">
            <template :v-if="collection" :slot="db + collection">
                <Terminal :db="db" :collection="collection"/>
            </template>
        </Cols>
    </article>
</template>

<script lang="ts">
    import Vue from 'vue'
    import Component from 'vue-class-component';
    import { State, Action, Getter, namespace } from 'vuex-class';
    import Cols from '@/components/Collections.vue';
    import { IDBCol, DBCollectionsRequest, DBCollections } from '@/dto/DBCollections';
    import { Prop } from 'vue-property-decorator';
    import Terminal from './Terminal.vue'

    const collections = namespace('collections');

    @Component({
        components: { Cols, Terminal }
    })
    export default class Collections extends Vue {
        @Prop() db!: string;
        @Prop() collection!: string;
        @collections.Getter('collections') getCollections!: (db: string) => IDBCol[];
        @collections.Action('refresh') refresh!: (db: string) => void;
        mounted() {
            this.refresh(this.db);
        }
    }
</script>