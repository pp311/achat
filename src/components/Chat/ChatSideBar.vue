<script setup lang="ts">
import { TrashIcon, TagIcon, UserIcon, ChevronDownIcon } from '@heroicons/vue/24/solid'

import Search from '@/components/Search.vue'
import ChatItem from '@/components/Chat/ChatItem.vue'
</script>

<template>
  <div class="w-[20%] px-4 overflow-auto bg-base-200">

    <div class="sticky top-0 z-10 pt-6 bg-base-200">
      <div class="text-xl font-bold">Tất cả (69)</div>

      <div class="flex flex-row items-center justify-end mb-2">
        <select class="select max-w-xs">
          <option selected>Homer</option>
          <option>Marge</option>
          <option>Bart</option>
          <option>Lisa</option>
          <option>Maggie</option>
        </select>
      </div>

      <div>
        <Search/>
      </div>
    </div>

      <div v-for="i in 10" :key="i">
        <ChatItem />
      </div>
  </div>
</template>

<style scoped>

</style>