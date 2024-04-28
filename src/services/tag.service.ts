import ApiService from '@/services/api.service'
import type { Tag, TagFilter, TagList } from '@/types/tag'
import qs from 'qs'
import { TagSortBy } from '@/types/enum'


export async function getTags(filter : TagFilter, excludeIds : number[] = [], pageSize: number | null = null) {
  return ApiService.axiosCallWithAuth<TagList>({
    method: 'GET',
    url: '/tags',
    params: {
      search: filter.search,
      sortBy: filter.sortBy || TagSortBy.ID,
      isDescending: filter.isDescending,
      pageNumber: filter.pageNumber,
      pageSize,
      excludeIds
    },
    paramsSerializer: (params) => {
      return qs.stringify(params,{arrayFormat: "repeat"})
    }
  });
}

export async function createTag(name: string, color: string = "") : Promise<number> {
  return ApiService.axiosCallWithAuth<number>({
    method: 'POST',
    url: '/tags',
    params: {
      name,
      color
    }
  },
    );
}

// export async function updateTag(tagId: number, name: string, color: string) {
//   return ApiService.axiosCallWithAuth<Tag>({
//     method: 'PUT',
//     url: `/tags/${tagId}`,
//     data: {
//       name,
//       color
//     }
//   });
// }

export async function deleteTag(tagId: number) {
  return ApiService.axiosCallWithAuth<Tag>({
    method: 'DELETE',
    url: `/tags/${tagId}`
  });
}

export async function getContactTags(contactId: number) {
  return ApiService.axiosCallWithAuth<Tag[]>({
    method: 'GET',
    url: `tags/contact/${contactId}`
  });
}

export async function addTagToContact(contactId: number, tagId: number) {
  return ApiService.axiosCallWithAuth<Tag>({
    method: 'POST',
    url: `tags/${tagId}/contact/${contactId}`,
  });
}

export async function removeTagFromContact(contactId: number, tagId: number) {
  return ApiService.axiosCallWithAuth<Tag>({
    method: 'DELETE',
    url: `tags/${tagId}/contact/${contactId}`,
  });
}