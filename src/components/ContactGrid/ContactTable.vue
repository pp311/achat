<script setup lang="ts">
import { onMounted, ref, watch, watchEffect } from 'vue'
import type { ContactFilter, ContactInfo } from '@/types/contact'
import { useContactListStore } from '@/stores/contactListStore'
import { ContactSortBy, SourceType } from '@/types/enum'
import { UserCircleIcon } from '@heroicons/vue/24/solid'
import moment from 'moment'
import Pagination from '@/components/Pagination.vue'
import { storeToRefs } from 'pinia'
import { useSignalR } from '@dreamonkey/vue-signalr'

const isLoading = ref(false)

const contactItems = ref<ContactInfo[]>([])

const store = useContactListStore()
const {pagingInfo, contactFilter, selectedContacts} = storeToRefs(store)

const signalR = useSignalR()
onMounted(() => {
  signalR.on('ReceiveMessage', async(message) => {
    contactItems.value = await store.getContactList()
  })
})

const isCheckAll = ref(false)

watch([isCheckAll], () => {
  if (isCheckAll.value) {
    selectedContacts.value = contactItems.value?.map(c => c.id) || []
  } else {
    selectedContacts.value = []
  }
})

const handleCheck = (contactId: number) => {
  if (!selectedContacts.value.includes(contactId)) {
    selectedContacts.value.push(contactId)
  } else {
    selectedContacts.value = selectedContacts.value.filter(id => id !== contactId)
  }
}

watch([pagingInfo, contactFilter],async () => {
  isLoading.value = true
  contactItems.value = []
  contactItems.value = await store.getContactList()
  isLoading.value = false
}, {immediate: true, deep: true})

</script>

<template>
  <div class="overflow-x-auto">
    <table class="table table-zebra">
      <col class="w-[5%]"/>
      <col class="w-[30%]"/>
      <col class="w-[30%]"/>
      <col class="w-[20%]"/>
      <col class="w-[15%]"/>
      <thead>
      <tr>
        <th>
          <label>
            <input type="checkbox" class="checkbox" v-model="isCheckAll" />
          </label>
        </th>
        <th class="font-bold text-lg">Name/Email</th>
        <th class="font-bold text-lg">Source</th>
        <th class="font-bold text-lg">Added Date</th>
        <th></th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="contact in contactItems" :key="contact.id">
        <th>
          <label>
            <input type="checkbox" class="checkbox" :checked="selectedContacts.includes(contact.id)" @click.stop @change.stop="handleCheck(contact.id)"/>
          </label>
        </th>
        <td>
          <div class="flex items-center gap-3">
            <div class="avatar">
              <div class="mask mask-circle size-12">
                <img v-if="contact.avatarUrl" :src="contact.avatarUrl" alt="" />
                <UserCircleIcon v-else class="size-12" />
              </div>
            </div>
            <div class="flex items-start flex-col justify-center">
              <div class="font-bold text-lg">{{contact.name}}</div>
              <div v-if="contact.email && contact.email !== contact.name" class="text-sm">{{contact.email}}</div>
            </div>
          </div>
        </td>
        <td>
          <div class="flex w-full items-center gap-4 font-bold">
            <img v-if="contact.sourceType == SourceType.FACEBOOK" class="size-8" src="../../assets/facebook.svg">
            <img v-if="contact.sourceType == SourceType.GOOGLE" class="size-8" src="../../assets/gmail.svg">
            {{contact.sourceType == SourceType.FACEBOOK ? contact.sourceName : contact.sourceEmail}}
          </div>
        </td>
        <td class="text-gray-500">
          {{new Date(moment.utc(contact.createdOn).toLocaleString()).toLocaleString('vi-VN').split(' ')[1] }}
        </td>
        <th>
          <RouterLink :to="'/chat/' + contact.id">
            <button class="btn btn-ghost btn-xs">Chat now</button>
          </RouterLink>
        </th>
      </tr>

<!--      Loading-->
      <template v-if="isLoading" >
        <tr v-for="i in 3" :key="i">
          <td v-for="j in 5" :key="j">
            <div class="skeleton h-10 w-full"></div>
          </td>
        </tr>
      </template>
      </tbody>
    </table>
    </div>

  <div class="flex-grow place-content-end mb-4">
    <Pagination
      v-show="!isLoading"
      :pageNumber="pagingInfo.pageNumber"
      :totalPages="pagingInfo.totalPages"
      :totalCount="pagingInfo.totalCount"
      :hasPreviousPage="pagingInfo.hasPreviousPage"
      :hasNextPage="pagingInfo.hasNextPage"
      :handlePageChange="(pageNumber: number) => pagingInfo.pageNumber = pageNumber"
    />
  </div>
</template>


<style scoped>

</style>
