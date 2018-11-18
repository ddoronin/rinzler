<template>
    <a-tabs 
        :activeKey="collection"
        :key="db"
        tabPosition="left" 
        @change="choose"
        :style="{'min-height': '600px'}">
        <a-tab-pane 
            v-for="c of collections" 
            :key="c"
            :tab="c">
            <slot :name="db + collection"/>
        </a-tab-pane>
    </a-tabs>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { DBList } from '@/store/modules/databases';
import router from '@/router';

@Component({
    components: { }
})
export default class Collections extends Vue {
    @Prop() db!:string;
    @Prop() collection!: string;
    @Prop() collections!: any;
    choose(collection: string) {
        router.push({ path: `/${this.db}/${collection}` })
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
