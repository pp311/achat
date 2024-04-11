<script setup lang="ts">

</script>

<template>

  <div>
    <div class="chat chat-start">
      <div class="chat-bubble chat-bubble-info">It's over Anakin, <br/>I have the high ground.</div>
    </div>
    <div class="chat chat-end">
      <div class="chat-bubble  chat-bubble-info">You underestimate my power!</div>
    </div>
    <div class="chat chat-start">
      <div class="chat-bubble chat-bubble-info">It's over Anakin, <br/>I have the high ground.</div>
    </div>
    <div class="chat chat-start" v-for="i in 100">
      <div class="chat-bubble chat-bubble-info">It's over Anakin, <br/>I have the high ground.</div>
    </div>
  </div>
</template>

<style scoped>

</style>