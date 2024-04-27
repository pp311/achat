import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { ContactFilter, ContactList, ContactListItem } from '@/types/contact'
import { getContacts } from '@/services/contact.service'
import type { PagingModel } from '@/types/base'

export const useContactListStore = defineStore('contactList',  {
  state: () => ({
    pagingInfo : ref<PagingModel>({
      pageNumber: 1,
      totalPages: 10,
      totalCount: 0,
      hasPreviousPage: false,
      hasNextPage: false,
    }),
  }),

  actions: {
    getContactList: async function(filter: ContactFilter) {
      const response = await getContacts(filter, this.pagingInfo.pageNumber)

      this.pagingInfo.totalPages = response.totalPages
      this.pagingInfo.totalCount = response.totalCount
      this.pagingInfo.hasPreviousPage = response.hasPreviousPage
      this.pagingInfo.hasNextPage = response.hasNextPage

      return response.items
    }
  }
})
