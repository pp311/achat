<script setup lang="ts">

import { ChevronLeftIcon, ChevronRightIcon, PlusCircleIcon, TrashIcon } from '@heroicons/vue/24/solid'
</script>

<template>

  <div class="flex items-center justify-start w-full px-4" >
    <label>
      <input type="checkbox" class="checkbox" />
    </label>

    <div class="divider-vertical mx-4 w-[1px] bg-neutral"></div>
    <div class="btn btn-primary p-2 h-fit mr-4"><PlusCircleIcon class="size-5"/>Compose</div>
    <!--      <div class="divider-vertical mx-4 w-[1px] bg-neutral"></div>-->
    <div class="btn btn-error p-2 flex items-center"><TrashIcon class="size-4"/>Delete</div>
    <div class="ml-auto flex items-center gap-4">
      <div class="rounded-full p-0 size-6 hover:bg-base-200 flex justify-center items-center"><ChevronLeftIcon class="size-4"/></div>
      <div class="rounded-full p-0 size-6 hover:bg-base-200 flex justify-center items-center"><ChevronRightIcon class="size-4"/></div>
      <div>Show <span class="font-bold">1 - 25</span> of <span class="font-bold">120</span></div>
    </div>
  </div>

  <div class="divider m-1"></div>

  <div class="overflow-auto">
    <table class="table table-fixed">
      <col class="w-[5%]"/>
      <col class="w-[83%]"/>
      <col class="w-[12%]"/>
      <tbody>
      <tr class="cursor-pointer hover" v-for="i in 10" :key="i">
        <th>
          <label>
            <input type="checkbox" class="checkbox" />
          </label>
        </th>
        <td class="truncate">
          <span><span class="font-bold">Website Hosting Reviews Free The Best Resource For Hosting Comparison</span> - Do you know what could beat the exciting feeling of having a new computer? Make your own PC easy and compatible!</span>
        </td>
        <td class="text-right">12-12-2024</td>
      </tr>

      <!--      Loading-->
      <!--      <template v-if="isLoading" >-->
      <!--        <tr v-for="i in 3" :key="i">-->
      <!--          <td v-for="j in 5" :key="j">-->
      <!--            <div class="skeleton h-10 w-full"></div>-->
      <!--          </td>-->
      <!--        </tr>-->
      <!--      </template>-->
      </tbody>
    </table>
  </div>
</template>

<style scoped>

</style>