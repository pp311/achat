<script setup lang="ts">

import { PlusCircleIcon, XMarkIcon, PencilIcon } from '@heroicons/vue/24/solid'
</script>

<template>
  <span class="btn btn-outline btn-primary btn-sm mb-4">
    <PlusCircleIcon class="size-6 mr-2"/>Add note</span>

  <div class="w-full flex flex-col justify-between bg-base-300 rounded-lg mb-2 pt-5 px-4 border border-primary">
      <div class="flex items-center justify-start text-gray-800 gap-2">
        <p class="text-sm text-base-content">March 28, 2020</p>
        <button class="btn btn-xs btn-info rounded-full"><PencilIcon class="size-3"/></button>
        <XMarkIcon class="size-6 text-error cursor-pointer ml-auto"/>
      </div>
    <p class="text-sm text-base-content my-4">Our interior design experts work with you to create the space that you have been dreaming about.</p>
  </div>

  <div class="w-full flex flex-col justify-between bg-base-300 rounded-lg mb-2 pt-5 px-4 border border-primary">
    <div class="flex items-center justify-start text-gray-800 gap-2">
      <p class="text-sm text-base-content">March 28, 2020</p>
      <button class="btn btn-xs btn-info rounded-full"><PencilIcon class="size-3"/></button>
      <XMarkIcon class="size-6 text-error cursor-pointer ml-auto"/>
    </div>
    <p class="text-sm text-base-content my-4">Our interior design experts work with you to create the space that you have been dreaming about.</p>
  </div>

  <div class="w-full flex flex-col justify-between bg-base-300 rounded-lg mb-2 pt-5 px-4 border border-primary">
    <div class="flex items-center justify-start text-gray-800 gap-2">
      <p class="text-sm text-base-content">March 28, 2020</p>
      <button class="btn btn-xs btn-info rounded-full"><PencilIcon class="size-3"/></button>
      <XMarkIcon class="size-6 text-error cursor-pointer ml-auto"/>
    </div>
    <p class="text-sm text-base-content my-4">Our interior design experts work with you to create the space that you have been dreaming about.</p>
  </div>

  <div class="w-full flex flex-col justify-between bg-base-300 rounded-lg mb-2 pt-5 px-4 border border-primary">
    <div class="flex items-center justify-start text-gray-800 gap-2">
      <p class="text-sm text-base-content">March 28, 2020</p>
      <button class="btn btn-xs btn-info rounded-full"><PencilIcon class="size-3"/></button>
      <XMarkIcon class="size-6 text-error cursor-pointer ml-auto"/>
    </div>
    <p class="text-sm text-base-content my-4">Our interior design experts work with you to create the space that you have been dreaming about.</p>
  </div>
</template>

<style scoped>

</style>