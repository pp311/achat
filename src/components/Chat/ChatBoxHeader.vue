<script setup lang="ts">

import { useMessageStore } from '@/stores/messageStore'
import { storeToRefs } from 'pinia'
import { UserCircleIcon } from '@heroicons/vue/24/solid'
import { SourceType } from '@/types/enum'

const store = useMessageStore()

const {contactInfo} = storeToRefs(store)
</script>

<template>
    <div class="flex flex-row items-center gap-2 max-h-16 py-1 w-full bg-base-200 px-4 mb-0 border-b border-gray-400">
        <div class="avatar">
            <div class="w-12 rounded-full">
              <img v-if="contactInfo?.avatarUrl" :src="contactInfo?.avatarUrl" alt="" />
              <UserCircleIcon v-else class="size-full" />
            </div>
        </div>

        <div class="flex flex-col">
            <span class="font-bold text-xs">Chatting with</span>
            <span class="font-bold text-xl">{{contactInfo?.name || contactInfo?.email}}</span>
        </div>

        <div class="ml-auto">
          <img v-if="contactInfo?.sourceType == SourceType.FACEBOOK" src="../../assets/facebook.svg" class="size-12">
          <img v-if="contactInfo?.sourceType == SourceType.GOOGLE" src="../../assets/gmail.svg"  class="size-12">
        </div>
    </div>

<!--    <div class="divider mt-0 mb-1"></div>-->

</template>

<style scoped></style>
