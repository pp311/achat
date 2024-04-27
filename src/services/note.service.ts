import ApiService from '@/services/api.service'
import type { Note } from '@/types/note'


export async function getNotes(contactId : number) {
  return ApiService.axiosCallWithAuth<Note[]>({
    method: 'GET',
    url: '/notes',
    params: {
      contactId
    }
  });
}

export async function createNote(contactId: number, content: string) {
  return ApiService.axiosCallWithAuth<Note>({
    method: 'POST',
    url: '/notes',
    data: {
      contactId,
      content
    }
  });
}

export async function updateNote(noteId: number, content: string, contactId : number) {
  return ApiService.axiosCallWithAuth<Note>({
    method: 'PUT',
    url: `/notes/${noteId}`,
    data: {
      content,
      contactId
    }
  });
}

export async function deleteNote (noteId: number) {
  return ApiService.axiosCallWithAuth<Note>({
    method: 'DELETE',
    url: `/notes/${noteId}`
  });
}
