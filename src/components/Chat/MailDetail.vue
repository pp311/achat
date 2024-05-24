<script setup lang="ts">

import { ArrowUturnLeftIcon, DocumentIcon, UserCircleIcon } from '@heroicons/vue/24/solid'
import MailList from '@/components/Chat/MailList.vue'
import { useMessageStore } from '@/stores/messageStore'
import { storeToRefs } from 'pinia'
import moment from 'moment'
import { onMounted, ref, watch } from 'vue'
import { toast } from 'vue3-toastify'
import { sendGmailMessage } from '@/services/message.service'
import { useSignalR } from '@dreamonkey/vue-signalr'
import type { GmailThreadList, Message, UploadFacebookAttachmentResponse } from '@/types/message'
import { marked } from 'marked'

defineProps({
  changeComponent: {
    type: Function,
    required: true
  }
})
const editor = ref()
const store = useMessageStore()
const content = ref()
const subject = ref()

// const { messages } = storeToRefs(store)

const signalR = useSignalR()

onMounted(() => {
  signalR.on('ReceiveMessage', async (message) => {
    const parsedMessage = JSON.parse(message)
    if (parsedMessage.contactId !== store.contactId || parsedMessage.threadId !== store.threadId) return

    if (store.messages.some(m => m.mId === parsedMessage.mId)) return

    const newMessage: Message = {
      id: parsedMessage.id,
      content: parsedMessage.content,
      subject: parsedMessage.subject,
      createdOn: parsedMessage.createdOn,
      isEcho: parsedMessage.isEcho,
      contactId: parsedMessage.contactId,
      mId: parsedMessage.mId,
      updatedOn: parsedMessage.updatedOn,
      userId: parsedMessage.userId,
      attachments: []
    }

    store.messages.push(newMessage)
  })
})

// watch([messages], () => {
//   subject.value = 'Re: ' + messages.value[0].subject
// })

const sendMail = async () => {
  if (subject.value === undefined || subject.value === '') {
    toast.error('Subject is required')
    return
  }

  if (content.value === undefined || content.value === '') {
    toast.error('Content is required')
    return
  }

  const loadingToast = toast.loading('Sending mail')
  const task = sendGmailMessage(content.value, subject.value, store.contactId, store.messages[0].id)
  editor.value.setHTML('')
  try {
    await task
    toast.remove(loadingToast)
    toast.success('Mail sent successfully')
  } catch {
    toast.remove(loadingToast)
    toast.error('Failed to send mail')
  }
}

const isImage = (url: string) => {
  return url.match(/\.(jpeg|jpg|gif|png)$/)
}

const shortenedString = (str: string, length: number = 15) => {
  if (str.length <= length)
    return str
  return `${str.substring(0, length - 7)}...${str.substring(str.length-7)}`
}
</script>

<template>
  <div class="overflow-auto w-full">
    <div class=" w-full top-0 z-9999 rounded-lg">
      <div class="w-fit py-0 flex items-center btn btn-sm btn-primary mt-2"
           @click="store.messages = [] && changeComponent(MailList)"
      >
        <ArrowUturnLeftIcon class="size-4" />
        Back
      </div>
    </div>

    <!--      <div class="divider mt-0"></div>-->
    <div class="text-2xl mt-4 font-bold">{{ store.messages != undefined && store.messages[0].subject }}</div>

    <div v-for="(message, index) in store.messages" :key="message.id">

      <div class="flex w-full items-center mt-4 z-0">
        <div class="flex items-center gap-3">
          <div class="size-12">
            <UserCircleIcon class="size-full" />
          </div>

          <div class="flex-col justify-center items-center">
            <div class="font-bold">
              {{ message.isEcho ? (store.contactInfo?.sourceName || store.contactInfo?.email) : (store.contactInfo?.name || store.contactInfo?.email)
              }}
            </div>
            <div class="text-sm text-gray-500">
              {{ message.isEcho ? (store.contactInfo?.sourceName ? store.contactInfo?.sourceEmail : '') : (store.contactInfo?.name ? store.contactInfo?.email : '')
              }}
            </div>
          </div>
        </div>
        <div class="ml-auto mr-2 text-neutral">
          {{ new Date(moment.utc(message.createdOn).toLocaleString()).toLocaleString('vi-VN') }}
        </div>
      </div>

      <!--  Content-->
      <div class=" mt-4 list-decimal">
        <div
          v-html="message.content"
          class="w-full text-md">
        </div>
        <div class="flex gap-2 flex-wrap">
          <div v-if="message.attachments.length > 0"
               class="w-fit px-2 h-16 flex items-center">
            <a
              :href="attachment.url" target="_blank"
              v-for="attachment in message.attachments" :key="attachment.fileName">

              <div v-if="isImage(attachment.url)" class="flex mr-2 gap-2 bg-gray-500 hover:bg-gray-400 cursor-pointer p-2 rounded-lg">
                <img :src="attachment.url" class="w-16 h-12" />
                <div class="font-bold">{{shortenedString(attachment.fileName)}}</div>
              </div>

              <div v-else class="flex mr-2 gap-2 bg-gray-500 hover:bg-gray-400 cursor-pointer p-2 rounded-lg">
                <DocumentIcon class="size-12"/>
                <div class="font-bold">{{shortenedString(attachment.fileName)}}</div>
              </div>
            </a>
          </div>
        </div>
      </div>
      <div v-if="index !== store.messages.length -1" class="divider mt-6"></div>
    </div>
  </div>


  <div class="divider "></div>

  <div class=" mt-auto mb-2 w-full">
    <form class="flex items-center mb-4">
      <label class="mr-2 text-lg ml-2 font-bold">Subject:</label>
      <input type="text" class="input w-full mr-4" :value="'Re: ' + store.messages[0].subject" required disabled>
      <button
        @click.prevent="sendMail"
        class="btn btn-primary">Send
      </button>
    </form>
    <div class="border rounded-lg bg-base-200">
      <QuillEditor
        v-model:content="content"
        ref="editor"
        content-type="html"
        style="height: 150px;" />
    </div>
  </div>


</template>

<style scoped>
</style>