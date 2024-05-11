<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import type { ContactFilter, ContactListItem } from '@/types/contact'
import { useContactListStore } from '@/stores/contactListStore'
import { ContactSortBy, SourceType } from '@/types/enum'
import { UserCircleIcon } from '@heroicons/vue/24/solid'

const filter = ref<ContactFilter>({
  search: '',
  type: null,
  tagIds: [],
  sortBy: ContactSortBy.ID,
  isDescending: false,
})

const isLoading = ref(false)

const contactItems = ref<ContactListItem[]>([])

const store = useContactListStore()

watchEffect(async () => {
  isLoading.value = true
  contactItems.value = await store.getContactList(filter.value)
  isLoading.value = false
})

</script>

<template>
  <div class="overflow-x-auto">
    <table class="table table-zebra">
      <thead>
      <tr>
        <th>
          <label>
            <input type="checkbox" class="checkbox" />
          </label>
        </th>
        <th class="font-bold text-lg">Name/Email</th>
        <th class="font-bold text-lg">Source type</th>
        <th class="font-bold text-lg">Added Date</th>
        <th></th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="contact in contactItems" :key="contact.id">
        <th>
          <label>
            <input type="checkbox" class="checkbox" />
          </label>
        </th>
        <td>
          <div class="flex items-center gap-3">
            <div class="avatar">
              <div class="mask mask-squircle w-12 h-12">
                <img v-if="contact.avatarUrl" :src="contact.avatarUrl" alt="" />
                <UserCircleIcon v-else class="size-10" />
              </div>
            </div>
            <div>
              <div class="font-bold text-lg">{{contact.name}}</div>
            </div>
          </div>
        </td>
        <td>
          <div class="size-8">
            <img v-if="contact.sourceType == SourceType.FACEBOOK" src="../../assets/facebook.svg">
            <img v-if="contact.sourceType == SourceType.GOOGLE" src="../../assets/gmail.svg">
          </div>
        </td>
        <td>15:46 12-12-2024</td>
        <th>
          <RouterLink :to="'/chat/' + contact.sourceType.toLowerCase() + '/' + contact.id">
            <button class="btn btn-ghost btn-xs">Chat now</button>
          </RouterLink>
        </th>
      </tr>

<!--      Loading-->
      <template v-if="isLoading" >
        <tr v-for="i in 3" :key="i">
          <td v-for="j in 5" :key="j">
            <div class="skeleton h-10 w-full"></div>
          </td>
        </tr>
      </template>
      </tbody>
    </table>
    </div>
</template>

<style scoped>

</style>
