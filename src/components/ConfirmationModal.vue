<script setup lang="ts">
import { useGlobalStore } from '@/stores/global'
import { storeToRefs } from 'pinia'

const store = useGlobalStore()
const {confirmationModal} = storeToRefs(store)

</script>

<template>
  <dialog id="confirmation_modal" class="modal">
    <div class="modal-box">
      <h3 class="font-bold text-lg">{{confirmationModal?.title}}</h3>
      <form>
        <p class="pt-4">{{confirmationModal?.message}}</p>
        <div class="modal-action">
          <form method="dialog" class="flex gap-4">
            <!-- if there is a button in form, it will close the modal -->
            <button class="btn">Cancel</button>
            <button class="btn btn-primary" @click="confirmationModal?.action">Confirm</button>
          </form>
        </div>
      </form>
    </div>
  </dialog>
</template>

<style scoped>

</style>