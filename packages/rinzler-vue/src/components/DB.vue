<template>
    <div class="db" :class="{empty: isEmpty}">
        <div class="name">{{ name }}</div>
        <div class="size">{{ size }}</div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

@Component
export default class DB extends Vue {
    @Prop(String) name!: string;
    @Prop(Number) size!: number;
    @Prop(Boolean) isEmpty!: boolean;
}
</script>

<style lang="postcss" scoped>
.db {
    border: 1px solid black;

    &.empty {
        color: cadetblue;
    }
}
</style>
