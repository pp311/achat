<script setup lang="ts">
import { VFBLogin, VFBLoginScope } from 'vue-facebook-login-component-next'
import 'vue-facebook-login-component-next/dist/style.css'
import { ref, watch, watchEffect } from 'vue'
import { toast } from 'vue3-toastify'

const model = ref({
  accessToken: null
})

const appId = import.meta.env.VITE_FACEBOOK_APP_ID

const handleLogin = () => {
  const fbAuthRes = sessionStorage.getItem(`fbssls_${appId}`)
  if (fbAuthRes) {
    const obj = JSON.parse(fbAuthRes)
    model.value.accessToken = obj?.authResponse?.accessToken
  }
  else {
    toast.error('Cannot login to Facebook. Please try again later.')
  }
}

const handleLogout = () => {
  model.value.accessToken = null
  toast.success('Disconnect successfully.')
}

watchEffect(
  () => {
  const fbAuthRes = sessionStorage.getItem(`fbssls_${appId}`)
  if (fbAuthRes == null)
    return

  const obj = JSON.parse(fbAuthRes)
  model.value.accessToken = obj?.authResponse?.accessToken
  console.log(fbAuthRes)
  console.log(model.value)
})
</script>

<template>
  <div class="flex flex-row gap-6">
    <div class="card w-96 bg-base-100 shadow-xl border border-primary overflow-hidden">
      <img src="../../assets/facebook-banner.png" alt="Shoes" class="size-full" />
      <div class="card-body">
        <h2 class="card-title">Facebook page</h2>
        <div class="card-actions justify-end">
<!--          <VFBLogin app-id="1112531290010177" :login-options="{scope:'pages_show_list,pages_messaging,pages_manage_metadata'}" </VFBLogin>-->
          <VFBLoginScope :app-id="`${appId}`"
                         @login="handleLogin"
                         @logout="handleLogout"
                         :login-options="{cookie: true, status: true, scope:'pages_show_list,pages_messaging,pages_manage_metadata'}">
            <template v-slot="scope">
              <button class="btn btn-primary" v-if="model.accessToken" @click="scope.logout">
                Disconnect
              </button>
              <button class="btn btn-primary" v-else @click="scope.login">
                Connect
              </button>
            </template>
          </VFBLoginScope>
        </div>
      </div>
    </div>

    <div class="card w-96 bg-base-100 shadow-xl border border-primary overflow-hidden">
      <img src="../../assets/gmail-banner.jpg" alt="Shoes" />
      <div class="card-body">
        <h2 class="card-title">Gmail</h2>
        <div class="card-actions justify-end">
          <button class="btn btn-primary">Connect</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>