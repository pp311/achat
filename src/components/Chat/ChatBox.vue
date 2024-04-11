<script setup lang="ts">
import { PaperAirplaneIcon, PaperClipIcon, PhotoIcon } from '@heroicons/vue/24/solid'
import ChatMessageList from '@/components/Chat/ChatMessageList.vue'
</script>

<template>
  <div class="w-[55%] overflow-scroll bg-base-300 flex flex-col items-start px-4">
<!--HEADER-->
    <div class="flex items-start gap-2 max-h-20 pt-2">
      <div class="avatar">
        <div class="w-16 rounded-full">
          <img src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
        </div>
      </div>
      <div class="flex flex-col">
        <span class="font-bold text-md">Chatting with</span>
        <span class="font-bold text-2xl">Full Name</span>
      </div>
    </div>
    <div class="divider m-0.5"></div>

    <div class="w-full overflow-auto mb-4">
      <ChatMessageList/>
    </div>
<!--    INPUT-->
    <div class="w-full flex flex-row mt-auto mb-2">
      <label class="input input-bordered rounded-r-none flex items-center gap-2 w-full pr-0">
        <input type="text" class="grow" placeholder="Write your messages..." />
        <span class="btn bg-transparent border-none shadow-none rounded-full"><PhotoIcon class="size-4"/> </span>
        <span class="btn bg-transparent border-none shadow-none rounded-full"><PaperClipIcon class="size-4"/> </span>
      </label>
      <div class="btn btn-primary rounded-l-none">
        <PaperAirplaneIcon class="size-6"/>
      </div>
    </div>

  </div>
</template>

<style scoped>

</style>