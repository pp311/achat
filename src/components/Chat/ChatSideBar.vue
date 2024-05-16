<script setup lang="ts">
import { TrashIcon, TagIcon, UserIcon, ChevronDownIcon } from '@heroicons/vue/24/solid'

import Search from '@/components/Search.vue'
import ChatItem from '@/components/Chat/ChatItem.vue'
import { useMessageStore } from '@/stores/messageStore'
import { storeToRefs } from 'pinia'
import type { ContactInfo } from '@/types/contact'
const store = useMessageStore()

const {contactList} = storeToRefs(store)
</script>

<template>
  <div class="w-[20%] px-4 overflow-auto bg-base-200">

    <div class="sticky top-0 z-10 mb-4 pt-6 bg-base-200">
      <div class="text-xl font-bold mb-4">Contacts ({{store.pagingInfo.totalCount}})</div>

<!--      <div class="flex flex-row items-center justify-end mb-2">-->
<!--        <select class="select max-w-xs">-->
<!--          <option selected>Homer</option>-->
<!--          <option>Marge</option>-->
<!--          <option>Bart</option>-->
<!--          <option>Lisa</option>-->
<!--          <option>Maggie</option>-->
<!--        </select>-->
<!--      </div>-->

      <div>
        <Search/>
      </div>
    </div>

      <div v-for="contact in contactList" :key="contact.id">
        <ChatItem :contact="contact"/>
      </div>
  </div>
</template>

<style scoped>

</style>