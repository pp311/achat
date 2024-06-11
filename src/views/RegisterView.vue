<script setup lang="ts">
import { ref } from 'vue'

const isShowPassword = ref(false)
const isShowConfirmPassword = ref(false)

import { EyeSlashIcon, EyeIcon } from '@heroicons/vue/24/solid'
import { GoogleLogin } from 'vue3-google-login'
import { toast } from 'vue3-toastify';
import type { RegisterUser, UserType } from '@/types/user'
const store = useGlobalStore()

const callback = (response: any) => {
  toast.loading('Logging in...')
  userService.googleAuthenticate(response.access_token)
    .then((res: UserType) => {
      store.setUser(res)
      window.location.href = '/'
      // router.push({ path: '/' })
    })
    .catch((error: Error) => toast.error(error.message))
}

import { RouterLink, useRouter } from 'vue-router'
import { userService } from '@/services/user.service'
import { useGlobalStore } from '@/stores/global'

const router = useRouter()

const form = ref({
  email: '',
  fullName: '',
  password: '',
  confirmPassword: ''
})

const errorMsg = ref('')

const handleRegister = async () => {
  console.log(form.value)
  if (form.value.password !== form.value.confirmPassword) {
    errorMsg.value = '*Password and confirm password do not match'
    return
  }

  const registerUser : Omit<RegisterUser, 'confirmPassword'> = {
    email: form.value.email,
    fullName: form.value.fullName,
    password: form.value.password
  }

  userService.register(registerUser)
    .then(() => {
      router.push({ path: '/login', query: { isFromRegister: 'true' } })
    })
    .catch(() => {
      errorMsg.value = "*Email already exists"
    })
}


</script>

<template>
  <section class="bg-[url('../assets/sun.gif')] bg-cover">
    <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0 backdrop-blur-sm backdrop-brightness-50">
      <a href="#" class="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
        <img class="w-8 h-8 mr-2" src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg" alt="logo">
        AChat
      </a>
      <div class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
        <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
            Registration
          </h1>
          <div class="text-error">{{ errorMsg }}</div>
          <form class="space-y-4 md:space-y-6" action="#" @submit.prevent="handleRegister">
            <div>
              <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
              <input type="email"
                     name="email"
                     id="email"
                     v-model="form.email"
                     class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@company.com" required>
            </div>
            <div>
              <label for="fullName" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Full name</label>
              <input type="text"
                     name="fullName"
                     id="fullName"
                     v-model="form.fullName"
                     class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="John Doe" required>
            </div>
            <div>
              <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
              <div class="relative">
                <input :type="isShowPassword ? 'text' : 'password'"
                       name="password"
                       id="password"
                       placeholder="••••••••"
                       v-model="form.password"
                       class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required>

                <label class="swap absolute right-[4%] top-[50%] -translate-y-1/2">
                  <input type="checkbox" class="text-gray-900"/>
                  <span class="swap-on dark:text-white"
                        @click="() => isShowPassword = true">
                    <EyeSlashIcon class="size-6"/>
                  </span>
                  <span class="swap-off dark:text-white"
                        @click="() => isShowPassword = false">
                    <EyeIcon class="size-6"/>
                  </span>
                </label>
              </div>
            </div>
            <div>
              <label for="confirm-password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirm password</label>
              <div class="relative">
                <input :type="isShowConfirmPassword ? 'text' : 'password'"
                       name="confirm-password"
                       id="confirm-password"
                       v-model="form.confirmPassword"
                       placeholder="••••••••"
                       class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required>

                <label class="swap absolute right-[4%] top-[50%] -translate-y-1/2">
                  <input type="checkbox" class="text-gray-900"/>
                  <span class="swap-on dark:text-white"
                        @click="() => isShowConfirmPassword = true">
                    <EyeSlashIcon class="size-6"/>
                  </span>
                  <span class="swap-off dark:text-white"
                        @click="() => isShowConfirmPassword = false">
                    <EyeIcon class="size-6"/>
                  </span>
                </label>
              </div>

            </div>
            <div>
              <button type="submit" class="w-full btn btn-primary before:content-[''] before:mb-12 mb-6">Create account</button>

              <GoogleLogin :callback="callback" popup-type="TOKEN">
                <div class="px-6 sm:px-0 max-w-sm">
                  <button type="button" class=" w-full btn btn-info font-medium  text-sm px-5 py-2.5 text-center inline-flex items-center justify-between mr-2 mb-2"><svg class="mr-2 -ml-1 w-4 h-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path></svg>Sign up with Google<div></div></button>
                </div>
              </GoogleLogin>
            </div>
            <p class="text-sm font-light text-gray-500 dark:text-gray-400">
              Already have an account? <RouterLink to="/login" class="font-medium text-primary-600 hover:underline dark:text-primary-500">Sign in</RouterLink>
            </p>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.g-btn-wrapper {
  width: 100%
}
</style>
