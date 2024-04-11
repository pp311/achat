<script setup lang="ts">
import { MagnifyingGlassIcon } from '@heroicons/vue/24/solid'
</script>

<template>
  <form class="w-full">
    <div class="flex">
      <label class="input input-bordered w-full flex items-center gap-2 rounded-r-none">
        <input type="text" class="grow" placeholder="Search" />
      </label>
      <div class="btn btn-primary w-12 rounded-l-none"><MagnifyingGlassIcon class="size-12"/> </div>
    </div>
  </form>


</template>

<style scoped>

</style>