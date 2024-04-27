<script setup lang="ts">
import SourceSetting from '@/components/Setting/SourceSetting.vue'
import CustomInfoSetting from '@/components/Setting/CustomInfoSetting.vue'
import LabelSetting from '@/components/Setting/LabelSetting.vue'
</script>

<template>
  <div role="tablist" class="tabs tabs-lg tabs-lifted p-8">
    <input type="radio" name="my_tabs_2" role="tab" class="tab  [--tab-border-color:oklch(var(--p))] border-primary" aria-label="Personal Info" />
    <div role="tabpanel" class="tab-content bg-base-100 border-primary rounded-box p-6">Personal Info</div>

    <input type="radio" name="my_tabs_2" role="tab" class="tab  [--tab-border-color:oklch(var(--p))] border-primary" aria-label="Sources" />
    <div role="tabpanel" class="tab-content bg-base-100 border-primary rounded-box p-6">
      <SourceSetting/>
    </div>

    <input type="radio" name="my_tabs_2" role="tab" class="tab  [--tab-border-color:oklch(var(--p))] border-primary" aria-label="Custom Info Fields" />
    <div role="tabpanel" class="tab-content bg-base-100 border-primary rounded-box p-6">
      <CustomInfoSetting/>
    </div>

    <input type="radio" name="my_tabs_2" role="tab" class="tab  [--tab-border-color:oklch(var(--p))] border-primary" aria-label="Labels" checked />
    <div role="tabpanel" class="tab-content bg-base-100 border-primary rounded-box p-6">
      <LabelSetting/>
    </div>
  </div>
</template>

<style scoped>

</style>