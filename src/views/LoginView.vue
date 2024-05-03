<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { toast } from 'vue3-toastify';
import { userService } from '@/services/user.service'

const route = useRoute()
const router = useRouter()
const store = useGlobalStore()

const isShowPassword = ref(false)

const loginForm = ref({
    email: '',
    password: '',
    isRemember: false
})

onMounted(() => {
    if (route.query.isFromRegister === 'true') {
        toast.success('Register successfully. Please login to continue!')
    }
    if (route.query.isFromOtherUrl === 'true') {
        toast.error('Please login to continue!')
    }
})

const handleLogin = async () => {
    toast.loading('Logging in...')
    userService.login(loginForm.value.email, loginForm.value.password, loginForm.value.isRemember)
        .then((res: UserType) => {
            store.setUser(res)
            router.push({ path: '/' })
        })
        .catch((error: Error) => toast.error(error.message))
}

import { GoogleLogin } from 'vue3-google-login'
import { EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/solid'
import { useRoute, useRouter } from 'vue-router'
import { useGlobalStore } from '@/stores/global'
import type { LoginResponse, UserType } from '@/types/user'

const callback = (response: any) => {
    toast.loading('Logging in...')
    userService.googleAuthenticate(response.access_token)
        .then((res: UserType) => {
            store.setUser(res)
            router.push({ path: '/' })
        })
        .catch((error: Error) => toast.error(error.message))
}
</script>

<template>
    <section class="bg-[url('../assets/rain.gif')] bg-cover">
        <div
            class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0 backdrop-blur-sm backdrop-brightness-50">
            <a href="#" class="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
                <img class="w-8 h-8 mr-2" src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg"
                    alt="logo">
                AChat
            </a>
            <div
                class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <h1
                        class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                        Sign in to your account
                    </h1>
                    <form class="space-y-4 md:space-y-6" action="#" @submit.prevent="handleLogin">
                        <div>
                            <label for="email"
                                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                            <input type="email" name="email" id="email" v-model="loginForm.email"
                                class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="name@company.com" required>
                        </div>
                        <div>
                            <label for="password"
                                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                            <div class="relative">
                                <input :type="isShowPassword ? 'text' : 'password'" name="password" id="password"
                                    placeholder="••••••••" v-model="loginForm.password"
                                    class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    required>

                                <label class="swap absolute right-[4%] top-[50%] -translate-y-1/2">
                                    <input type="checkbox" class="text-gray-900" />
                                    <span class="swap-on dark:text-white" @click="() => isShowPassword = true">
                                        <EyeSlashIcon class="size-6" />
                                    </span>
                                    <span class="swap-off dark:text-white" @click="() => isShowPassword = false">
                                        <EyeIcon class="size-6" />
                                    </span>
                                </label>
                            </div>
                        </div>
                        <div class="flex items-center justify-between">
                            <div class="flex items-start">
                                <div class="flex items-center h-5">
                                    <input id="remember" aria-describedby="remember" type="checkbox"
                                        v-model="loginForm.isRemember" :true-value="true" :false-value="false"
                                        class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800">
                                </div>
                                <div class="ml-3 text-sm">
                                    <label for="remember" class="text-gray-500 dark:text-gray-300">Remember me</label>
                                </div>
                            </div>
                            <a href="#"
                                class="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500">Forgot
                                password?</a>
                        </div>
                        <button type="submit" class="w-full btn btn-primary">Sign in</button>
                        <GoogleLogin :callback="callback" popup-type="TOKEN">
                            <div class="px-6 sm:px-0 max-w-sm">
                                <button type="button"
                                    class="text-white w-full  bg-[#4285F4] hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center justify-between mr-2 mb-2"><svg
                                        class="mr-2 -ml-1 w-4 h-4" aria-hidden="true" focusable="false"
                                        data-prefix="fab" data-icon="google" role="img"
                                        xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                                        <path fill="currentColor"
                                            d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z">
                                        </path>
                                    </svg>Continue with Google<div></div></button>
                            </div>
                        </GoogleLogin>
                        <p class="text-sm font-light text-gray-500 dark:text-gray-400">
                            Don’t have an account yet? <RouterLink to="/register"
                                class="font-medium text-primary-600 hover:underline dark:text-primary-500">Sign up
                            </RouterLink>
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
