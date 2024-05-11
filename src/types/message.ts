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
  isLoading: boolean;
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