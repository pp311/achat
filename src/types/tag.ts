import type { PagingModel } from '@/types/base'
import type { TagSortBy } from '@/types/enum'

export interface Tag {
  id: number;
  name: string;
  color: string;
}

export interface TagList extends PagingModel {
  items: Tag[];
}

export interface TagFilter{
  search: string;
  sortBy: TagSortBy | null;
  isDescending: boolean;
  pageNumber: number;
}