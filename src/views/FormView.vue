<script setup lang="ts">
import ServiceStep from '@/components/molecules/ServiceStep.vue';
import GeneralInfoForm from '@/components/molecules/GeneralInfoForm.vue';
import ApplyServiceInfoForm from '@/components/molecules/ApplyServiceInfoForm.vue';
</script>

<template>
  <div>
    <section class="bg-grey-50 px-4 pt-5 pb-4">
      <ServiceStep :activeStep="1" />
      <p class="font-bold mt-4">Hi XXX，請填寫以下申辦資料</p>
    </section>
    <form action="">
      <GeneralInfoForm />
      <div class="w-full h-2 bg-grey-50"></div>
      <ApplyServiceInfoForm />
    </form>
  </div>
</template>
