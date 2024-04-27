<script setup lang="ts">
import { PlusCircleIcon, CheckCircleIcon } from '@heroicons/vue/24/solid'
</script>

<template>
  <div class="w-full flex justify-center">
    <form class="w-[50%]">
      <div v-for="i in 3" class="mb-8" :key="i">
        <div class="text-xl font-bold mb-2">Field #{{i}}</div>
        <div class=" flex flex-row justify-start items-center gap-4">
          <input type="text" placeholder="Field name" class="input input-bordered w-full max-w-xs" required/>
          <select class="select select-bordered w-full max-w-xs" required>
            <option selected>Text</option>
            <option>Number</option>
            <option>Datetime</option>
          </select>
        </div>
      </div>
    </form>
  </div>

  <div class="flex flex-row w-full justify-center gap-6">
    <button class="btn btn-primary mt-6"><PlusCircleIcon class="size-6"/>Add more</button>
    <button class="btn btn-primary mt-6"><CheckCircleIcon class="size-6"/>Save</button>
  </div>

</template>

<style scoped>

</style>