import ApiService from '@/services/api.service'
import type { Tag, TagFilter, TagList } from '@/types/tag'


export async function getTags(filter : TagFilter, pageSize: number | null = null) {
  return ApiService.axiosCallWithAuth<TagList>({
    method: 'GET',
    url: '/tags',
    params: {
      search: filter.search,
      sortBy: filter.sortBy,
      isDescending: filter.isDescending,
      pageNumber: filter.pageNumber,
      pageSize
    }
  });
}

export async function createTag(name: string, color: string = "") {
  return ApiService.axiosCallWithAuth<Tag>({
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