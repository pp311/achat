<script setup lang="ts">
import { RouterView } from 'vue-router'
import NavBar from './components/NavBar.vue'
import Footer from './components/Footer.vue'
</script>

<template>
<!--  <div class="min-h-screen flex flex-col">-->
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
    <Footer />
<!--  </div>-->
</template>

<style scoped></style>
