<script setup lang="ts">
import { MagnifyingGlassIcon } from '@heroicons/vue/24/solid'
import { ref, defineProps } from 'vue'

const props = defineProps<{
  handleSearch: (searchValue: string) => void
}>()
const searchValue = ref<string>("")

const handleOnSearch = () => {
  props.handleSearch(searchValue.value)
}


</script>

<template>
  <form class="w-full">
    <div class="flex">
      <label class="input input-bordered w-full flex items-center gap-2 rounded-r-none">
        <input v-model="searchValue" type="text" class="grow" placeholder="Search" />
      </label>
      <div class="btn btn-primary w-12 rounded-l-none"
           @click="handleOnSearch"><MagnifyingGlassIcon class="size-12"/> </div>
    </div>
  </form>


</template>

<style scoped>

</style>