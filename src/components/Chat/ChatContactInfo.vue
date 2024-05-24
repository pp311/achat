<script setup lang="ts">

import { PencilIcon } from '@heroicons/vue/24/solid'
import { useMessageStore } from '@/stores/messageStore'
import { storeToRefs } from 'pinia'
import moment from 'moment'
import { useRoute } from 'vue-router'
import { watch } from 'vue'

const store = useMessageStore()

const {contactInfo} = storeToRefs(store)

// const route = useRoute()
//
// const contactId = parseInt(route.params.id as string)
//
// watch(() => contactId, async() => {
//   await store.getContact(contactId)
// })
</script>

<template>
  <div v-if="contactInfo?.name" class="flex flex-row items-center font-bold text-lg mb-1 group">
    <label class="w-[40%]" for="fullname">Name:</label>
    <span class="text-left">{{contactInfo.name}}</span>
    <button class="ml-2 group-hover:block hidden"><PencilIcon class="size-6 text-info"/></button>
    <!--          <input type="text" id="fullname" value="Doan Du" class="input w-full" />-->
  </div>

  <div v-if="contactInfo?.email" class="flex flex-row items-center font-bold text-lg mb-1">
    <label class="w-[40%]" for="email">Email:</label>
    <span class="text-left">{{contactInfo.email}}</span>
  </div>

<!--  <div class="flex flex-row items-center font-bold text-lg mb-1">-->
<!--    <label class="w-[40%]" for="phone">Phone:</label>-->
<!--    <span class="text-left">01512498871</span>-->
<!--  </div>-->

  <div v-if="contactInfo?.createdOn" class="flex flex-row items-center font-bold text-lg mb-1">
    <label class="w-[40%]" for="first-contact-on">First contact date:</label>
    <span class="text-left">
          {{new Date(moment.utc(contactInfo.createdOn).toLocaleString()).toLocaleString('vi-VN').split(' ')[1] }}
    </span>
  </div>

  <div v-if="contactInfo?.sourceName" class="flex flex-row items-center font-bold text-lg mb-1">
    <label class="w-[40%]" for="first-contact-on">Source name:</label>
    <span class="text-left">
      {{contactInfo.sourceName}}
    </span>
  </div>

  <div v-if="contactInfo?.sourceEmail" class="flex flex-row items-center font-bold text-lg mb-1">
    <label class="w-[40%]" for="first-contact-on">Source email:</label>
    <span class="text-left">
      {{contactInfo.sourceEmail}}
    </span>
  </div>

<!--  <div class="flex flex-row items-center font-bold text-lg mb-1">-->
<!--    <label class="w-[40%]" for="gender">Gender:</label>-->
<!--    <select class="select select-sm">-->
<!--      <option selected>Unknown</option>-->
<!--      <option>Male</option>-->
<!--      <option>Female</option>-->
<!--      <option>Other</option>-->
<!--    </select>-->
<!--  </div>-->
</template>

<style scoped>

</style>