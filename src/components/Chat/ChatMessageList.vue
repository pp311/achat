<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, type PropType, ref, watch, watchEffect } from 'vue'
import { useScroll } from '@vueuse/core'
import { useSignalR } from '@dreamonkey/vue-signalr'
import { useMessageStore } from '@/stores/messageStore'
import { storeToRefs } from 'pinia'
import { ChevronDoubleDownIcon } from '@heroicons/vue/24/solid'
import moment from 'moment'
import { useRoute } from 'vue-router'

const chatbox = ref<HTMLDivElement | null>(null);
const { y, directions } = useScroll(chatbox)
const { y: ySmooth } = useScroll(chatbox, { behavior: 'smooth' })
const store = useMessageStore()
const {messages, isSending, isAllAttachmentsLoaded} = storeToRefs(store)
const isScrolledToTop = ref(false)
const initialScrollHeight = ref(0)
const isLoading = ref(false)
const isShowDownButton = ref(false)
const route = useRoute()
const contactId = parseInt(route.params.id as string)

const signalR = useSignalR()

onMounted(() => {
  signalR.on('ReceiveMessage', async(message) => {
    const parsedMessage = JSON.parse(message)
    if (parsedMessage.contactId !== store.contactId) return
    if (messages.value.find(m => m.mId === parsedMessage.mId)) return
    messages.value.push(parsedMessage)
    await store.markRead(parsedMessage.contactId, parsedMessage.id)
    if (!parsedMessage.isEcho) {
      isShowDownButton.value = true
    }
    else{
      isSending.value = false
    }
  })
})

const handleScroll = async () => {
  if (chatbox.value == null) return
  if (chatbox.value.scrollTop <= 5  && directions.top && !store.isLastMessage) {
    if (!isScrolledToTop.value)
      initialScrollHeight.value = chatbox.value!.scrollHeight

    isLoading.value = true
    const oldScrollHeight = chatbox.value!.scrollHeight
    isScrolledToTop.value = true
    await new Promise(resolve => setTimeout(resolve, 1000));
    await store.getFacebookMessages(messages.value[0].id, contactId)

    // if (!store.isLastMessage) {
      await nextTick()
      y.value = chatbox.value?.scrollHeight - oldScrollHeight
    // }
    isLoading.value = false
  }
}

const handleDownButton = () => {
  ySmooth.value = chatbox.value!.scrollHeight
  isShowDownButton.value = false
}

watch([y], () => {
  console.log(y.value, chatbox.value?.scrollHeight)
  if (chatbox.value != null && chatbox.value?.scrollHeight - y.value < 1000)
  {
    isShowDownButton.value = false
  }
})

// SET SCROLL TO BOTTOM
watch([messages, isAllAttachmentsLoaded], async () => {
  if (chatbox.value != null && isAllAttachmentsLoaded && (!isScrolledToTop.value || chatbox.value?.scrollHeight - y.value < initialScrollHeight.value)){
    await nextTick();
    y.value = chatbox.value!.scrollHeight;
    isShowDownButton.value = false
  }
}, {deep: true, immediate: true});

watch(isSending, async () => {
  if (isSending.value) {
    console.log("fire")
    await nextTick()
    y.value = chatbox.value!.scrollHeight
  }
})

const handleLoadImage = (url: string) => {
  console.log(`${url} loaded`)
  store.loadingAttachments = store.loadingAttachments.filter(attachment => attachment !== url)
  if (store.loadingAttachments.length === 0) {
    store.isAllAttachmentsLoaded = true
  }
}
</script>

<template>
  <div ref="chatbox"
       @scroll="handleScroll"
       class="overflow-auto w-full mb-3">
    <div class="w-full flex justify-center my-4" :class="{invisible: !isLoading}">
      <div class="loading"></div>
    </div>

      <div class="btn btn-sm btn-primary -translate-x-1/2 z-9999 animate-bounce rounded-full absolute bottom-24 left-[47%]"
           :class="{invisible: !isShowDownButton}"
           @click="handleDownButton">
        <ChevronDoubleDownIcon class="size-4"/>
    </div>
    <!--      <div class="tooltip"-->
    <!--           :class="{ 'tooltip-left': message.isEcho, 'tooltip-right': !message.isEcho }"-->
    <!--           :data-tip="new Date(message.updatedOn.toLocaleString()).toLocaleString('vi-VN')">-->
    <div class="chat p-0 mb-3"
         :class="{'chat-start': !message.isEcho, 'chat-end': message.isEcho}"
         v-for="message in messages"
         :key="message.id">

<!--      Text message-->
        <div class="chat-bubble chat-bubble-info relative group max-w-[60%] whitespace-pre-line"
             :data-tooltip-target="'tt' + message.id"
             data-tooltip-placement="right"
             v-if="message.attachments.length === 0"
        >{{message.content}}
          <div :id="'tt' + message.id" role="tooltip"
               :class="[message.isEcho ? 'right-[115%]' : 'left-[115%]']"
               class="absolute w-[150px] z-100 tooltip  inline-block bottom-1 opacity-0 group-hover:opacity-85
               px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm dark:bg-gray-700">
            {{new Date(moment.utc(message.updatedOn).toLocaleString()).toLocaleString('vi-VN')}}
            <div class="tooltip-arrow" data-popper-arrow></div>
        </div>
      </div>

<!--      Image -->
      <div class="chat-bubble chat-bubble-info relative group max-w-[50%]"
           :data-tooltip-target="'tt' + message.id"
           data-tooltip-placement="right"
           v-else-if="message.attachments[0].type === 'image'"
      >
        <img :src="message.attachments[0].url">
        <div :id="'tt' + message.id" role="tooltip"
             :class="[message.isEcho ? 'right-[115%]' : 'left-[115%]']"
             class="absolute w-[150px] z-100 tooltip  inline-block bottom-1 opacity-0 group-hover:opacity-85 px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm dark:bg-gray-700">
          {{new Date(moment.utc(message.updatedOn).toLocaleString()).toLocaleString('vi-VN')}}
          <div class="tooltip-arrow" data-popper-arrow></div>
        </div>
      </div>

<!--      file-->
      <div class="chat-bubble chat-bubble-info relative group max-w-[50%]"
           :data-tooltip-target="'tt' + message.id"
           data-tooltip-placement="right"
           v-else-if="message.attachments[0].type === 'file'"
      >
        <a :href="message.attachments[0].url" @load="handleLoadImage(message.attachments[0].url)" target="_blank" class="flex items-center gap-2">
          <DocumentIcon class="size-8"/>
          <span>{{message.attachments[0].fileName}}</span>
        </a>
        <div :id="'tt' + message.id" role="tooltip"
             :class="[message.isEcho ? 'right-[115%]' : 'left-[115%]']"
             class="absolute w-[150px] z-100 tooltip  inline-block bottom-1 opacity-0 group-hover:opacity-85 px-3 py-2
             text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm dark:bg-gray-700">
          {{new Date(moment.utc(message.updatedOn).toLocaleString()).toLocaleString('vi-VN')}}
          <div class="tooltip-arrow" data-popper-arrow></div>
        </div>
      </div>

    </div>

    <div class="chat p-0 mb-3 chat-end">

      <div class="chat-bubble chat-bubble-info flex items-center opacity-60" v-if="isSending">
        Sending<span class=" ml-2 loading loading-dots loading-xs"></span>
      </div>
    </div>

  </div>
</template>

<style scoped>

</style>