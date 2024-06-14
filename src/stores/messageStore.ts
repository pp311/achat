import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  getFacebookMessages,
  getGmailThreads,
  getThreadMessages, markRead,
  sendFacebookMessage
} from '@/services/message.service'
import type { GmailThreadList, Message, UploadFacebookAttachmentResponse } from '@/types/message'
import type { ContactFilter, ContactInfo, ContactList } from '@/types/contact'
import { getContact, getContacts, setContactRefId } from '@/services/contact.service'
import { ContactSortBy } from '@/types/enum'
import type { PagingModel } from '@/types/base'

export const useMessageStore = defineStore('message',  {
  state: () => ({
    messages: ref<Message[]>([]),
    isLastMessage: ref<boolean>(false),
    contactId: ref<number>(0),
    contactInfo: ref<ContactInfo | null>(null),
    refContactInfo: ref<ContactInfo | null>(null),
    isSending: ref<boolean>(false),
    loadingAttachments: ref<string[]>([]),
    isAllAttachmentsLoaded: ref<boolean>(true),

    contactFilter: ref<ContactFilter>({
      search: '',
      type: null,
      tagIds: [],
      sourceIds: [],
      isHidden: false,
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
      this.isLastMessage = response.length < 30;

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

      if (this.messages.length > 0 && this.messages.some(m => m.isRead == false)){
        await markRead(contactId, 0)
        const contact = this.contactList.find(c => c.id === contactId)
        if (contact != undefined) {
          contact.isRead = true;
        }
      }
    },

    markRead: async function(contactId: number, messageId: number) {
      await markRead(contactId, messageId)
    },

    getContact: async function (id: number) {
      if (this.contactInfo == null || this.contactInfo == undefined || this.contactInfo.id !== id) {
        this.contactInfo = null;
        this.contactInfo = await getContact(id)

        if (this.contactInfo.refId != 0){
          this.refContactInfo = null;
          this.refContactInfo = await getContact(this.contactInfo.refId);
        }
        else {
          this.refContactInfo = null;
        }
      }
    },

    setRefContact: async function (refId: number) {
      await setContactRefId(this.contactId, refId)
      this.refContactInfo = null;
      if (refId != 0){
        this.refContactInfo = await getContact(refId);
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

      const thread = this.threadList?.items.find(t => t.id === threadId)
      if(thread)
        thread.isRead = true

      if (this.threadList?.items.every(t => t.isRead === true))
        this.contactList.find(c => c.id === this.contactId)!.isRead = true

      if (this.messages.length > 0 && this.messages[this.messages.length - 1].isRead === false) {
        await markRead(this.contactId, this.messages[this.messages.length - 1].id)
      }
    },
  },

})
