import type { PagingModel } from '@/types/base'

export interface Message {
  id: number;
  content: string;
  subject: string | null;
  mId: string;
  isEcho: boolean;
  contactId: number;
  userId: number;
  attachments: Attachment[];
  createdOn: string;
  updatedOn: string;
}

export interface Attachment {
  url: string;
  fileName: string;
  type: string;
}

export interface UploadFacebookAttachmentResponse {
  url: string;
  type: string;
}

export interface GmailThreadList extends PagingModel {
  items: GmailThreadInfo[]
}

export interface GmailThreadInfo {
  id: string;
  snippet: string;
  subject: string;
  createdOn: Date;
  isRead: boolean;
}