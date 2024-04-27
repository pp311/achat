<script setup lang="ts">
import { defineProps } from 'vue'
import type { PagingModel } from '@/types/base'

const props = defineProps<PagingModel & {
  handlePageChange: (pageNumber: number) => void
}>()

</script>

<template>
  <div class="flex justify-center w-full mt-4">
  <div class="join">
    <button class="join-item btn"
            @click="props.handlePageChange(1)"
            :disabled="!props.hasPreviousPage">&lt;&lt;</button>

    <button class="join-item btn"
            @click="props.handlePageChange(props.pageNumber - 1)"
            :disabled="!props.hasPreviousPage">&lt;</button>
    <button class="join-item btn"
            @click="props.handlePageChange(props.pageNumber - 2)"
            :class="{hidden: props.pageNumber < 3}">{{props.pageNumber - 2}}</button>

    <button class="join-item btn"
            @click="props.handlePageChange(props.pageNumber - 1)"
            :class="{hidden: props.pageNumber < 2}">{{props.pageNumber - 1}}</button>

    <button class="join-item btn btn-active">{{props.pageNumber}}</button>

    <button class="join-item btn"
            @click="props.handlePageChange(props.pageNumber + 1)"
            :class="{hidden: props.pageNumber >= props.totalPages}">{{props.pageNumber + 1}}</button>

    <button class="join-item btn"
            @click="props.handlePageChange(props.pageNumber + 2)"
            :class="{hidden: props.pageNumber >= props.totalPages - 1}">{{props.pageNumber + 2}}</button>

    <button class="join-item btn"
            @click="props.handlePageChange(props.pageNumber + 1)"
            :disabled="!props.hasNextPage">&gt;</button>

    <button class="join-item btn"
            @click="props.handlePageChange(props.totalPages)"
            :disabled="!props.hasNextPage">&gt;&gt;</button>
  </div>
  </div>
</template>

<style scoped>

</style>