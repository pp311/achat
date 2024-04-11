<template>
  <footer class="footer footer-center h-min-full p-4 bg-base-300 text-base-content mt-44" :class="{hidden: isHidden}">
    <div>
      <p>Copyright © 2024 - All right reserved by Novle</p>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { useRoute } from 'vue-router'

const isHidden = ref(false)

// if route is /login or /register, hide the navbar
const route = useRoute()
watchEffect(() => {
  if (route.path === '/login' || route.path === '/register' || route.path === '/chat') {
    isHidden.value = true
  } else {
    isHidden.value = false
  }
})


</script>
