import ApiService from '@/services/api.service'
import type { Message, UploadFacebookAttachmentResponse } from '@/types/message'


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