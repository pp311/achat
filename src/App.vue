<script setup lang="ts">
import { RouterView } from 'vue-router'
import NavBar from './components/NavBar.vue'
import Footer from './components/Footer.vue'
import ConfirmationModal from '@/components/ConfirmationModal.vue'
</script>

<template>
<!--  <div class="h-screen">-->
    <header>
      <div class="wrapper">
        <nav>
          <NavBar />
          <!-- <RouterLink to="/">Home</RouterLink> -->
          <!-- <RouterLink to="/about">About</RouterLink> -->
        </nav>
      </div>
    </header>

    <RouterView />
  <ConfirmationModal/>
<!--  </div>-->
</template>

<style scoped></style>
