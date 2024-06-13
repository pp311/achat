<script setup lang="ts">

import ChatSideBar from '@/components/Chat/ChatSideBar.vue'
import ChatBox from '@/components/Chat/ChatBox.vue'
import ChatInfo from '@/components/Chat/ChatInfo.vue'
import { useRoute } from 'vue-router'
import ChatBoxHeader from '@/components/Chat/ChatBoxHeader.vue'
import MailBox from '@/components/Chat/MailBox.vue'
import { useMessageStore } from '@/stores/messageStore'
import { watch, watchEffect } from 'vue'
import { SourceType } from '@/types/enum'

const route = useRoute()
const store = useMessageStore()


watch(() => route.params.id,async () => {
  const contactId = Number(route.params.id)
  await store.getContact(contactId)
  await store.getContactList()
}, { immediate: true })

</script>

<template>
  <div class="w-full flex flex-row h-[calc(100vh-49px)] overflow-hidden overscroll-contain">
    <ChatSideBar/>

    <ChatBox v-if="store.contactInfo?.sourceType == SourceType.FACEBOOK">
      <ChatBoxHeader/>
    </ChatBox>

    <MailBox v-else-if="store.contactInfo?.sourceType == SourceType.GOOGLE">
      <ChatBoxHeader/>
    </MailBox>

    <div v-else  class="w-[58%] bg-base-300 flex justify-center items-center flex-col px-4">

      <div class="loading loading-lg"></div>

    </div>

    <ChatInfo/>

  </div>
</template>

<style scoped>

</style>