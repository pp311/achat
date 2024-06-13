<script setup lang="ts">

import { ArrowUturnLeftIcon, UserCircleIcon } from '@heroicons/vue/24/solid'
import MailList from '@/components/Chat/MailList.vue'
import { useMessageStore } from '@/stores/messageStore'
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { toast } from 'vue3-toastify'
import { sendGmailMessage } from '@/services/message.service'

const props = defineProps({
  changeComponent: {
    type: Function,
    required: true
  },
})

const store = useMessageStore()

const editor = ref()
const content = ref()
const subject = ref()

const sendMail = async () => {
  if (subject.value === undefined || subject.value === "") {
    toast.error("Subject is required")
    return
  }

  if (content.value === undefined || content.value === "") {
    toast.error("Content is required")
    return
  }

  const task = sendGmailMessage(content.value, subject.value, store.contactId)
  const loadingToast = toast.loading("Sending mail")
  try {
    editor.value.setHTML("")
    subject.value = ""
    await task
    toast.remove(loadingToast)
    toast.success("Mail sent successfully")
  } catch {
    toast.remove(loadingToast)
    toast.error("Failed to send mail")
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
      <div class="border rounded-lg bg-base-200">
        <QuillEditor
          v-model:content="content"
          ref="editor"
          content-type="html"
          style="height: 600px;"/>
      </div>
    </div>
  </div>

</template>

<style scoped>

</style>