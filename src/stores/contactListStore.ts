import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { ContactFilter } from '@/types/contact'
import { getContacts } from '@/services/contact.service'
import type { PagingModel } from '@/types/base'
import { ContactSortBy } from '@/types/enum'

export const useContactListStore = defineStore('contactList',  {
  state: () => ({
    contactFilter: ref<ContactFilter>({
      search: '',
      type: null,
      tagIds: [],
      sortBy: ContactSortBy.ID,
      isDescending: false,
    }),
    pagingInfo : ref<PagingModel>({
      pageNumber: 1,
      totalPages: 10,
      totalCount: 0,
      hasPreviousPage: false,
      hasNextPage: false,
    }),
  }),

  actions: {
    getContactList: async function() {
      const response = await getContacts(this.contactFilter, this.pagingInfo.pageNumber)

      this.pagingInfo.totalPages = response.totalPages
      this.pagingInfo.totalCount = response.totalCount
      this.pagingInfo.hasPreviousPage = response.hasPreviousPage
      this.pagingInfo.hasNextPage = response.hasNextPage

      return response.items
    }
  }
})
