<template>
  <div class="seller-profile">
    <b-img
      fluid
      src="https://i.imgur.com/FGpVfqm.png"
      class="seller-profile__avatar"
    >
    </b-img>
    <div class="p-2">
      <div class="fw-500 fs-16">
        Adrian Luna <span class="text-grey">@Adrian</span>
      </div>

      <div class="fw-500 fs-10 text-primary">How It Works</div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.seller-profile {
  display: flex;
  align-items: flex-end;
  padding-left: 33px;
  padding-right: 33px;
  .seller-profile__avatar {
    width: 96px;
    height: 96px;
    border-radius: 8px;
  }
}
</style>
