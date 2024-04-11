<script setup lang="ts">
import { TrashIcon, TagIcon, UserIcon, ChevronDownIcon } from '@heroicons/vue/24/solid'
import Search from '@/components/Search.vue'

</script>

<template>
<div class="flex items-center gap-2">
  <Search/>
    <div class="btn btn-primary"><TagIcon class="size-6"/>Tag<ChevronDownIcon class="size-6"/></div>
    <div class="btn btn-primary"><UserIcon class="size-6"/>New contact</div>
    <div class="btn btn-error"> <TrashIcon class="h-6 w-6" /></div>
  </div>
</template>

<style scoped>

</style>