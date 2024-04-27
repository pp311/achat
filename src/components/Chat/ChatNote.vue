<script setup lang="ts">
import { PlusCircleIcon, XMarkIcon, PencilIcon } from '@heroicons/vue/24/solid'
import { ref, watchEffect } from 'vue'
import type { Note } from '@/types/note'
import { getNotes, deleteNote, createNote, updateNote } from '@/services/note.service'
import { useRoute } from 'vue-router'
import { useGlobalStore } from '@/stores/global'

const notes = ref<Note[]>([])
const route = useRoute()
const contactId = parseInt(route.params.id as string)
const globalStore = useGlobalStore()

watchEffect(async () => {
  notes.value = await getNotes(contactId)
})

const deleteNoteHandler = async (noteId: number) => {
  globalStore.confirmationModal = {
    title: 'Delete Note',
    message: 'Are you sure you want to delete this note? This action cannot be undone.',
    action: async () => {
      notes.value = notes.value.filter(note => note.id !== noteId)
      await deleteNote(noteId)
    }
  }

  const modal = document.getElementById('confirmation_modal') as HTMLDialogElement
  modal.showModal()
}

const updateNoteModel = ref<{
  id: number | null,
  content: string | null,
}>({
  id: null,
  content: null,
})

const openModal = (id : number | null = null, content : string | null = null) => {
  if (id == null)
    updateNoteModel.value.content = null
  else
    updateNoteModel.value = { id, content }

  const modal = document.getElementById('add_note') as HTMLDialogElement
  modal.showModal()
}

const saveNote = async () => {
  if (updateNoteModel.value?.id == null) {
    await createNote(
      contactId,
      updateNoteModel.value?.content as string
    )
  } else {
    await updateNote(
      updateNoteModel.value.id as number,
      updateNoteModel.value?.content as string,
      contactId
    )
  }
  updateNoteModel.value = { id: null, content: null }
  notes.value = await getNotes(contactId)
}
</script>

<template>
  <span class="btn btn-outline btn-primary btn-sm mb-4"  @click="openModal()">
    <PlusCircleIcon class="size-6 mr-2"/>Add note</span>

  <div v-for="note in notes" :key="note.id"
    class="w-full flex flex-col justify-between bg-base-300 rounded-lg mb-2 pt-5 px-4 border border-primary">
      <div class="flex items-center justify-start text-gray-800 gap-2">
        <p class="text-sm text-base-content font-bold">{{ new Date(note.updatedOn.toLocaleString()).toLocaleString("vi-VN") }}</p>
        <button class="btn btn-xs btn-info rounded-full" @click="openModal(note.id, note.content)"><PencilIcon class="size-3"/></button>
        <XMarkIcon class="size-6 text-error cursor-pointer ml-auto hover:bg-red-300 rounded-full" @click="deleteNoteHandler(note.id)"/>
      </div>
    <p class="text-sm text-base-content my-4">{{ note.content }}</p>
  </div>

<!--  Add note modal-->
  <dialog id="add_note" class="modal">
    <div class="modal-box">
      <h3 class="font-bold text-lg">{{updateNoteModel?.id != null ? "Update Note" : "Add New Note"}}</h3>
      <form>
        <textarea class="py-4 w-full textarea textarea-bordered mt-4" v-model="updateNoteModel.content"></textarea>
          <div class="modal-action">
            <form method="dialog" class="flex gap-4">
              <!-- if there is a button in form, it will close the modal -->
              <button class="btn">Close</button>
              <button class="btn btn-primary" @click="saveNote">Save</button>
            </form>
        </div>
      </form>
    </div>
  </dialog>



</template>