import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getFacebookMessages, sendFacebookMessage } from '@/services/message.service'
import type { Message, UploadFacebookAttachmentResponse } from '@/types/message'

export const useMessageStore = defineStore('message',  {
  state: () => ({
    messages: ref<Message[]>([]),
    isLastMessage: ref<boolean>(false),
    contactId: ref<number>(0),
    isSending: ref<boolean>(false),
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
      this.messages = [...response, ...this.messages];
    },

    sendFacebookMessage: async function(message: string,  attachment : UploadFacebookAttachmentResponse | null = null, errorHandler : null | Function = null){
      await sendFacebookMessage(message, this.contactId, attachment, errorHandler);
    }
  },

})
