<script setup lang="ts">

import { ChevronLeftIcon, ChevronRightIcon, PlusCircleIcon, TrashIcon } from '@heroicons/vue/24/solid'
import { onMounted, ref, watch, watchEffect } from 'vue'
import { useMessageStore } from '@/stores/messageStore'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'
import MailDetail from '@/components/Chat/MailDetail.vue'
import moment from 'moment'
import MailCompose from '@/components/Chat/MailCompose.vue'
import { useSignalR } from '@dreamonkey/vue-signalr'
import {deleteGmailThread} from '@/services/message.service'
import { toast } from 'vue3-toastify'
import {convert} from 'html-to-text'

const store = useMessageStore()

const props = defineProps({
  changeComponent: {
    type: Function,
    required: true
  }
})

const isCheckAll = ref(false)
const selectedThreads = ref<string[]>([])

const signalR = useSignalR()

onMounted(() => {
  signalR.on('ReceiveMessage', async(message) => {
    const parsedMessage = JSON.parse(message)
    if (parsedMessage.contactId !== store.contactId) return

    await store.getGmailThreads(store.contactId);
  })
})

const {threadList} = storeToRefs(store)

const route = useRoute()
const contactId = parseInt(route.params.id as string)

watchEffect(async () => {
  await store.getGmailThreads(contactId);
})

const selectThread = async (threadId: string) => {
  store.messages = []
  await store.getThreadMessages(threadId)
  props.changeComponent(MailDetail)
}

watch([isCheckAll], () => {
  if (isCheckAll.value) {
    selectedThreads.value = threadList.value?.items.map(thread => thread.id) || []
  } else {
    selectedThreads.value = []
  }
})

const handleCheck = (threadId: string) => {
  if (!selectedThreads.value.includes(threadId)) {
    selectedThreads.value.push(threadId)
  } else {
    selectedThreads.value = selectedThreads.value.filter(id => id !== threadId)
  }
}

const handleDeleteThreads = async () => {
  if (selectedThreads.value.length === 0) {
    toast.error('Please select threads to delete')
    return
  }

  const loadingToast = toast.loading('Deleting threads')
  await deleteGmailThread(contactId, selectedThreads.value)
  selectedThreads.value = []
  await store.getGmailThreads(contactId)
  toast.remove(loadingToast)
  toast.success('Threads deleted successfully')
}

</script>

<template>

  <div class="flex items-center justify-start w-full px-4 mt-1" >
      <input type="checkbox" class="checkbox" v-model="isCheckAll" />

    <div class="divider-vertical mx-4 w-[1px] bg-neutral"></div>
    <div class="btn btn-sm btn-primary px-2 py-1 mr-4 flex items-center" @click="props.changeComponent(MailCompose)"><PlusCircleIcon class="size-4"/>Compose</div>
    <!--      <div class="divider-vertical mx-4 w-[1px] bg-neutral"></div>-->
    <div class="btn btn-sm btn-error p-2" @click="handleDeleteThreads"><TrashIcon class="size-4"/>Delete</div>
    <div class="ml-auto flex items-center gap-4">
      <div class="rounded-full p-0 size-6 hover:bg-base-200 flex justify-center items-center"
           :class="[threadList?.hasPreviousPage === true ? '' : 'btn-disabled cursor-not-allowed']"><ChevronLeftIcon class="size-4"/></div>
      <div class="rounded-full p-0 size-6 hover:bg-base-200 flex justify-center items-center"
           :class="[threadList?.hasNextPage === true ? '' : 'btn-disabled cursor-not-allowed']"><ChevronRightIcon class="size-4"/></div>
      <div>Show <span class="font-bold">{{((threadList?.pageNumber || 1) - 1) * store.threadPageSize + 1}} - {{((threadList?.pageNumber || 1) - 1) * store.threadPageSize + (threadList?.items.length || 0)}}</span> of <span class="font-bold">{{threadList?.totalCount}}</span></div>
    </div>
  </div>

  <div class="divider m-1 mt-0"></div>

  <div class="overflow-auto">
    <table class="table table-fixed">
      <col class="w-[5%]"/>
      <col class="w-[83%]"/>
      <col class="w-[12%]"/>
      <tbody>
      <tr class="cursor-pointer hover" v-for="thread in threadList?.items"
          @click="selectThread(thread.id)" :key="thread.id">
        <th>
          <label>
            <input type="checkbox" class="checkbox" :checked="selectedThreads.includes(thread.id)" @click.stop @change.stop="handleCheck(thread.id)"/>
          </label>
        </th>
        <td class="truncate">
          <span class="flex gap-2">
            <span class="font-bold">{{thread.subject}}</span>
            <span>-</span>
          <span :class="[thread.isRead === true ? '' : 'font-bold']" >{{convert(thread.snippet)}}</span>
          </span>
        </td>
        <td class="text-right">
          {{new Date(moment.utc(thread.createdOn).toLocaleString()).toLocaleString('vi-VN').split(' ')[1] }}
        </td>
      </tr>

      <!--      Loading-->
      <!--      <template v-if="isLoading" >-->
      <!--        <tr v-for="i in 3" :key="i">-->
      <!--          <td v-for="j in 5" :key="j">-->
      <!--            <div class="skeleton h-10 w-full"></div>-->
      <!--          </td>-->
      <!--        </tr>-->
      <!--      </template>-->
      </tbody>
    </table>
  </div>
</template>

<style scoped>

</style>