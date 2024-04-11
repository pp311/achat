<script setup lang="ts">

import Pagination from '@/components/Pagination.vue'
</script>

<template>
  <div class="overflow-x-auto">
    <table class="table table-zebra">
      <!-- head -->
      <thead>
      <tr>
        <th>
          <label>
            <input type="checkbox" class="checkbox" />
          </label>
        </th>
        <th>Name</th>
        <th>Job</th>
        <th>Favorite Color</th>
        <th></th>
      </tr>
      </thead>
      <tbody>
      <!-- row 1 -->
      <tr v-for="i in 10" :key="i">
        <th>
          <label>
            <input type="checkbox" class="checkbox" />
          </label>
        </th>
        <td>
          <div class="flex items-center gap-3">
            <div class="avatar">
              <div class="mask mask-squircle w-12 h-12">
                <img src="https://i.pinimg.com/564x/cf/86/12/cf861202e182d167000ea49d711e9c87.jpg" alt="Avatar Tailwind CSS Component" />
              </div>
            </div>
            <div>
              <div class="font-bold">Hart Hagerty</div>
              <div class="text-sm opacity-50">United States</div>
            </div>
          </div>
        </td>
        <td>
          Zemlak, Daniel and Leannon
          <br/>
          <span class="badge badge-ghost badge-sm">Desktop Support Technician</span>
        </td>
        <td>Purple</td>
        <th>
          <button class="btn btn-ghost btn-xs">details</button>
        </th>
      </tr>
      </tbody>
    </table>
    <div class="flex justify-center w-full mt-4">
      <Pagination/>
    </div>
  </div>
</template>

<style scoped>

</style>
