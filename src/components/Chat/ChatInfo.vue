<script setup lang="ts">
import TagList from '@/components/Chat/TagList.vue'
import ChatContactInfo from '@/components/Chat/ChatContactInfo.vue'
import Collapse from '@/components/Collapse.vue'
import { IdentificationIcon, TagIcon, DocumentIcon } from '@heroicons/vue/24/solid'
import ChatNote from '@/components/Chat/ChatNote.vue'
</script>

<template>
<div class="w-[25%] bg-base-200 overflow-auto">

  <Collapse title="Contact Info">
    <template #title><IdentificationIcon class="size-6 bold mr-2"/>Contact Info</template>
    <ChatContactInfo/>
  </Collapse>

  <Collapse title="Labels">
    <template #title><TagIcon class="size-6 bold mr-2"/>Labels</template>
    <TagList/>
  </Collapse>

  <Collapse title="Labels">
    <template #title><DocumentIcon class="size-6 bold mr-2"/>Notes</template>
    <ChatNote/>
  </Collapse>


</div>
</template>
