<template>
  <div class="pt-3">
    <!-- <div class="d-flex wrap-on-mobile gap-40"> -->
    <div class="earning-status">
      <div
        class="d-flex justify-content-between p-2 border rounded-10"
        v-for="(data, key) in status"
        :key="`status-${key}`"
      >
        <div class="d-flex flex-column">
          <div class="medium-icon text-primary fw-600">{{ data.amount }}</div>
          <div class="text-grey fw-600 text-uppercase">{{ data.title }}</div>
        </div>
        <img :src="data.icon" class="align-self-start" alt="anik" />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'seller-earning-status',
  props: {
    status: Array,
  },
};
</script>
