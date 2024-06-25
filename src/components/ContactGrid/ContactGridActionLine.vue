<script setup lang="ts">
import { TrashIcon, TagIcon, WalletIcon, ChevronDownIcon, MagnifyingGlassIcon, EyeIcon, EyeSlashIcon, ArrowPathIcon, UserPlusIcon } from '@heroicons/vue/24/solid'
import Search from '@/components/Search.vue'
import { addTagToContact, createTag, getContactTags, getTags, removeTagFromContact } from '@/services/tag.service'
import { useContactListStore } from '@/stores/contactListStore'
import { ref, watch, watchEffect } from 'vue'
import { storeToRefs } from 'pinia'
import type { Tag, TagFilter } from '@/types/tag'
import { useGlobalStore } from '@/stores/global'
import { SourceType, TemplateType } from '@/types/enum'
import debounce from 'lodash.debounce'
import { toast } from 'vue3-toastify'
import { addContact, hideContacts, unHideContacts } from '@/services/contact.service'

const store = useContactListStore()
const globalStore = useGlobalStore()
const {sources} = storeToRefs(globalStore)

const tags = ref<Tag[]>([])
const { contactFilter, selectedContacts } = storeToRefs(store)

const filter = ref<TagFilter>({
  search: '',
  pageNumber: 1,
  sortBy: null,
  isDescending: false,
})

watchEffect(async () => {
  tags.value = (await getTags(filter.value, [],100000)).items
})

const searchTerm = ref("")

watch([searchTerm], debounce(async() => {
  store.contactFilter.search = searchTerm.value
  await store.getContactList()
}, 500))

const handleTagFilter = (tagId: number) => {
  console.log(contactFilter.value.tagIds, tagId)
  if (contactFilter.value.tagIds.includes(tagId)) {
    contactFilter.value.tagIds = contactFilter.value.tagIds.filter(id => id !== tagId)
  } else {
    contactFilter.value.tagIds.push(tagId)
  }
}

const handleSourceFilter = (sourceId: number) => {
  console.log(contactFilter.value.sourceIds, sourceId)
  if (contactFilter.value.sourceIds.includes(sourceId)) {
    contactFilter.value.sourceIds = contactFilter.value.sourceIds.filter(id => id !== sourceId)
  } else {
    contactFilter.value.sourceIds.push(sourceId)
  }
}

const handleHideContacts = async () => {
  if (!store.contactFilter.isHidden) {
    if (selectedContacts.value.length === 0) {
      toast.error('Please select contacts to hide')
      return
    }
    const loadingToast = toast.loading('Hiding contacts')
    await hideContacts(selectedContacts.value)
    selectedContacts.value = []
    await store.getContactList()
    toast.remove(loadingToast)
    toast.success('Hide contacts successfully')
  } else {
    if (selectedContacts.value.length === 0) {
      toast.error('Please select contacts to restore')
      return
    }
    const loadingToast = toast.loading('Restoring these contacts')
    await unHideContacts(selectedContacts.value)
    selectedContacts.value = []
    await store.getContactList()
    toast.remove(loadingToast)
    toast.success('Restore contacts successfully')
  }
}

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
<div class="flex items-center justify-end gap-4 mb-0">
  <div class="font-bold text-2xl justify-self-start grow">{{store.contactFilter.isHidden ? 'Hidden contacts' : 'Contacts'}}</div>
  <div class="w-100">
    <label class="input input-bordered flex items-center gap-2">
      <MagnifyingGlassIcon class="size-6"/>
      <input type="text" class="grow"
             v-model="searchTerm"
             placeholder="Search..." />
    </label>
  </div>

  <div class="btn btn-primary" @click="() => {store.contactFilter.isHidden = !store.contactFilter.isHidden ; selectedContacts = []}">
    <EyeSlashIcon v-if="!store.contactFilter.isHidden" class="size-6" />
    <EyeIcon v-else class="size-6"/>
  </div>

  <div class="dropdown dropdown-bottom dropdown-end">
    <div class="btn btn-primary" tabindex="0" role="button">
      <WalletIcon class="size-6"/>Sources<ChevronDownIcon class="size-6"/>
    </div>
    <div tabindex="0" class="absolute z-[10] overflow-visible menu w-fit p-2 mt-3 shadow bg-base-100 rounded-md dropdown-content">

      <div class="max-h-56 overflow-y-auto overflow-x-hidden w-full">
        <div v-if="sources.length === 0" class="text-info text-center">No sources found</div>
<!--        <div class="tooltip tooltip-open tooltip-right before:break-words before:content-[attr(data-tip)] before:hidden hover:before:block after:hidden hover:after:block w-full cursor-pointer"-->
<!--             :data-tip="source.email || source.name"-->
<!--             v-for="source in sources"-->
<!--             :key="source.id">-->
          <div
            v-for="source in sources"
            :key="source.id"
            class="px-6 py-2 hover:bg-base-200 flex gap-4 items-center w-full rounded">
            <input :id="'source' + source.id" type="checkbox" class="checkbox" :value="source.id" @change="handleSourceFilter(source.id)" />
            <label :for="'source' + source.id" class="flex gap-4">
              <img v-if="source.type == SourceType.FACEBOOK" class="size-6" src="../../assets/facebook.svg" alt="">
              <img v-if="source.type == SourceType.GOOGLE" class="size-6" src="../../assets/gmail.svg" alt="">
              <span class="font-bold text-lg flex items-center">{{source.email || source.name}}</span>
            </label>
          </div>
<!--        </div>-->
      </div>
    </div>
  </div>

  <div class="dropdown  dropdown-bottom dropdown-end">
    <div class="btn btn-primary" tabindex="0" role="button">
      <TagIcon class="size-6"/>Labels<ChevronDownIcon class="size-6"/>
    </div>
    <div tabindex="0" class="absolute z-[10] overflow-visible menu w-52 p-2 mt-3 shadow bg-base-100 rounded-md dropdown-content">

      <div class="max-h-56 overflow-y-auto overflow-x-hidden">
        <div v-if="tags.length === 0" class="text-info text-center">No tags found</div>
        <div class="tooltip tooltip-open tooltip-right before:max-w-56 before:break-words before:content-[attr(data-tip)] before:hidden hover:before:block after:hidden hover:after:block w-full cursor-pointer"
             :data-tip="tag.name"
             v-for="tag in tags"
             :key="tag.id">
          <div class="px-4 py-2 hover:bg-base-200 flex gap-4 items-center justify-start rounded">
            <input :id="'tag' + tag.id" type="checkbox" class="checkbox" :value="tag.id" @change="handleTagFilter(tag.id)" />
            <label :for="'tag' + tag.id" class="size-6 rounded bg-[var(--bg-color)]" :style="{ '--bg-color': tag.color }"></label>
            <label :for="'tag' + tag.id" class="font-bold text-lg truncate">{{tag.name}}</label>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="btn btn-info mr-8" v-if="!store.contactFilter.isHidden" @click="openModal">
    <UserPlusIcon class="h-6 w-6" />
    New contact
  </div>

    <div class="btn btn-error" @click="handleHideContacts">
      <TrashIcon v-if="!store.contactFilter.isHidden" class="h-6 w-6" />
      <ArrowPathIcon v-else class="h-6 w-6" />
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