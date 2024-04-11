<script setup lang="ts">
import { IdentificationIcon, TagIcon, XMarkIcon, ChevronDownIcon } from '@heroicons/vue/24/solid'
</script>

<template>
<div class="w-[25%]">
<!--  Contact Info-->
  <div class="collapse bg-base-200 rounded-none">
    <input type="checkbox" checked/>
    <div class="collapse-title flex flex-row justify-between items-center">
      <span class="text-xl font-bold flex items-center"><IdentificationIcon class="size-6 mr-2"/>Contact Info</span>
      <ChevronDownIcon class="size-6"/>
    </div>
    <div class="collapse-content">
      <form>
        <div class="flex flex-row items-center font-bold text-lg mb-1">
          <label class="w-[40%]" for="fullname">Full name:</label>
          <input type="text" id="fullname" value="Doan Du" class="input w-full" />
        </div>

        <div class="flex flex-row items-center font-bold text-lg mb-1">
          <label class="w-[40%]" for="email">Email:</label>
          <input type="text" id="email" value="a@example.com" class="input w-full" disabled/>
        </div>


        <div class="flex flex-row items-center font-bold text-lg mb-1">
          <label class="w-[40%]" for="phone">Phone:</label>
          <input type="text" id="phone" value="01512498871" class="input w-full" />
        </div>

        <div class="flex flex-row items-center font-bold text-lg mb-1">
          <label class="w-[40%]" for="first-contact-on">First contact date:</label>
          <input type="date" id="first-contact-on" value="2024-07-14" class="input w-full" disabled />
        </div>

        <div class="flex flex-row items-center font-bold text-lg mb-1">
          <label class="w-[40%]" for="gender">Gender:</label>
          <select class="select w-full max-w-xs">
            <option selected>Unknown</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
        </div>
      </form>
    </div>
  </div>

  <div class="divider my-0 bg-base-200"></div>

  <div class="collapse bg-base-200 rounded-none">
    <input type="checkbox" checked/>
    <div class="collapse-title text-xl font-bold flex flex-row justify-between items-center">
      <span class="text-xl font-bold flex items-center"><TagIcon class="size-6 mr-2"/>Labels</span>
      <ChevronDownIcon class="size-6"/>
    </div>

    <div class="collapse-content flex flex-row gap-2 flex-wrap">
      <div class="badge badge-info gap-2">
        info
        <XMarkIcon class="size-4 cursor-pointer"/>
      </div>
      <div class="badge badge-success gap-2">
        success
        <XMarkIcon class="size-4"/>
      </div>
      <div class="badge badge-warning gap-2">
        warning
        <XMarkIcon class="size-4"/>
      </div>
      <div class="badge badge-error gap-2">
        error 2
        <XMarkIcon class="size-4"/>
      </div>

      <div class="badge badge-info gap-2">
        info
        <XMarkIcon class="size-4"/>
      </div>
      <div class="badge badge-success gap-2">
        very very long label
        <XMarkIcon class="size-4"/>
      </div>
      <div class="badge badge-warning gap-2">
        warning4
        <XMarkIcon class="size-4"/>
      </div>
      <div class="badge badge-error gap-2">
        error
        <XMarkIcon class="size-4"/>
      </div>
    </div>
  </div>

</div>
</template>

<style scoped>

</style>