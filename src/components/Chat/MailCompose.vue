<script setup lang="ts">

import { ArrowUturnLeftIcon, DocumentIcon, UserCircleIcon, XMarkIcon } from '@heroicons/vue/24/solid'
import MailList from '@/components/Chat/MailList.vue'
import { useMessageStore } from '@/stores/messageStore'
import { onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { toast } from 'vue3-toastify'
import { sendGmailMessage, uploadGmailAttachment } from '@/services/message.service'
import type { Attachment, Message } from '@/types/message'
import { TemplateType } from '@/types/enum'
import ImageUploader from 'quill-image-uploader'
import 'quill-image-uploader/dist/quill.imageUploader.min.css'
import { Quill } from '@vueup/vue-quill'
import { useGlobalStore } from '@/stores/global'

const props = defineProps({
  changeComponent: {
    type: Function,
    required: true
  },
})

if (!Quill.imports['modules/ImageUploader']) {
  console.log("register quill")
  Quill.register('modules/ImageUploader', ImageUploader);
}

const store = useMessageStore()

const editor = ref()
const content = ref()
const subject = ref()

const fileList = ref<File[]>([])
const fileInput = ref<HTMLInputElement | null>(null)

const globalStore = useGlobalStore()
const { templateList } = storeToRefs(globalStore)

onMounted(() => {

  //Template
  const selectBoxes = Array.prototype.slice.call(document.querySelectorAll('.ql-picker-options'));

  selectBoxes.forEach(selectBox => {
    selectBox.style.maxHeight = '150px';
    selectBox.style.overflow = 'auto'
  });

  const placeholderPickerItems = Array.prototype.slice.call(document.querySelectorAll('.ql-templates .ql-picker-item'));

  placeholderPickerItems.forEach(item => {
    const id = item.dataset.value.split('@#$%')[1]
    const name = item.dataset.value.split('@#$%')[0]
    item.textContent = name
    item.dataset.value = id
  });

  document.querySelector('.ql-templates .ql-picker-label')!.innerHTML = 'Templates' + document.querySelector('.ql-templates .ql-picker-label')!.innerHTML;
  document.querySelector('.ql-templates')!.className += ' w-[100px]'
})

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

  let attachments: Attachment[] = []
  if (fileList.value.length > 0) {
    attachments = await uploadGmailAttachment(fileList.value)
    fileList.value = []
  }

  const task = sendGmailMessage(content.value, subject.value, store.contactId, null, attachments)
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

    let totalFileSize = fileList.value.reduce((a, b) => a + b.size, 0)
    if (totalFileSize > 15*1024*1024) {
      toast.error("Total attachment size exceeds 15MB limit")
      for (let i = 0; i < uploadFiles.length; i++) {
        if (fileList.value.some(f => f.name === uploadFiles[i].name)) {
          fileList.value.filter(f => f.name !== uploadFiles[i].name)
        }
      }
    }
  }
}

const generateURL = (file: File) => {
  let fileSrc = URL.createObjectURL(file);
  setTimeout(() => {
    URL.revokeObjectURL(fileSrc);
  }, 1000);
  return fileSrc;
}

function humanFileSize(size: number) {
  console.log(size)
  let i = size == 0 ? 0 : Math.floor(Math.log(size) / Math.log(1024));
  return +((size / Math.pow(1024, i)).toFixed(2)) + ' ' + ['B', 'kB', 'MB', 'GB', 'TB'][i];
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
          [{ 'templates': templateList.value.filter(t => t.type === TemplateType.EMAIL).map(t => `${t.name}@#$%${t.id}`) }],
        ],
      handlers: {
        link: function (value: any) {
          fileInput.value?.click()
        },
        "templates": function (value: any) {
          console.log(value)
          const id = value.split('@#$%')[1]

          const template = templateList.value.find(t => t.id == id)
          if (template) {
            content.value = replaceDynamicValue(template.content)
          }
        }
      }
    }
  }
}
</script>

<template>
  <div class="overflow-auto w-full relative px-4">
    <div class=" w-full rounded-lg mb-8">
      <div class="w-fit py-0 flex items-center btn btn-sm btn-primary mt-2"
           @click="props.changeComponent(MailList)"
      >
        <ArrowUturnLeftIcon class="size-4"/> Back
      </div>
    </div>

    <div class=" mt-auto mb-2 w-full">
      <form class="flex items-center mb-4">
        <label class="mr-2 text-lg ml-2 font-bold">Subject:</label>
        <input type="text" class="input w-full mr-4" v-model="subject" required>
        <button
          @click.prevent="sendMail"
          class="btn btn-primary">Send</button>
      </form>

<!--      attachment-->
      <div v-if="fileList.length > 0" class="h-20 flex overflow-x-auto overflow-y-hidden">

        <div v-for="file in fileList" :key="file.name"
             class="flex mr-2 items-center font-bold text-lg border border-dashed border-primary p-4 justify-start h-16 min-w-fit">
          <img v-if="isImage(file.name)" :src="generateURL(file!)" class="size-12" />
          <DocumentIcon v-else class="size-12" />

          <div class="flex flex-col ml-4">
            <span class="font-bold">{{ shortenedString(file?.name) }}</span>
            <span class="text-sm">
                        {{ humanFileSize(file?.size || 0) }}
                    </span>
          </div>
          <XMarkIcon class="size-6 text-error ml-2 cursor-pointer hover:bg-red-300 rounded-full"
                     @click="fileList = fileList.filter(f => f.name !== file.name)" />
        </div>
      </div>

      <div class="border rounded-lg bg-base-200">
        <QuillEditor
          v-model:content="content"
          ref="editor"
          content-type="html"
          :options="options"
          style="height: 600px;"/>
      </div>

      <input type="file" multiple name="file" id="fileInput" class="hidden-input" @change="onChange" ref="fileInput"
             accept=".jpg,.jpeg,.png,.svg,.pdf,.doc,.docx,.mp4" />
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