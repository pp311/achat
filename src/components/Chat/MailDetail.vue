<script setup lang="ts">

</script>

<template>
    <div class="overflow-auto w-full">
      <div v-for="i in 10" :key="i">
        <div class="flex w-full items-center mt-4">
          <div class="flex items-center gap-3">
            <div class="avatar">
              <div class="mask mask-circle w-12 h-12">
                <img src="https://img.daisyui.com/tailwind-css-component-profile-2@56w.png" alt="Avatar Tailwind CSS Component" />
              </div>
            </div>
            <div>
              <div class="font-bold">Hart Hagerty</div>
              <div class="text-sm opacity-50">United States</div>
            </div>
          </div>
          <div class="ml-auto mr-2 text-neutral">15:46 27/12/2024</div>
        </div>

        <!--  Content-->
        <div class=" mt-4">
          <h2 class="font-bold text-xl mb-4">Website Hosting Reviews Free The Best Resource For Hosting Comparison</h2>
          <pre class="whitespace-pre-line w-full font-sans text-md text-base">
        Do you know what could beat the exciting feeling of having a new computer? Make your own PC easy and compatible!

        So insisted received is occasion advanced honoured. Among ready to which up. Attacks smiling and may out assured moments man nothing outward. Thrown any behind afford either the set depend one temper. Instrument melancholy in acceptance collecting frequently be if. Zealously now pronounce existence add you instantly say offending. Merry their far had widen was. Concerns no in expenses raillery formerly.
        Best Regards,

        Bonnie Green, CEO Themesberg LLC
      </pre>
        </div>
        <div v-if="i !== 10" class="divider mt-6"></div>
      </div>
    </div>

  <div class="divider "></div>

    <div class=" mt-auto mb-2 w-full">
      <form class="flex">
        <input type="text" class="input mb-4 w-full mr-4" placeholder="Subject..." required>
        <button class="btn btn-primary">Send</button>
      </form>
      <div class="border rounded-lg bg-base-200">
        <QuillEditor style="height: 150px;"/>
      </div>
    </div>


</template>

<style scoped>
</style>