<script setup lang="ts">
import { PaperAirplaneIcon, PaperClipIcon, PhotoIcon, DocumentIcon, XMarkIcon } from '@heroicons/vue/24/solid'
import ChatMessageList from '@/components/Chat/ChatMessageList.vue'
import { onMounted, onUnmounted, ref, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import { useMessageStore } from '@/stores/messageStore'
import { FileType } from '@/types/enum'

const route = useRoute()
const contactId = parseInt(route.params.id as string)
const store = useMessageStore()
const input = ref<string>("")
const file = ref<File | null>(null)
const fileType = ref<FileType | null>(null)

watchEffect(async () => {
  await store.getFacebookMessages(0, contactId);
})

const handleSendMessage = async () => {
  if (input.value === "") return
  const content = input.value
  input.value = ""
  store.isSending = true
  await store.sendFacebookMessage(content)
}

const onDrop = (e: DragEvent) => {
  console.log("drop")
  const files = e.dataTransfer?.files
  if (files) {
    file.value = files[0]
    switch (file.value.type) {
      case "image/jpeg":
      case "image/png":
        fileType.value = FileType.IMAGE
        break
      default:
        fileType.value = FileType.FILE
    }
  }
}

const onChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  const files = target.files
  if (files) {
    file.value = files[0]
    switch (file.value.type) {
      case "image/jpeg":
      case "image/png":
        fileType.value = FileType.IMAGE
        break
      default:
        fileType.value = FileType.FILE
    }
  }
}

function preventDefaults(e : Event) {
  e.preventDefault()
}

const events = ['dragenter', 'dragover', 'dragleave', 'drop']

onMounted(() => {
  events.forEach((eventName) => {
    document.body.addEventListener(eventName, preventDefaults)
  })
})

onUnmounted(() => {
  events.forEach((eventName) => {
    document.body.removeEventListener(eventName, preventDefaults)
  })
})

const generateURL = (file : File) => {
  let fileSrc = URL.createObjectURL(file);
  setTimeout(() => {
    URL.revokeObjectURL(fileSrc);
  }, 1000);
  return fileSrc;
}

function humanFileSize(size : number) {
  let i = size == 0 ? 0 : Math.floor( Math.log(size) / Math.log(1024) );
  return +((size / Math.pow(1024, i)).toFixed(2)) + ' ' + ['B', 'kB', 'MB', 'GB', 'TB'][i];
}
</script>

<template>
  <div class="w-[55%] overflow-scroll bg-base-300 flex flex-col items-start px-4">
<!--HEADER-->
    <div class="flex flex-row items-center gap-2 max-h-20 pt-2 w-full">
      <div class="avatar">
        <div class="w-16 rounded-full">
          <img src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
        </div>
      </div>

      <div class="flex flex-col">
        <span class="font-bold text-md">Chatting with</span>
        <span class="font-bold text-2xl">Full Name</span>
      </div>

      <div class="ml-auto">
        <img class="size-12" src="../../assets/facebook.svg">
      </div>
    </div>
    
    <div class="divider m-1"></div>

<!--    MESSAGES-->
    <ChatMessageList />
<!--    INPUT-->
    <div class="mt-auto mb-2 w-full" @drop.prevent="onDrop">
      <div
        v-if="file !== null"
        class="w-full h-16 p-4 flex items-center font-bold text-lg border border-dashed border-primary">
        <img v-if="fileType === FileType.IMAGE" :src="generateURL(file!)" class="size-12" />
        <DocumentIcon v-else class="size-12 mr-2"/>
        <div class="flex flex-col ml-4">
          <span class="font-bold">{{file?.name}}</span>
          <span class="text-sm">
          {{humanFileSize(file?.size || 0)}}
          </span>
        </div>
          <XMarkIcon class="size-6 text-error cursor-pointer ml-auto hover:bg-red-300 rounded-full self-start" @click="file = null"/>
      </div>

      <input
        type="file"
        multiple
        name="file"
        id="fileInput"
        class="hidden-input"
        @change="onChange"
        ref="file"
        accept=".jpg,.jpeg,.png"
      />

      <div class="w-full flex flex-row ">
        <span class="btn bg-transparent border-none shadow-none rounded-full"><PhotoIcon class="size-4"/> </span>
        <label for="fileInput" class="btn bg-transparent border-none shadow-none rounded-full"><PaperClipIcon class="size-4"/> </label>
        <textarea rows="1"
                  v-model="input"
                  class="grow h-full textarea rounded-r-none"
                  placeholder="Write your messages..." />
        <div class="btn btn-primary rounded-l-none" :class="{'btn-disabled': input === ''}" @click="handleSendMessage">
          <PaperAirplaneIcon class="size-6"/>
        </div>
      </div>
    </div>

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