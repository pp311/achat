<script setup lang="ts">
import { XMarkIcon, PlusCircleIcon } from '@heroicons/vue/24/solid'
import { ref, watch, watchEffect } from 'vue'
import type { Tag, TagFilter, TagList } from '@/types/tag'
import { addTagToContact, createTag, getContactTags, getTags, removeTagFromContact } from '@/services/tag.service'
import debounce from 'lodash.debounce'
import { toast } from 'vue3-toastify'
import { useRoute } from 'vue-router'

const filter = ref<TagFilter>({
  search: '',
  pageNumber: 1,
  sortBy: null,
  isDescending: false,
})

const route = useRoute()
const contactId = parseInt(route.params.id as string)

const isDropDownLoading = ref(false)
const isLoading = ref(false)
const tags = ref<Tag[]>([])
const contactTags = ref<Tag[]>([])
const isFirstLoad = ref(false)
const searchTerm = ref('')

watch(() => route.params.id, async () => {
  isLoading.value = true
  isDropDownLoading.value = true
  const contactId = parseInt(route.params.id as string)
  contactTags.value = (await getContactTags(contactId))
  tags.value = (await getTags(filter.value, contactTags.value.map(ct => ct.id),100000)).items
  isLoading.value = false
  isDropDownLoading.value = false
}, {immediate: true})

watch(searchTerm, debounce(() => {
  filter.value.search = searchTerm.value
}, 1000))

watch(
  [filter, isFirstLoad],
  async () => {
  isDropDownLoading.value = true
  tags.value = []
  tags.value = (await getTags(filter.value, contactTags.value.map(ct => ct.id),100000)).items
  isDropDownLoading.value = false
}, { deep: true })

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

  isLoading.value = true
  try {
    let id = await createTag(addTagName.value, getRandomColor())
    await addTagToContact(contactId, id)
    toast.success("Tag created successfully")
  } catch {
    toast.error("Tag name is already existed")
  } finally {
    contactTags.value = (await getContactTags(contactId))
    isLoading.value = true
    addTagName.value = ""
  }
}

function getRandomColor() {
  const randomInt = (min : number, max : number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  let h = randomInt(0, 360);
  let s = randomInt(42, 98);
  let l = randomInt(40, 90);
  return `hsl(${h}, ${s}%, ${l}%)`;
}

const addTagToContactHandler = async (tagId: number) => {
  isLoading.value = true
  isDropDownLoading.value = true
  tags.value = []
  try {
    await addTagToContact(contactId, tagId)
    toast.success("Tag added successfully")
  } catch {
    toast.error("Tag is already existed")
  } finally {
    contactTags.value = (await getContactTags(contactId))
    tags.value = (await getTags(filter.value, contactTags.value.map(ct => ct.id),100000)).items
    isLoading.value = false
    isDropDownLoading.value = false
  }
}

const removeTagFromContactHandler = async (tagId: number) => {
  isLoading.value = true
  isFirstLoad.value = false
  try {
    await removeTagFromContact(contactId, tagId)
    toast.success("Tag removed successfully")
  } catch {
    toast.error("Tag is already removed")
  } finally {
    contactTags.value = (await getContactTags(contactId))
    isLoading.value = false
  }
}

</script>

<template>
  <div class="dropdown">
    <div class="btn btn-outline btn-primary btn-sm mb-4"
         tabindex="0"
         role="button"
         @click="() => !isFirstLoad ? isFirstLoad = true : null"
    >
      <PlusCircleIcon class="size-6 mr-2"/>Add label
    </div>
    <div tabindex="0" class="absolute z-[10] overflow-visible menu w-52 p-2 shadow bg-base-100 rounded-md dropdown-content">
      <input type="text"
             placeholder="Search..."
             v-model="searchTerm"
             class="input input-bordered w-full max-w-xs" />
      <div class="divider my-2"></div>
      <div class="max-h-56 overflow-y-auto overflow-x-hidden">
        <div v-if="tags.length === 0 && !isLoading" class="text-info text-center">No tags found</div>
        <div class="tooltip tooltip-open tooltip-right before:max-w-56 before:break-words before:content-[attr(data-tip)] before:hidden hover:before:block after:hidden hover:after:block w-full cursor-pointer"
             :data-tip="tag.name"
             v-for="tag in tags"
             @click="addTagToContactHandler(tag.id)"
             :key="tag.id">
          <div class="px-4 py-2 hover:bg-base-200 flex gap-4 items-center justify-start rounded">
            <div class="size-6 rounded bg-[var(--bg-color)]" :style="{ '--bg-color': tag.color }"></div>
            <p class="font-bold text-lg truncate">{{tag.name}}</p>
          </div>
      </div>
    </div>

      <template v-if="isDropDownLoading">
        <div class="w-full skeleton h-8 rounded-sm mb-2" v-for="i in 3" :key="i"></div>
      </template>

      <div class="divider my-2"></div>
      <div class="flex items-center font-bold px-4 py-2 cursor-pointer hover:bg-base-200 text-primary"
           @click="openModal">
        <PlusCircleIcon class="size-6 mr-2"/>Add new tag
      </div>
    </div>
  </div>

  <div class="flex flex-row gap-2 flex-wrap">
    <div class="badge font-bold badge-lg gap-2 text-gray-900 bg-[var(--bg-color)]"
         :style="{ '--bg-color': contactTag.color }"
         v-for="contactTag in contactTags" :key="contactTag.id">
      {{contactTag.name}}
      <XMarkIcon class="size-4 cursor-pointer hover:scale-150 hover:rotate-12" @click="removeTagFromContactHandler(contactTag.id)"/>
    </div>
  </div>

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