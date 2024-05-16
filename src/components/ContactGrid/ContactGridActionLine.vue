<script setup lang="ts">
import { TrashIcon, TagIcon, UserIcon, ChevronDownIcon } from '@heroicons/vue/24/solid'
import Search from '@/components/Search.vue'
import { addTagToContact, createTag, getContactTags, getTags, removeTagFromContact } from '@/services/tag.service'
import { useContactListStore } from '@/stores/contactListStore'
import { ref, watchEffect } from 'vue'
import { storeToRefs } from 'pinia'
import type { Tag, TagFilter } from '@/types/tag'

const store = useContactListStore()
const tags = ref<Tag[]>([])
const { contactFilter } = storeToRefs(store)

const filter = ref<TagFilter>({
  search: '',
  pageNumber: 1,
  sortBy: null,
  isDescending: false,
})

watchEffect(async () => {
  tags.value = (await getTags(filter.value, [],100000)).items
})

const handleTagFilter = (tagId: number) => {
  console.log(contactFilter.value.tagIds, tagId)
  if (contactFilter.value.tagIds.includes(tagId)) {
    contactFilter.value.tagIds = contactFilter.value.tagIds.filter(id => id !== tagId)
  } else {
    contactFilter.value.tagIds.push(tagId)
  }
}

</script>

<template>
<div class="flex items-center justify-end gap-4 mb-4">
  <div class="w-100">
    <Search
      :handle-search="(searchValue: string) => contactFilter.search = searchValue"
    />
  </div>

  <div class="dropdown  dropdown-bottom dropdown-end">
    <div class="btn btn-primary" tabindex="0" role="button">
      <TagIcon class="size-6"/>Labels<ChevronDownIcon class="size-6"/>
    </div>
    <div tabindex="0" class="absolute z-[10] overflow-visible menu w-52 p-2 shadow bg-base-100 rounded-md dropdown-content">

      <div class="max-h-56 overflow-y-scroll overflow-x-hidden">
        <div v-if="tags.length === 0" class="text-info text-center">No tags found</div>
        <div class="tooltip tooltip-open tooltip-right before:max-w-56 before:break-words before:content-[attr(data-tip)] before:hidden hover:before:block after:hidden hover:after:block w-full cursor-pointer"
             :data-tip="tag.name"
             v-for="tag in tags"
             :key="tag.id">
          <div class="px-4 py-2 hover:bg-base-200 flex gap-4 items-center justify-start rounded">
            <input type="checkbox" class="checkbox" :value="tag.id" @change="handleTagFilter(tag.id)" />
            <div class="size-6 rounded bg-[var(--bg-color)]" :style="{ '--bg-color': tag.color }"></div>
            <p class="font-bold text-lg truncate">{{tag.name}}</p>
          </div>
        </div>
      </div>

    </div>
  </div>

    <div class="btn btn-error"> <TrashIcon class="h-6 w-6" /></div>
  </div>
</template>

<style scoped>

</style>