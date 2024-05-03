import ApiService from '@/services/api.service'
import type { Message } from '@/types/message'


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

export async function sendFacebookMessage(message : string, contactId : number) {
  return ApiService.axiosCallWithAuth<Message>({
    method: 'POST',
    url: `/messages/facebook`,
    data: {
      contactId,
      message
    }
  });
}
