<script setup lang="ts">
import SourceSetting from '@/components/Setting/SourceSetting.vue'
import CustomInfoSetting from '@/components/Setting/CustomInfoSetting.vue'
import LabelSetting from '@/components/Setting/LabelSetting.vue'
import TemplateSetting from '@/components/Setting/TemplateSetting.vue'
</script>

<template>
  <div role="tablist" class="tabs tabs-lg tabs-lifted p-8">
<!--    <input type="radio" name="my_tabs_2" role="tab" class="tab  [&#45;&#45;tab-border-color:oklch(var(&#45;&#45;p))] border-primary" aria-label="Personal Info" />-->
<!--    <div role="tabpanel" class="tab-content bg-base-100 border-primary rounded-box p-6">Personal Info</div>-->
    <input type="radio" name="my_tabs_2" role="tab" class="tab [--tab-border-color:oklch(var(--p))] border-primary" aria-label="Sources" checked />
    <div role="tabpanel" class="tab-content bg-base-100 border-primary rounded-box p-6">
      <SourceSetting/>
    </div>


    <input type="radio" name="my_tabs_2" role="tab" class="tab  [--tab-border-color:oklch(var(--p))] border-primary" aria-label="Templates"  />
    <div role="tabpanel" class="tab-content bg-base-100 border-primary rounded-box p-6">
      <TemplateSetting/>
    </div>


    <input type="radio" name="my_tabs_2" role="tab" class="tab  [--tab-border-color:oklch(var(--p))] border-primary" aria-label="Labels"  />
    <div role="tabpanel" class="tab-content bg-base-100 border-primary rounded-box p-6">
      <LabelSetting/>
    </div>

<!--    <input type="radio" name="my_tabs_2" role="tab" class="tab  [&#45;&#45;tab-border-color:oklch(var(&#45;&#45;p))] border-primary" aria-label="Fields" />-->
<!--    <div role="tabpanel" class="tab-content bg-base-100 border-primary rounded-box p-6">-->
<!--      <CustomInfoSetting/>-->
<!--    </div>-->

  </div>
</template>

<style scoped>

</style>