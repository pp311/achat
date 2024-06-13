<script setup lang="ts">
import TagList from '@/components/Chat/TagList.vue'
import ChatContactInfo from '@/components/Chat/ChatContactInfo.vue'
import Collapse from '@/components/Collapse.vue'
import { IdentificationIcon, TagIcon, DocumentIcon, UserIcon, PencilIcon, TrashIcon } from '@heroicons/vue/24/solid'
import ChatNote from '@/components/Chat/ChatNote.vue'
import { useMessageStore } from '@/stores/messageStore'
import { storeToRefs } from 'pinia'
import { SourceType } from '@/types/enum'
import { ref } from 'vue'
import { toast } from 'vue3-toastify'

const store = useMessageStore()

const {contactInfo, refContactInfo, contactList} = storeToRefs(store)
const refId = ref<number>(0)

const openModal = () => {
  const modal = document.getElementById('add_ref_contact') as HTMLDialogElement
  modal.showModal()
}

const handleAddRefContact = async () => {
  const loadingToast = toast.loading('Linking contact')
  try {
    const task = store.setRefContact(refId.value)
    const modal = document.getElementById('add_ref_contact') as HTMLDialogElement
    modal.close()
    await task;

    toast.remove(loadingToast)
    toast.success('Link contact successfully')
  } catch (error: any) {
    toast.remove(loadingToast)
    toast.error(error.message)
  }
}

const removeRefContact = async () => {
  const loadingToast = toast.loading('Unlinking contact')
  try {
    await store.setRefContact(0)
    toast.remove(loadingToast)
    toast.success('Unlink contact successfully')
  } catch (error: any) {
    toast.remove(loadingToast)
    toast.error(error.message)
  }
}

</script>

<template>
<div class="w-[25%] bg-base-200 overflow-auto border-l border-gray-400">

  <Collapse title="Contact Info">
    <template #title><IdentificationIcon class="size-6 bold mr-2"/>Contact Info</template>
    <ChatContactInfo/>
  </Collapse>

  <Collapse title="Linked contact">
    <template #title><UserIcon class="size-6 bold mr-2"/>Linked contact</template>
    <div class="flex items-center gap-8">
      <div v-if="contactInfo != null">
        <img v-if="contactInfo.sourceType == SourceType.GOOGLE" class="size-8" src="../../assets/facebook.svg">
        <img v-if="contactInfo.sourceType == SourceType.FACEBOOK" class="size-8" src="../../assets/gmail.svg">
      </div>

      <div v-if="refContactInfo == null" class="group flex items-center">
        <span class="font-bold">Not linked</span>
        <button class="ml-2 group-hover:block hidden" @click="openModal"><PencilIcon class="size-4 text-info"/></button>
      </div>
      <div v-else class="group flex items-center">
        <RouterLink :to="'/chat/' + refContactInfo.id" class="font-bold cursor-pointer">{{refContactInfo.sourceType == SourceType.GOOGLE ? refContactInfo.email : refContactInfo.name}}</RouterLink>
        <button class="ml-2 group-hover:block hidden" @click="removeRefContact"><TrashIcon class="size-4 text-error"/></button>
      </div>
    </div>
  </Collapse>

  <Collapse title="Labels">
    <template #title><TagIcon class="size-6 bold mr-2"/>Labels</template>
    <TagList/>
  </Collapse>

  <Collapse title="Labels">
    <template #title><DocumentIcon class="size-6 bold mr-2"/>Notes</template>
    <ChatNote/>
  </Collapse>
</div>

  <!--  Add ref contact modal-->
  <dialog id="add_ref_contact" class="modal">
    <div class="modal-box min-w-[600px]">
      <div class="flex gap-2 items-center">
        <h3 class="font-bold text-lg">Link contact</h3>
      </div>
      <form method="dialog">
        <select class="select select-bordered mt-4 w-full" v-model="refId">
          <option value="0" selected disabled>Select contact</option>
          <option v-for="contact in contactList.filter(c => c.sourceType != contactInfo?.sourceType && c.id)"
                  :key="contact.id" :value="contact.id">{{contact.email || contact.name}}</option>
        </select>
        <div class="modal-action">
          <div class="flex gap-4">
            <!-- if there is a button in form, it will close the modal -->
            <form method="dialog">
              <button class="btn">Close</button>
            </form>
            <button class="btn btn-primary"
                    :disabled="refId == 0"
                    @click.prevent="handleAddRefContact">Save</button>
          </div>
        </div>
      </form>
    </div>
  </dialog>
</template>
