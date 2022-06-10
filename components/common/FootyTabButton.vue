<template>
  <div
    class="footy-tab-button"
    :class="active ? 'active' : ''"
    v-bind="{...$props}"
    @click="$emit('click')"
  >
    <slot v-if="active" name="active-icon"> </slot>
    <slot v-else name="icon"> </slot>
    <slot> </slot>
  </div>
</template>

<script>
export default {
  props: [
    'text',
    'active',
    'icon',
    'icon-disabled',
    'variant',
    'href',
    'to',
    'block',
    'disabled',
  ],
};
</script>

<style lang="scss" scoped>
.footy-tab-button {
  /* Auto Layout */
  display: inline-flex;
  align-items: center;
  padding: 8px 2px;
  justify-content: center;
  font-weight: 500; //COLFAX
  font-size: 14px;
  line-height: 20px;
  white-space: nowrap;
  border: none;
  background-color: transparent;
  svg {
    height: 16px !important;
  }
  &:disabled {
    //background: #d5ded5;
    cursor: not-allowed;
  }
  &:hover {
    background: white;
  }
  &.active {
    border-bottom: 2px solid $green-1;
  }
  &.footy-button-thin {
    padding: 12px;
    border-radius: 10px;
  }

  .material-icons-outlined {
    font-size: 16px !important;
    margin-right: 8px;
  }
  &.footy-button-xs {
    padding: 13px;
  }
  &.footy-button-sm {
    padding: 17px;
  }
}
</style>
