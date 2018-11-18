<template>
    <a-tabs 
        :activeKey="active"
        @change="select">
        <a-tab-pane 
            v-for="db in list"
            :key="db.name"
            :tab="db.name">
            <slot :name="db.name"/>
        </a-tab-pane>
    </a-tabs>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { IDB } from '@/dto/DataBaseList';
import DB from './DB.vue';
import router from '@/router';

@Component({
    components: { DB }
})
export default class DBList extends Vue {
    @Prop() list!: IDB[];
    @Prop() active!: string;

    select(db: string) {
        router.push({ path: `/${db}` })
    }
}
</script>

<style lang="postcss" scoped>
.db-list {
    
}
.db-name {
    margin-bottom: -8px;
    width: 64px;
    height: 42px;
    border-radius: 4px;
    /* background: #eee; */
    line-height: 42px;
    display: flex;
}

.text {
    
}
</style>
