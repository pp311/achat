import ApiService from '@/services/api.service'
import type { ContactFilter, ContactList } from '@/types/contact'


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
      pageSize
    }
  });
}