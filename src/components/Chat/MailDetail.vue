<script setup lang="ts">

import {
  ArrowUturnLeftIcon,
  DocumentIcon,
  UserCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  XMarkIcon
} from '@heroicons/vue/24/solid'
import MailList from '@/components/Chat/MailList.vue'
import { useMessageStore } from '@/stores/messageStore'
import { storeToRefs } from 'pinia'
import moment from 'moment'
import { onMounted, ref, watch, watchEffect } from 'vue'
import { toast } from 'vue3-toastify'
import { sendGmailMessage, uploadGmailAttachment } from '@/services/message.service'
import { useSignalR } from '@dreamonkey/vue-signalr'
import type { Attachment, GmailThreadList, Message } from '@/types/message'
import ImageUploader from 'quill-image-uploader'
import 'quill-image-uploader/dist/quill.imageUploader.min.css'
import { Quill } from '@vueup/vue-quill'
import { FileType } from '@/types/enum'

if (!Quill.imports['modules/ImageUploader']) {
  console.log("register quill")
  Quill.register('modules/ImageUploader', ImageUploader);
}

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
const editorSize = ref(150)
const isFullSize = ref(false)
const fileList = ref<File[]>([])
const fileInput = ref<HTMLInputElement | null>(null)
const isAbleToSend = ref(false)

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
      attachments: parsedMessage.attachments
    }

    store.messages.push(newMessage)
  })
})

watch([content, fileList], () => {
  isAbleToSend.value = (content.value !== '' && content.value !== '<p><br></p>') || fileList.value.length > 0
}, {deep: true})

const sendMail = async () => {
  // if (subject.value === undefined || subject.value === '') {
  //   toast.error('Subject is required')
  //   return
  // }

  // if (content.value === undefined || content.value === '') {
  //   toast.error('Content is required')
  //   return
  // }

  const loadingToast = toast.loading('Sending mail')

  let attachments : Attachment[] = []
  if (fileList.value.length > 0) {
    attachments = await uploadGmailAttachment(fileList.value)
    fileList.value = []
  }

  const task = sendGmailMessage(content.value, store.messages[0].subject!, store.contactId, store.messages[0].id, attachments)
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
  return `${str.substring(0, length - 7)}...${str.substring(str.length - 7)}`
}

const options = {
  modules: {
    ImageUploader: {
      name: 'imageUploader',
      module: ImageUploader,
      upload(file: File) {
        return new Promise((resolve, reject) => {
            uploadGmailAttachment([file]).then((attachments) => {
              resolve(attachments[0].url)
            })
              .catch((err) => {
                toast.error("Failed to upload image")
                reject(err)
              })
        })
      }
    },
    toolbar: {
      container:
        [
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          ['image', 'link'],
        ],
      handlers: {
        link: function (value: any) {
          fileInput.value?.click()
        }
      }
    }
  }
}

const onChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  const uploadFiles = target.files
  if (uploadFiles) {
    for (let i = 0; i < uploadFiles.length; i++) {
      if (fileList.value.some(f => f.name === uploadFiles[i].name)) {
        continue
      }

      fileList.value.push(uploadFiles[i])
    }
  }
}

const generateURL = (file : File) => {
  let fileSrc = URL.createObjectURL(file);
  setTimeout(() => {
    URL.revokeObjectURL(fileSrc);
  }, 1000);
  return fileSrc;
}

function humanFileSize(size : number) {
  console.log(size)
  let i = size == 0 ? 0 : Math.floor( Math.log(size) / Math.log(1024) );
  return +((size / Math.pow(1024, i)).toFixed(2)) + ' ' + ['B', 'kB', 'MB', 'GB', 'TB'][i];
}

</script>

<template>
  <div class="overflow-auto w-full">
    <div class=" w-full top-0 z-9999 rounded-lg">
      <div class="w-fit py-0 flex items-center btn btn-sm btn-primary mt-2"
           @click="store.messages = [] && changeComponent(MailList)">
        <ArrowUturnLeftIcon class="size-4" />
        Back
      </div>
    </div>

    <!--      <div class="divider mt-0"></div>-->
    <div class="text-2xl mt-4 font-bold">{{ store.messages != undefined && store.messages[0] != undefined && store.messages[0].subject }}</div>

    <div v-for="(message, index) in store.messages" :key="message.id">

      <div class="flex w-full items-center mt-4 z-0">
        <div class="flex items-center gap-3">
          <div class="size-12">
            <UserCircleIcon class="size-full" />
          </div>

          <div class="flex-col justify-center items-center">
            <div class="font-bold">
              {{ message.isEcho ? (store.contactInfo?.sourceName || store.contactInfo?.email) :
              (store.contactInfo?.name || store.contactInfo?.email)
              }}
            </div>
            <div class="text-sm text-gray-500">
              {{ message.isEcho ? (store.contactInfo?.sourceName ? store.contactInfo?.sourceEmail : '') :
              (store.contactInfo?.name ? store.contactInfo?.email : '')
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
        <div v-html="message.content" class="w-full text-md">
        </div>
        <div class="flex gap-2 flex-wrap">
          <div v-if="message.attachments.length > 0" class="mt-4 w-fit px-2 h-16 flex items-center">
            <a :href="attachment.url" target="_blank" v-for="attachment in message.attachments"
               :key="attachment.fileName">

              <div v-if="isImage(attachment.url)"
                   class="flex mr-2 gap-2 bg-gray-500 hover:bg-gray-400 cursor-pointer p-2 rounded-lg">
                <img :src="attachment.url" class="w-16 h-12" />
                <div class="font-bold">{{ shortenedString(attachment.fileName) }}</div>
              </div>

              <div v-else
                   class="flex mr-2 gap-2 bg-gray-500 hover:bg-gray-400 cursor-pointer p-2 rounded-lg">
                <DocumentIcon class="size-12" />
                <div class="font-bold">{{ shortenedString(attachment.fileName) }}</div>
              </div>
            </a>
          </div>
        </div>
      </div>
      <div v-if="index !== store.messages.length - 1" class="divider mt-6"></div>
    </div>
  </div>


  <div class="divider "></div>

  <div class=" mt-auto mb-2 w-full">


    <form class="flex items-center mb-4">
      <ChevronUpIcon class="size-6 mr-4"
                     :class="{'hidden': isFullSize}"
                     @click="() => {editorSize=550; isFullSize=true}"/>
      <ChevronDownIcon class="size-6 mr-4"
                       :class="{'hidden': !isFullSize}"
                       @click="() => {editorSize=150; isFullSize=false}"/>
      <label class="mr-2 text-lg ml-2 font-bold">Subject:</label>
      <input type="text" class="input w-full mr-4" :value="'Re: ' + store.messages[0].subject" required disabled>
      <button @click.prevent="sendMail" :disabled="!isAbleToSend" class="btn btn-primary">Send
      </button>
    </form>
    <div
      v-if="fileList.length > 0"
      class="h-20 flex overflow-x-scroll overflow-y-hidden">

      <div v-for="file in fileList" :key="file.name" class="flex mr-2 items-center font-bold text-lg border border-dashed border-primary p-4 justify-start h-16 min-w-fit">
        <img v-if="isImage(file.name)" :src="generateURL(file!)" class="size-12" />
        <DocumentIcon v-else class="size-12"/>

        <div class="flex flex-col ml-4">
          <span class="font-bold">{{ shortenedString(file?.name) }}</span>
          <span class="text-sm">
          {{humanFileSize(file?.size || 0)}}
          </span>
        </div>
        <XMarkIcon class="size-6 text-error ml-2 cursor-pointer hover:bg-red-300 rounded-full" @click="fileList = fileList.filter(f => f.name !== file.name)"/>
      </div>
    </div>

    <div class="border rounded-lg bg-base-200">
      <QuillEditor v-model:content="content"
                   ref="editor"
                   content-type="html"
                   :options="options"
                   :style="'height:' + editorSize + 'px' "/>
    </div>
    <input
      type="file"
      multiple
      name="file"
      id="fileInput"
      class="hidden-input"
      @change="onChange"
      ref="fileInput"
      accept=".jpg,.jpeg,.png,.svg,.pdf,.doc,.docx,.mp4"
    />
  </div>


</template>

<style scoped>

.hidden-input {
  opacity: 0;
  overflow: hidden;
  position: absolute;
  width: 1px;
  height: 1px;
}
</style>
