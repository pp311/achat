<script setup lang="ts">

import ChatSideBar from '@/components/Chat/ChatSideBar.vue'
import ChatBox from '@/components/Chat/ChatBox.vue'
import ChatInfo from '@/components/Chat/ChatInfo.vue'
</script>

<template>
  <div class="w-full flex flex-row h-[calc(100vh-72px)] overflow-hidden overscroll-contain">
    <ChatSideBar/>

    <ChatBox/>
    <ChatInfo/>

  </div>
</template>

<style scoped>

</style>