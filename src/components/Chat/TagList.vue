<script setup lang="ts">
import { XMarkIcon, PlusCircleIcon } from '@heroicons/vue/24/solid'
</script>

<template>
  <span class="btn btn-outline btn-primary btn-sm mb-4">
    <PlusCircleIcon class="size-6 mr-2"/>Add label</span>
  <div class="flex flex-row gap-2 flex-wrap">
    <div class="badge badge-info gap-2">
      info
      <XMarkIcon class="size-4 cursor-pointer"/>
    </div>
    <div class="badge badge-success gap-2">
      success
      <XMarkIcon class="size-4"/>
    </div>
    <div class="badge badge-warning gap-2">
      warning
      <XMarkIcon class="size-4"/>
    </div>
    <div class="badge badge-error gap-2">
      error 2
      <XMarkIcon class="size-4"/>
    </div>

    <div class="badge badge-info gap-2">
      info
      <XMarkIcon class="size-4"/>
    </div>
    <div class="badge badge-success gap-2">
      very very long label
      <XMarkIcon class="size-4"/>
    </div>
    <div class="badge badge-warning gap-2">
      warning4
      <XMarkIcon class="size-4"/>
    </div>
    <div class="badge badge-error gap-2">
      error
      <XMarkIcon class="size-4"/>
    </div>
  </div>
</template>

<style scoped>

</style>