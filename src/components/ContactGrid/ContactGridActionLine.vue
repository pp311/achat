<script setup lang="ts">
import { TrashIcon, TagIcon, WalletIcon, ChevronDownIcon, MagnifyingGlassIcon, EyeIcon, EyeSlashIcon, ArrowPathIcon } from '@heroicons/vue/24/solid'
import Search from '@/components/Search.vue'
import { addTagToContact, createTag, getContactTags, getTags, removeTagFromContact } from '@/services/tag.service'
import { useContactListStore } from '@/stores/contactListStore'
import { ref, watch, watchEffect } from 'vue'
import { storeToRefs } from 'pinia'
import type { Tag, TagFilter } from '@/types/tag'
import { useGlobalStore } from '@/stores/global'
import { SourceType } from '@/types/enum'
import debounce from 'lodash.debounce'
import { toast } from 'vue3-toastify'
import { hideContacts, unHideContacts } from '@/services/contact.service'

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


</script>

<template>
<div class="flex items-center justify-end gap-4 mb-4">
  <div class="font-bold text-2xl justify-self-start grow">{{store.contactFilter.isHidden ? 'Hidden contacts' : 'Contacts'}}</div>
  <div class="w-100">
    <label class="input input-bordered flex items-center gap-2">
      <MagnifyingGlassIcon class="size-6"/>
      <input type="text" class="grow"
             v-model="searchTerm"
             placeholder="Search..." />
    </label>
  </div>

  <div class="btn btn-primary">
    <EyeSlashIcon v-if="!store.contactFilter.isHidden" class="size-6" @click="() => {store.contactFilter.isHidden = true ; selectedContacts = []}"/>
    <EyeIcon v-else class="size-6" @click="() => {store.contactFilter.isHidden = false ; selectedContacts = []}"/>
  </div>

  <div class="dropdown dropdown-bottom dropdown-end">
    <div class="btn btn-primary" tabindex="0" role="button">
      <WalletIcon class="size-6"/>Sources<ChevronDownIcon class="size-6"/>
    </div>
    <div tabindex="0" class="absolute z-[10] overflow-visible menu w-fit p-2 mt-3 shadow bg-base-100 rounded-md dropdown-content">

      <div class="max-h-56 overflow-y-scroll overflow-x-hidden w-full">
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

      <div class="max-h-56 overflow-y-scroll overflow-x-hidden">
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

    <div class="btn btn-error" @click="handleHideContacts">
      <TrashIcon v-if="!store.contactFilter.isHidden" class="h-6 w-6" />
      <ArrowPathIcon v-else class="h-6 w-6" />
    </div>
  </div>
</template>

<style scoped>

</style>