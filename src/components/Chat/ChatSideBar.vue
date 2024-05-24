<script setup lang="ts">
import Search from '@/components/Search.vue'
import ChatItem from '@/components/Chat/ChatItem.vue'
import { useMessageStore } from '@/stores/messageStore'
import { storeToRefs } from 'pinia'
import { onMounted, ref, watch } from 'vue'
import { useSignalR } from '@dreamonkey/vue-signalr'
import { MagnifyingGlassIcon } from '@heroicons/vue/24/solid'
import debounce from 'lodash.debounce'

const store = useMessageStore()
const {contactList} = storeToRefs(store)
const signalR = useSignalR()

onMounted(() => {
  signalR.on('ReceiveMessage', async(message) => {
    await store.getContactList()
  })
})

const searchTerm = ref("")

watch([searchTerm], debounce(async() => {
  store.contactFilter.search = searchTerm.value
  await store.getContactList()
}, 500))

</script>

<template>
  <div class="w-[17%] px-4 overflow-auto bg-base-200">

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
<!--        <Search/>-->
        <label class="input input-bordered flex items-center gap-2">
          <MagnifyingGlassIcon class="size-6"/>
          <input type="text" class="grow"
                 v-model="searchTerm"
                 placeholder="Search..." />
        </label>
      </div>
    </div>

      <div v-for="contact in contactList" :key="contact.id">
        <ChatItem :contact="contact"/>
      </div>
  </div>
</template>

<style scoped>

</style>