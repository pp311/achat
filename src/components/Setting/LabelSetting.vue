<script setup lang="ts">
import Pagination from '@/components/Pagination.vue'
import { ref, watchEffect } from 'vue'
import type { Tag, TagFilter, TagList } from '@/types/tag'
import { getTags, deleteTag, createTag } from '@/services/tag.service'
import Search from '@/components/Search.vue'
import { useGlobalStore } from '@/stores/global'
import { PlusCircleIcon } from '@heroicons/vue/24/solid'
import { toast } from 'vue3-toastify';

const tagList = ref<TagList>({} as TagList)
const globalStore = useGlobalStore()

const filter = ref<TagFilter>({
  search: '',
  pageNumber: 1,
  sortBy: null,
  isDescending: false,
})

const isLoading = ref(false)

watchEffect(async () => {
  isLoading.value = true
  tagList.value = {} as TagList
  tagList.value = await getTags(filter.value)
  isLoading.value = false
})

const deleteTagHandler = async (tagId: number) => {
  globalStore.confirmationModal = {
    title: 'Delete Tag',
    message: 'Are you sure you want to delete this tag? This action cannot be undone.',
    action: async () => {
      tagList.value = {} as TagList
      isLoading.value = true
      await deleteTag(tagId)
      tagList.value = await getTags(filter.value)
      isLoading.value = false
    }
  }

  const modal = document.getElementById('confirmation_modal') as HTMLDialogElement
  modal.showModal()
}

const addTagName = ref<string>("")

const openModal = () => {
  const modal = document.getElementById('add_tag') as HTMLDialogElement
  modal.showModal()
}

const addTagHandler = async () => {
  if (addTagName.value === "") {
    toast.error("Tag name is required")
    return
  }

  tagList.value = {} as TagList
  isLoading.value = true
  try {
    await createTag(addTagName.value)
    toast.success("Tag created successfully")
  } catch {
    toast.error("Tag name is already existed")
  } finally {
    tagList.value = await getTags(filter.value)
    isLoading.value = false
    addTagName.value = ""
  }
}

</script>

<template>
  <div class="w-[40%] ml-auto flex gap-8 items-center">
    <button class="btn btn-primary" @click="openModal"><PlusCircleIcon class="size-6"/>Add Tag</button>
    <Search
      :handle-search="(searchValue: string) => filter.search = searchValue"
    />
  </div>
  <div class="overflow-x-auto mt-4">
    <table class="table table-zebra">
      <!-- head -->
      <thead>
      <tr>
        <th class="text-lg font-bold">Index</th>
        <th class="text-lg font-bold">Name</th>
        <th class="text-lg font-bold">Color</th>
        <th class="text-lg font-bold">Action</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(tag, idx) in tagList.items" :key="tag.id">
        <th>{{(tagList.pageNumber - 1) * 10 + idx + 1}}</th>
        <td>{{tag.name}}</td>
        <td class="flex gap-4 items-center">
          <div class="size-8 rounded bg-[var(--bg-color)]"
               :style="{ '--bg-color': tag.color }">
          </div>
          <p>{{tag.color}}</p>
        </td>
        <td>
          <div class="font-bold text-sm btn btn-sm btn-error"
               @click="deleteTagHandler(tag.id)">Delete</div>
        </td>
      </tr>

      <!--      Loading-->
      <template v-if="isLoading" >
        <tr v-for="i in 3" :key="i">
          <td v-for="j in 4" :key="j">
            <div class="skeleton h-10 w-full"></div>
          </td>
        </tr>
      </template>
      </tbody>
    </table>
  </div>

  <Pagination
    v-show="!isLoading"
    :pageNumber="tagList.pageNumber"
    :totalPages="tagList.totalPages"
    :totalCount="tagList.totalCount"
    :hasPreviousPage="tagList.hasPreviousPage"
    :hasNextPage="tagList.hasNextPage"
    :handlePageChange="(pageNumber: number) => filter.pageNumber = pageNumber"
  />

  <!--  Add tag modal-->
  <dialog id="add_tag" class="modal">
    <div class="modal-box">
      <h3 class="font-bold text-lg">Add New Tag</h3>
      <form>
        <input class="py-4 w-full textarea textarea-bordered mt-4" placeholder="Tag name..." v-model="addTagName">
        <div class="modal-action">
          <form method="dialog" class="flex gap-4">
            <!-- if there is a button in form, it will close the modal -->
            <button class="btn">Close</button>
            <button class="btn btn-primary" @click="addTagHandler">Save</button>
          </form>
        </div>
      </form>
    </div>
  </dialog>
</template>

<style scoped>

</style>