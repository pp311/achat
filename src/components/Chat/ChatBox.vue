<script setup lang="ts">
import { DocumentIcon, DocumentTextIcon, PaperAirplaneIcon, PaperClipIcon, XMarkIcon } from '@heroicons/vue/24/solid'
import ChatMessageList from '@/components/Chat/ChatMessageList.vue'
import { onMounted, onUnmounted, ref, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import { useMessageStore } from '@/stores/messageStore'
import { uploadFacebookAttachment } from '@/services/message.service'
import { FileType, TemplateType } from '@/types/enum'
import { toast } from 'vue3-toastify'
import { useGlobalStore } from '@/stores/global'
import { storeToRefs } from 'pinia'
import type { Template } from '@/types/template'

const route = useRoute()
const contactId = parseInt(route.params.id as string)
const store = useMessageStore()
const globalStore = useGlobalStore()
const {templateList} = storeToRefs(globalStore)
const input = ref<string>("")
const file = ref<File | null>(null)
const fileType = ref<FileType | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)
const isAbleToSend = ref(false)

watchEffect(async () => {
  await store.getFacebookMessages(0, contactId);
})

watchEffect(() => {
  isAbleToSend.value = input.value !== "" || (file.value !== null && fileType.value !== null)
})

const handleSendMessage = async (evt: KeyboardEvent | null = null) => {
  if (evt?.shiftKey == true)
    return
  else
    evt?.preventDefault()

  store.isSending = true
  try{
    if (file.value !== null && fileType.value !== null) {
      const attachment = await uploadFacebookAttachment(file.value)
      let task = store.sendFacebookMessage(input.value, attachment, (msg : string)  => toast.error(msg))
      file.value = null
      fileType.value = null
      input.value = ""
      await task;
    } else if (input.value !== "") {
      let task = store.sendFacebookMessage(input.value, null, (msg: string) => toast.error(msg))
      input.value = ""
      await task;
    }
  } finally {
    // store.isSending = false
  }
}

const onDrop = (e: DragEvent) => {
  console.log("drop")
  const files = e.dataTransfer?.files
  if (files) {
    file.value = files[0]
    console.log(file.value.type)
    switch (file.value.type) {
      case "image/jpeg":
      case "image/png":
      case "image/svg+xml":
        fileType.value = FileType.IMAGE
        break
      case "application/pdf":
      case "application/msword":
      case "application/vnd.ms-excel":
      case "application/vnd.ms-powerpoint":
      case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      case "application/vnd.openxmlformats-officedocument.presentationml.presentation":
      case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
        fileType.value = FileType.FILE
        break
      case "video/mp4":
        fileType.value = FileType.VIDEO
        break
      default:
        fileType.value = null
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
      case "image/svg+xml":
        fileType.value = FileType.IMAGE
        break
      case "application/pdf":
      case "application/msword":
      case "application/vnd.ms-excel":
      case "application/vnd.ms-powerpoint":
      case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      case "application/vnd.openxmlformats-officedocument.presentationml.presentation":
      case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
        fileType.value = FileType.FILE
        break
      case "video/mp4":
        fileType.value = FileType.VIDEO
        break
      default:
        fileType.value = null
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
  console.log(size)
  let i = size == 0 ? 0 : Math.floor( Math.log(size) / Math.log(1024) );
  return +((size / Math.pow(1024, i)).toFixed(2)) + ' ' + ['B', 'kB', 'MB', 'GB', 'TB'][i];
}

const handleTemplateClick = (template: Template) => {
  input.value = replaceDynamicValue(template.content)
}

const replaceDynamicValue = (content: string) => {
  content = content.replace(/{{ContactName}}/g, store.contactInfo?.name || "")
  content = content.replace(/{{ContactEmail}}/g, store.contactInfo?.email || "")
  return replaceDateMacros(content)
}

function replaceDateMacros(str: string) {
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, '0');
  const mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
  const yyyy = today.getFullYear();

  const formattedToday = `${dd}/${mm}/${yyyy}`;

  return str.replace(/{{Today}}/g, formattedToday)
    .replace(/{{Today\+([0-9]+)}}/g, (match, days) => {
      const newDate = new Date(today.getTime() + days * 24 * 60 * 60 * 1000);
      return `${newDate.getDate()}/${newDate.getMonth() + 1}/${newDate.getFullYear()}`;
    })
    .replace(/{{Today-([0-9]+)}}/g, (match, days) => {
      const newDate = new Date(today.getTime() - days * 24 * 60 * 60 * 1000);
      return `${newDate.getDate()}/${newDate.getMonth() + 1}/${newDate.getFullYear()}`;
    });
}
</script>

<template>
  <div class="w-[58%] overflow-scroll bg-base-300 flex flex-col items-start">
<!--HEADER-->
    <slot/>
<!--    MESSAGES-->
    <ChatMessageList />
<!--    INPUT-->
    <div class="mt-auto mb-2 w-full" @drop.prevent="onDrop">
      <div
        v-if="file !== null && fileType !== null"
        class="w-full h-16 p-4 flex items-center font-bold text-lg border border-dashed border-primary">

        <img v-if="fileType === FileType.IMAGE" :src="generateURL(file!)" class="size-12" />
        <DocumentIcon v-else class="size-12 mr-2"/>

        <div class="flex flex-col ml-4">
          <span class="font-bold">{{ file?.name }}</span>
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
        ref="fileInput"
        accept=".jpg,.jpeg,.png,.svg,.pdf,.doc,.docx,.mp4"
      />

      <div class="w-full flex flex-row ">
        <div class="dropdown dropdown-top dropdown-start">
        <span tabindex="0" role="button" class="btn bg-transparent border-none shadow-none rounded-full">
          <DocumentTextIcon class="size-4"/>
        </span>
          <div tabindex="0" class="dropdown-content w-fit shadow rounded-xl">
            <div class="max-h-56 overflow-y-scroll overflow-x-hidden rounded-xl w-full bg-base-100">
              <div class="font-bold text-lg text-center">Templates</div>
              <div class="divider my-0"></div>
              <div v-if="templateList.length === 0" class="text-info text-center">No templates found</div>
              <div v-for="template in templateList.filter(t => t.type === TemplateType.MESSAGE)"
                   :key="template.id"
                   @click="handleTemplateClick(template)"
                   class="bg-base-100 hover:bg-base-200 w-full cursor-pointer">
                <div class="px-4 py-2 font-bold text-nowrap">{{template.name}}</div>
              </div>
            </div>
          </div>
        </div>
        <label for="fileInput" class="btn bg-transparent border-none shadow-none rounded-full"><PaperClipIcon class="size-4"/> </label>
        <textarea rows="1"
                  v-model="input"
                  @keydown.enter="handleSendMessage"
                  class="grow h-full textarea rounded-r-none"
                  placeholder="Write your messages..." />
        <div class="btn btn-primary rounded-l-none" :class="{'btn-disabled': !isAbleToSend }" @click="handleSendMessage(null)">
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