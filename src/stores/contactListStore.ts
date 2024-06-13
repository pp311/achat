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
      sourceIds: [],
      sortBy: ContactSortBy.LAST_MESSAGE,
      isDescending: true,
      isHidden: false
    }),
    pagingInfo : ref<PagingModel>({
      pageNumber: 1,
      totalPages: 10,
      totalCount: 0,
      hasPreviousPage: false,
      hasNextPage: false,
    }),
    selectedContacts: ref<number[]>([]),
    lastedContactId: ref<number>(0)
  }),

  actions: {
    getContactList: async function() {
      const response = await getContacts(this.contactFilter, this.pagingInfo.pageNumber)

      this.pagingInfo.totalPages = response.totalPages
      this.pagingInfo.totalCount = response.totalCount
      this.pagingInfo.hasPreviousPage = response.hasPreviousPage
      this.pagingInfo.hasNextPage = response.hasNextPage

      this.lastedContactId = response.items.length > 0 ? response.items[0].id : 0

      return response.items
    }
  }
})
