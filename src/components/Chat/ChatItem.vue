<script setup lang="ts">

import type { ContactInfo } from '@/types/contact'
import { SourceType } from '@/types/enum'
import type { PropType } from 'vue'
import { UserCircleIcon } from '@heroicons/vue/24/solid'
import { useRouter } from 'vue-router'
import {convert} from 'html-to-text'

const props = defineProps({
  contact: {
    type: Object as PropType<ContactInfo>,
    required: true
  }
});

const router = useRouter()

const handleContactClick = () => {
  router.replace(`/chat/${props.contact.id}`)
}

</script>

<template>

    <div @click="handleContactClick" class="flex flex-row py-4 gap-2 hover:bg-base-300 cursor-pointer rounded-xl">
        <div class="avatar relative">
            <div class="w-16 rounded-full">
              <img v-if="props.contact.avatarUrl" :src="props.contact.avatarUrl" alt="" />
              <UserCircleIcon v-else class="size-full block" />
            </div>
            <div class="absolute bottom-0 right-0 size-6">
              <img v-if="props.contact.sourceType == SourceType.FACEBOOK" src="../../assets/facebook.svg" class="size-12">
              <img v-if="props.contact.sourceType == SourceType.GOOGLE" src="../../assets/gmail.svg"  class="size-12">
            </div>
        </div>

        <div class="ml-2 overflow-x-hidden">
            <div class="font-bold mb-2 text-lg">{{props.contact.name || props.contact.email}}</div>
            <div class="text-sm line-clamp-1" :class="[props.contact?.isRead === true ? '' : 'font-bold']">{{convert(props.contact.lastMessage)}}</div>
        </div>
    </div>
    <div class="divider my-0"></div>
</template>

<style scoped></style>
