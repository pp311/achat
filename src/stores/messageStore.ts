import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  getFacebookMessages,
  getGmailThreads,
  getThreadMessages,
  sendFacebookMessage
} from '@/services/message.service'
import type { GmailThreadList, Message, UploadFacebookAttachmentResponse } from '@/types/message'
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
      isDescending: true,
    }),
    pagingInfo : ref<PagingModel>({
      pageNumber: 1,
      totalPages: 10,
      totalCount: 0,
      hasPreviousPage: false,
      hasNextPage: false,
    }),
    contactList: ref<ContactInfo[]>([]),

    threadList: ref<GmailThreadList | null>(null),
    threadPageSize: ref<number>(25),
    threadId: ref<string>(''),
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
      else
        this.isLastMessage = false;

      for(const message of response){
        if (this.messages.find(m => m.mId === message.mId))
          break

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
      if (this.contactInfo == null || this.contactInfo == undefined || this.contactInfo.id !== id) {
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
    },

    getGmailThreads: async function(contactId: number, pageNumber: number | null = null) {
      if (contactId !== 0 && contactId !== this.contactId){
        this.contactId = contactId;
        this.threadList = null;
      }
      this.threadList = await getGmailThreads(this.contactId, pageNumber || 1, this.threadPageSize)
    },

    getThreadMessages: async function(threadId: string) {
      this.messages = []
      this.threadId = threadId
      this.messages = await getThreadMessages(threadId, this.contactId)
    },
  },

})
