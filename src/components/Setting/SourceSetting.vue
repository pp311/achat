<script setup lang="ts">
import { VFBLogin, VFBLoginScope } from 'vue-facebook-login-component-next'
import 'vue-facebook-login-component-next/dist/style.css'
import { ref, watch, watchEffect } from 'vue'
import { toast } from 'vue3-toastify'
import { useGlobalStore } from '@/stores/global'
import { storeToRefs } from 'pinia'
import { SourceType } from '@/types/enum'
import { GoogleLogin, googleSdkLoaded } from 'vue3-google-login'
import {
  connectGoogle,
  connectFacebook,
  getSources,
  disconnectFacebook,
  disconnectGoogle
} from '@/services/source.service'
import { deleteNote } from '@/services/note.service'

const model = ref({
  accessToken: null
})

const store = useGlobalStore()
const appId = import.meta.env.VITE_FACEBOOK_APP_ID

const { sources } = storeToRefs(store)

const handleLogin = async () => {
  const fbAuthRes = sessionStorage.getItem(`fbssls_${appId}`)
  if (fbAuthRes) {
    const obj = JSON.parse(fbAuthRes)
    const loadingToast = toast.loading('Connecting to Facebook...')
    await connectFacebook(obj?.authResponse?.accessToken)
    store.sources = await getSources()
    toast.remove(loadingToast)
    toast.success('Connect successfully.')
    sessionStorage.removeItem(`fbssls_${appId}`)
  } else {
    toast.error('Cannot login to Facebook. Please try again later.')
  }
}

const handleConnectGoogle = () => {
  googleSdkLoaded((google) => {
    google.accounts.oauth2.initCodeClient({
      client_id: import.meta.env.VITE_GOOGLE_CONNECT_CLIENT_ID,
      scope: 'email profile openid https://www.googleapis.com/auth/gmail.send https://www.googleapis.com/auth/gmail.readonly https://mail.google.com/ https://www.googleapis.com/auth/gmail.modify https://www.googleapis.com/auth/gmail.labels',
      callback: async (response) => {
        const loadingToast = toast.loading('Connecting to Google...')
        await connectGoogle(response.code)
        store.sources = await getSources()
        toast.remove(loadingToast)
        toast.success('Connect successfully.')
      }
    }).requestCode()
  })
}

const handleLogout = async (sourceId: number) => {
  store.confirmationModal = {
    title: 'Disconnect from this source',
    message: 'Are you sure you want to disconnect from this source? All contacts of this source will be deleted too!.',
    action: async () => {
      model.value.accessToken = null
      const loadingToast = toast.loading('Disconnecting...')
      await disconnectFacebook(sourceId)
      store.sources = await getSources()
      toast.remove(loadingToast)
      toast.success('Disconnect successfully.')
    }
  }

  const modal = document.getElementById('confirmation_modal') as HTMLDialogElement
  modal.showModal()
}

const handleDisconnectGoogle = async (sourceId: number) => {
  store.confirmationModal = {
    title: 'Disconnect from this source',
    message: 'Are you sure you want to disconnect from this source? All contacts of this source will be deleted too!.',
    action: async () => {
      model.value.accessToken = null
      const loadingToast = toast.loading('Disconnecting...')
      await disconnectGoogle(sourceId)
      store.sources = await getSources()
      toast.remove(loadingToast)
      toast.success('Disconnect successfully.')
    }
  }

  const modal = document.getElementById('confirmation_modal') as HTMLDialogElement
  modal.showModal()
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
  <h2 class="text-2xl font-bold mb-4">Connect new source</h2>
  <div class="flex flex-row gap-6 mb-6">
    <div class="card w-96 bg-base-100 h-[300px] shadow-xl border border-primary overflow-hidden">
      <img src="../../assets/facebook-banner.png" alt="Shoes" class="h-[150px]" />
      <div class="card-body">
        <h2 class="card-title">Facebook page</h2>
        <div class="card-actions justify-end">
          <!--          <VFBLogin app-id="1112531290010177" :login-options="{scope:'pages_show_list,pages_messaging,pages_manage_metadata'}" </VFBLogin>-->
          <VFBLoginScope :app-id="`${appId}`"
                         @login="handleLogin"
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

    <div class="card relative w-96 bg-base-100 h-[300px] shadow-xl border border-primary overflow-hidden">
      <img src="../../assets/gmail-banner.jpg" alt="Shoes" class="h-[150px]" />
      <div class="card-body">
        <h2 class="card-title">Gmail</h2>
        <div class="card-actions justify-end">
          <GoogleLogin @click="handleConnectGoogle">
            <div class="px-6 sm:px-0 max-w-sm">
              <button type="button"
                      class="btn btn-primary">Connect
              </button>
            </div>
          </GoogleLogin>
        </div>
      </div>


      <div class="dropdown dropdown-hover absolute left-4 top-4">
        <span role="button" class="font-bold bg-neutral text-neutral-content animate-bounce cursor-pointer size-4 flex items-center justify-center rounded-full">!</span>
        <div class="card card-compact dropdown-content z-[1] shadow rounded-box w-[350px] bg-neutral text-neutral-content">
          <div class="card-body w-full">
            <h2 class=" w-full">Only receive emails from newly created threads starting from the time of connection</h2>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="divider"></div>

  <div v-if="sources.length > 0">
    <h2 class="text-2xl font-bold mb-4">Connected sources</h2>
    <div class="flex flex-row gap-6">
      <div
        v-for="source in sources"
        :key="source.id"
        class="card w-96 bg-base-100 h-[300px] shadow-xl border border-primary overflow-hidden">
        <img v-if="source.type == SourceType.GOOGLE" src="../../assets/gmail-banner.jpg" alt="Shoes"
             class="h-[150px]" />
        <img v-if="source.type == SourceType.FACEBOOK" src="../../assets/facebook-banner.png" alt="Shoes"
             class="h-[150px]" />
        <div class="card-body">
          <h2 v-if="source.type == SourceType.FACEBOOK" class="card-title">{{ source.name }}</h2>
          <h2 v-if="source.type == SourceType.GOOGLE" class="card-title">{{ source.email }}</h2>
          <div class="card-actions justify-end">
            <button v-if="source.type == SourceType.GOOGLE" @click="handleDisconnectGoogle(source.id)"
                    class="btn btn-error">Disconnect
            </button>
            <button v-if="source.type == SourceType.FACEBOOK" @click="handleLogout(source.id)" class="btn btn-error">
              Disconnect
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<style scoped>

</style>