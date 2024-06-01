<script setup lang="ts">
import Search from '@/components/Search.vue'
import ChatItem from '@/components/Chat/ChatItem.vue'
import { useMessageStore } from '@/stores/messageStore'
import { storeToRefs } from 'pinia'
import { onMounted, ref, watch } from 'vue'
import { useSignalR } from '@dreamonkey/vue-signalr'
import { MagnifyingGlassIcon, UserPlusIcon } from '@heroicons/vue/24/solid'
import debounce from 'lodash.debounce'
import { SourceType } from '@/types/enum'
import { useGlobalStore } from '@/stores/global'
import { toast } from 'vue3-toastify'
import { addContact } from '@/services/contact.service'

const store = useMessageStore()
const {contactList} = storeToRefs(store)
const signalR = useSignalR()

const globalStore = useGlobalStore()
const {sources} = storeToRefs(globalStore)

onMounted(() => {
  signalR.on('ReceiveMessage', async(message) => {
    await store.getContactList()
  })
})

const addContactModel = ref<{
  email: string,
  sourceId: number
}>({
  email: '',
  sourceId: 0
})

const openModal = () => {
  addContactModel.value =
    {
      email: '',
      sourceId: 0
    }

  const modal = document.getElementById('add_contact') as HTMLDialogElement
  modal.showModal()
}

const searchTerm = ref("")

watch([searchTerm], debounce(async() => {
  store.contactFilter.search = searchTerm.value
  await store.getContactList()
}, 500))

const handleAddContact = async () => {
  const loadingToast = toast.loading('Adding contact')
  try {
    const task = addContact(addContactModel.value.email, addContactModel.value.sourceId)
    const modal = document.getElementById('add_contact') as HTMLDialogElement
    modal.close()
    await task
    await store.getContactList()
    toast.remove(loadingToast)
    toast.success('Add contact successfully')
  } catch(error: any) {
    toast.remove(loadingToast)
    toast.error(error.message)
  }
}

</script>

<template>
  <div class="w-[17%] px-4 overflow-auto bg-base-200">

    <div class="sticky top-0 z-10 mb-4 pt-6 bg-base-200">
      <div class="flex items-center justify-between mb-4">
        <div class="text-xl font-bold">Contacts ({{store.pagingInfo.totalCount}})</div>

        <div class="btn btn-info btn-sm" >
          <UserPlusIcon class="size-6" @click="openModal" />
        </div>
      </div>

<!--      <div class="flex flex-row items-center justify-end mb-2">-->
<!--        <select class="select max-w-xs">-->
<!--          <option selected>Homer</option>-->
<!--          <option>Marge</option>-->
<!--          <option>Bart</option>-->
<!--          <option>Lisa</option>-->
<!--          <option>Maggie</option>-->
<!--        </select>-->
<!--      </div>-->

      <div>
<!--        <Search/>-->
        <label class="input input-bordered flex items-center gap-2">
          <MagnifyingGlassIcon class="size-6"/>
          <input type="text" class="grow"
                 v-model="searchTerm"
                 placeholder="Search..." />
        </label>
      </div>
    </div>

      <div v-for="contact in contactList" :key="contact.id">
        <ChatItem :contact="contact"/>
      </div>
  </div>

  <!--  Add contact modal-->
  <dialog id="add_contact" class="modal">
    <div class="modal-box min-w-[600px]">
      <div class="flex gap-2 items-center">
        <h3 class="font-bold text-lg">Add new contact</h3>
        <div class="tooltip tooltip-right" data-tip="We only support add contact to email source">
          <span role="button" class="font-bold bg-neutral text-neutral-content animate-bounce cursor-pointer size-4 flex items-center justify-center rounded-full">!</span>
        </div>
      </div>
      <form method="dialog">
        <input class="input input-bordered mt-4 w-full" type="email" placeholder="Contact's email" v-model="addContactModel.email" required>
        <select class="select select-bordered mt-4 w-full" v-model="addContactModel.sourceId">
          <option value="0" selected disabled>Select source</option>
          <option v-for="source in sources.filter(s => s.type === SourceType.GOOGLE)" :key="source.id" :value="source.id">{{source.email || source.name}}</option>
        </select>
        <div class="modal-action">
          <div class="flex gap-4">
            <!-- if there is a button in form, it will close the modal -->
            <form method="dialog">
              <button class="btn">Close</button>
            </form>
            <button class="btn btn-primary"
                    :disabled="addContactModel.email === '' || addContactModel.sourceId === 0"
                    @click.prevent="handleAddContact">Save</button>
          </div>
        </div>
      </form>
    </div>
  </dialog>
</template>

<style scoped>

</style>