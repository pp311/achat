import ApiService from '@/services/api.service'
import type { Attachment, GmailThreadList, Message, UploadFacebookAttachmentResponse } from '@/types/message'
import qs from 'qs'


export async function getFacebookMessages(contactId : number, offsetId : number = 0, limit : number = 20) {
  return ApiService.axiosCallWithAuth<Message[]>({
    method: 'GET',
    url: '/messages/facebook',
    params: {
      contactId,
      pageNumber: offsetId,
      pageSize: limit
    }
  });
}

export async function sendFacebookMessage(message : string, contactId : number, attachment : UploadFacebookAttachmentResponse | null = null, errorHandler : Function | null = null) {
  return ApiService.axiosCallWithAuth<Message>({
    method: 'POST',
    url: `/messages/facebook`,
    data: {
      contactId,
      message,
      attachmentUrl : attachment ? attachment.url : null,
      attachmentType : attachment ? attachment.type : null
    }
  }, errorHandler);
}

export async function uploadFacebookAttachment(file : File) {
  const formData = new FormData();
  formData.append('file', file);
  return ApiService.axiosCallWithAuth<UploadFacebookAttachmentResponse>({
    method: 'POST',
    url: '/attachments/upload-facebook-attachment',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
}

export async function uploadGmailAttachment(files : File[]) {
  const formData = new FormData();
  for (let i = 0; i < files.length; i++) {
    formData.append('files', files[i]);
  }

  const urls = await ApiService.axiosCallWithAuth<string[]>({
    method: 'POST',
    url: '/attachments/upload-gmail-attachment',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });

  const response : Attachment[] = []
  for(let i = 0; i < urls.length; i++){
    const attachment : Attachment = {
      url: urls[i],
      fileName: files[i].name,
      type: ""
    }
    response.push(attachment);
  }

  return response
}

export async function getGmailThreads(contactId : number, pageNumber : number, pageSize : number | null = null) {
  return ApiService.axiosCallWithAuth<GmailThreadList>({
    method: 'GET',
    url: '/messages/gmail',
    params: {
      contactId,
      pageNumber: pageNumber,
      isDescending: true,
      pageSize: pageSize || 25
    }
  });
}

export async function getThreadMessages(threadId : string, contactId: number) {
  return ApiService.axiosCallWithAuth<Message[]>({
    method: 'GET',
    url: `/messages/gmail/contacts/${contactId}/threads/${threadId}`
  });
}

export async function sendGmailMessage(message : string, subject : string, contactId : number, replyMessageId : number | null = null, attachments : Attachment[] | null = null) {
  return ApiService.axiosCallWithAuth<Message>({
    method: 'POST',
    url: `/messages/gmail`,
    data: {
      contactId,
      message,
      subject,
      replyMessageId: replyMessageId || 0,
      attachments
    }
  });
}

export async function deleteGmailThread(contactId: number, threadIds: string[]){
  return ApiService.axiosCallWithAuth({
    method: 'DELETE',
    url: '/messages/gmail/threads',
    params: {
      threadIds,
      contactId
    },
    paramsSerializer: (params) => {
      return qs.stringify(params,{arrayFormat: "repeat"})
    }
  });
}