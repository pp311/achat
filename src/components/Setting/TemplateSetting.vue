<script setup lang="ts">
import { XMarkIcon, PlusCircleIcon, PencilIcon } from '@heroicons/vue/24/solid'
import type {Template} from '@/types/template'
import * as TemplateApi from '@/services/template.service'
import { ref, watchEffect } from 'vue'
import { TemplateType } from '@/types/enum'
import { useGlobalStore } from '@/stores/global'

const templateList = ref<Template[]>([])
const globalStore = useGlobalStore()

watchEffect(async() =>{
  templateList.value = await TemplateApi.getTemplates()
})

const content = ref()

const updateTemplateModel = ref<{
  id: number | null,
  name: string | null
  content: string | null,
  oldContent: string | null
  oldName: string | null
  type: TemplateType | null
}>({
  id: null,
  name: null,
  content: null,
  oldContent: null,
  oldName: null,
  type: null
})

const saveNote = async () => {
  if (updateTemplateModel.value?.id == null
    && updateTemplateModel.value?.name != null
    && updateTemplateModel.value?.type != null
    && updateTemplateModel.value?.content != null) {
    await TemplateApi.createTemplate(updateTemplateModel.value.name, updateTemplateModel.value.content, updateTemplateModel.value.type)
  } else {
    await TemplateApi.updateTemplate(
      updateTemplateModel.value.id as number,
      updateTemplateModel.value?.name as string,
      updateTemplateModel.value?.content as string,
    )
  }
  updateTemplateModel.value = { id: null, content: null, oldContent: null, name: null, oldName: null, type: null }
  templateList.value = await TemplateApi.getTemplates()
}

const deleteTemplateHandler = async (templateId: number) => {
  globalStore.confirmationModal = {
    title: 'Delete Template',
    message: 'Are you sure you want to delete this template? This action cannot be undone.',
    action: async () => {
      templateList.value = templateList.value.filter(template => template.id !== templateId)
      await TemplateApi.deleteTemplate(templateId)
    }
  }

  const modal = document.getElementById('confirmation_modal') as HTMLDialogElement
  modal.showModal()
}

const openModal = (template: Template | null = null, elementId: string = 'add_note') => {
  if (template == null)
    updateTemplateModel.value = { id: null, content: null, oldContent: null, name: null, oldName: null, type: elementId === 'add_note' ? TemplateType.MESSAGE : TemplateType.EMAIL}
  else
    updateTemplateModel.value = { id: template.id, content: template.content, oldContent: template.content, name: template.name, oldName: template.name, type: template.type }

  const modal = document.getElementById(elementId) as HTMLDialogElement
  modal.showModal()
}

watchEffect(() => {
  updateTemplateModel.value.content = content.value
})

</script>

<template>
<div class="flex items-center justify-between mb-8">

  <h2 class="text-2xl font-bold">Message templates</h2>
  <div class="gap-8 flex">
    <div class="btn btn-primary" @click="openModal(null)">
      <PlusCircleIcon class="size-6"/>
      Add Message Template
    </div>
  </div>
</div>

  <div class="flex flex-wrap gap-4 justify-start ">
    <div
      :key="template.id"
      v-for="template in templateList.filter(template => template.type === TemplateType.MESSAGE)"
      class="bg-base-200 border border-primary h-48 w-[32%] rounded-lg p-4">
      <div class="flex items-center justify-start text-gray-800 gap-2 mb-2">
        <div class="font-bold text-xl truncate">{{template.name}}</div>
        <button class="btn btn-xs btn-info rounded-full" @click="openModal(template)"><PencilIcon class="size-3"/></button>
        <XMarkIcon class="size-6 text-error cursor-pointer ml-auto hover:bg-red-300 rounded-full" @click="deleteTemplateHandler(template.id)"/>
      </div>
      <div class="line-clamp-6">{{template.content}}</div>
    </div>
</div>

  <!--  Add template modal-->
  <dialog id="add_note" class="modal">
    <div class="modal-box">
      <h3 class="font-bold text-lg">{{ updateTemplateModel?.id != null ? "Update Template" : "Add New Template" }}</h3>
      <form>
        <input class="input input-bordered mt-4 w-full" type="text" placeholder="Name" v-model="updateTemplateModel.name">
        <textarea class="py-4 w-full h-48 textarea textarea-bordered mt-4" v-model="updateTemplateModel.content"></textarea>
        <div class="modal-action">
          <form method="dialog" class="flex gap-4">
            <!-- if there is a button in form, it will close the modal -->
            <button class="btn">Close</button>
            <button class="btn btn-primary"
                    :disabled="updateTemplateModel.content === updateTemplateModel.oldContent
                    && updateTemplateModel.name === updateTemplateModel.oldName
                    || ( updateTemplateModel.name === '' ||  updateTemplateModel.content === '' || updateTemplateModel.name === null || updateTemplateModel.content === null)"
                    @click="saveNote">Save</button>
          </form>
        </div>
      </form>
    </div>
  </dialog>

  <div class="divider my-12"></div>

  <div class="flex items-center justify-between mb-8">

    <h2 class="text-2xl font-bold">Email templates</h2>
    <div class="gap-8 flex">
      <div class="btn btn-primary" @click="openModal(null, 'add_note2')">
        <PlusCircleIcon class="size-6"/>
        Add Email Template
      </div>
    </div>
  </div>

  <div class="flex flex-wrap gap-4 justify-start ">
    <div
      :key="template.id"
      v-for="template in templateList.filter(template => template.type === TemplateType.EMAIL)"
      class="bg-base-200 border border-primary h-48 w-[32%] rounded-lg p-4">
      <div class="flex items-center justify-start text-gray-800 gap-2 mb-2">
        <div class="font-bold text-xl truncate">{{template.name}}</div>
        <button class="btn btn-xs btn-info rounded-full" @click="openModal(template, 'add_note2')"><PencilIcon class="size-3"/></button>
        <XMarkIcon class="size-6 text-error cursor-pointer ml-auto hover:bg-red-300 rounded-full" @click="deleteTemplateHandler(template.id)"/>
      </div>
      <div v-html="template.content"></div>
    </div>
  </div>

  <!--  Add rich text modal-->
  <dialog id="add_note2" class="modal">
    <div class="modal-box">
      <h3 class="font-bold text-lg">{{ updateTemplateModel?.id != null ? "Update Template" : "Add New Template" }}</h3>
      <form>
        <input class="input input-bordered my-4 w-full" type="text" placeholder="Name" v-model="updateTemplateModel.name">
        <div class="border rounded-lg bg-base-200">
          <QuillEditor
            v-model:content="content"
            ref="editor"
            content-type="html"
            style="height: 150px;" />
        </div>
        <div class="modal-action">
          <form method="dialog" class="flex gap-4">
            <!-- if there is a button in form, it will close the modal -->
            <button class="btn">Close</button>
            <button class="btn btn-primary"
                    :disabled="updateTemplateModel.content === updateTemplateModel.oldContent
                    && updateTemplateModel.name === updateTemplateModel.oldName
                    || ( updateTemplateModel.name === '' ||  updateTemplateModel.content === '<p><br></p>' || updateTemplateModel.name === null || updateTemplateModel.content === null)"
                    @click="saveNote">Save</button>
          </form>
        </div>
      </form>
    </div>
  </dialog>
</template>

<style scoped>

</style>