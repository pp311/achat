import ApiService from '@/services/api.service'
import type { ContactFilter, ContactList, ContactInfo } from '@/types/contact'
import qs from 'qs'


export async function getContacts(filter: ContactFilter, pageNumber: number, pageSize: number | null = null) {
  return ApiService.axiosCallWithAuth<ContactList>({
    method: 'GET',
    url: '/contacts',
    params: {
      search: filter.search,
      type: filter.type,
      tagIds: filter.tagIds,
      sortBy: filter.sortBy,
      pageNumber,
      pageSize: pageSize || 10
    },
    paramsSerializer: (params) => {
      return qs.stringify(params,{arrayFormat: "repeat"})
    }
  });
}

export async function getContact(id: number) {
  return ApiService.axiosCallWithAuth<ContactInfo>({
    method: 'GET',
    url: `/contacts/${id}`
  });
}