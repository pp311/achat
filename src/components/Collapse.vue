<script setup lang="ts">
import { ChevronDownIcon } from '@heroicons/vue/24/solid'
defineProps(['title'])
</script>

<template>
  <div class="collapse bg-base-200 rounded-none">
    <input type="checkbox" checked/>
    <div class="collapse-title flex flex-row justify-between items-center">
      <span class="text-xl font-bold flex items-center"><slot name="title"/></span>
      <ChevronDownIcon class="size-6"/>
    </div>
    <div class="collapse-content">
      <slot />
    </div>
  </div>

  <div class="divider my-0 bg-base-200"></div>
</template>

<style scoped>

</style>