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
      sourceIds: filter.sourceIds,
      sortBy: filter.sortBy,
      isDescending: filter.isDescending,
      pageNumber,
      isHidden: filter.isHidden,
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

export async function addContact(email: string, sourceId: number) {
  return ApiService.axiosCallWithAuth<void>({
    method: 'POST',
    url: `/contacts/`,
    data: {
      email,
      sourceId
    }
  });
}

export async function setContactRefId(contactId: number, refId: number) {
  return ApiService.axiosCallWithAuth<void>({
    method: 'POST',
    url: `/contacts/${contactId}/ref/${refId}`,
  });

}

export async function hideContacts(contactIds: number[]) {
  return ApiService.axiosCallWithAuth<void>({
    method: 'POST',
    url: '/contacts/hide',
    data: {contactIds}
  });
}

export async function unHideContacts(contactIds: number[]) {
  return ApiService.axiosCallWithAuth<void>({
    method: 'POST',
    url: '/contacts/un-hide',
    data: {contactIds}
  });
}