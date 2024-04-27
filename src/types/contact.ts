import type { SourceType } from '@/types/enum'
import type { PagingModel } from '@/types/base'
import { ContactSortBy } from '@/types/enum'

export interface ContactList extends PagingModel {
  items: ContactListItem[];
}

export interface ContactListItem {
  id: number;
  name: string;
  email: string;
  avatarUrl: null | string;
  sourceType: SourceType;
  createdOn: Date;
  updatedOn: Date;
}

export interface ContactFilter {
  search: string;
  type: SourceType | null;
  tagIds: number[];
  sortBy: ContactSortBy | null;
  isDescending: boolean;
}