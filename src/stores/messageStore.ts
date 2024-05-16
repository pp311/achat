import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getFacebookMessages, sendFacebookMessage } from '@/services/message.service'
import type { Message, UploadFacebookAttachmentResponse } from '@/types/message'
import type { ContactFilter, ContactInfo, ContactList } from '@/types/contact'
import { getContact, getContacts } from '@/services/contact.service'
import { ContactSortBy } from '@/types/enum'
import type { PagingModel } from '@/types/base'

export const useMessageStore = defineStore('message',  {
  state: () => ({
    messages: ref<Message[]>([]),
    isLastMessage: ref<boolean>(false),
    contactId: ref<number>(0),
    contactInfo: ref<ContactInfo | null>(null),
    isSending: ref<boolean>(false),
    loadingAttachments: ref<string[]>([]),
    isAllAttachmentsLoaded: ref<boolean>(true),

    contactFilter: ref<ContactFilter>({
      search: '',
      type: null,
      tagIds: [],
      sortBy: ContactSortBy.LAST_MESSAGE,
      isDescending: false,
    }),
    pagingInfo : ref<PagingModel>({
      pageNumber: 1,
      totalPages: 10,
      totalCount: 0,
      hasPreviousPage: false,
      hasNextPage: false,
    }),
    contactList: ref<ContactInfo[]>([])
  }),

  actions: {
    getFacebookMessages: async function(offsetId: number, contactId: number = 0) {
      if (contactId !== 0 && contactId !== this.contactId){
        this.contactId = contactId;
        this.messages = [];
      }
      const response = await getFacebookMessages(this.contactId, offsetId, 30);
      response.reverse()
      if (response.length < 30)
        this.isLastMessage = true;

      for(const message of response){
        if (message.attachments.length !== 0){
          if (message.attachments[0].type === 'image'){
            this.loadingAttachments.push(message.attachments[0].url);
          }
        }
        this.isAllAttachmentsLoaded = false
      }

      this.messages = [...response, ...this.messages];
    },

    getContact: async function (id: number) {
      if (this.contactInfo === null || this.contactInfo.id !== id) {
        this.contactInfo = null;
        this.contactInfo = await getContact(id)
      }
    },

    sendFacebookMessage: async function(message: string,  attachment : UploadFacebookAttachmentResponse | null = null, errorHandler : null | Function = null){
      await sendFacebookMessage(message, this.contactId, attachment, errorHandler);
    },

    getContactList: async function() {
      const response = await getContacts(this.contactFilter, this.pagingInfo.pageNumber, 50)

      this.pagingInfo.totalPages = response.totalPages
      this.pagingInfo.totalCount = response.totalCount
      this.pagingInfo.hasPreviousPage = response.hasPreviousPage
      this.pagingInfo.hasNextPage = response.hasNextPage

      this.contactList = response.items
    }
  },

})
