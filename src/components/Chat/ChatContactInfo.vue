<script setup lang="ts">

import { PencilIcon } from '@heroicons/vue/24/solid'
</script>

<template>
  <div class="flex flex-row items-center font-bold text-lg mb-1 group">
    <label class="w-[40%]" for="fullname">Full name:</label>
    <span class="text-left">Doan Du</span>
    <button class="ml-2 group-hover:block hidden"><PencilIcon class="size-6 text-info"/></button>
    <!--          <input type="text" id="fullname" value="Doan Du" class="input w-full" />-->
  </div>

  <div class="flex flex-row items-center font-bold text-lg mb-1">
    <label class="w-[40%]" for="email">Email:</label>
    <span class="text-left">a@example.com</span>
  </div>

  <div class="flex flex-row items-center font-bold text-lg mb-1">
    <label class="w-[40%]" for="phone">Phone:</label>
    <span class="text-left">01512498871</span>
  </div>

  <div class="flex flex-row items-center font-bold text-lg mb-1">
    <label class="w-[40%]" for="first-contact-on">First contact date:</label>
    <span class="text-left">2024-07-14</span>
  </div>

  <div class="flex flex-row items-center font-bold text-lg mb-1">
    <label class="w-[40%]" for="gender">Gender:</label>
    <select class="select select-sm">
      <option selected>Unknown</option>
      <option>Male</option>
      <option>Female</option>
      <option>Other</option>
    </select>
  </div>
</template>

<style scoped>

</style>