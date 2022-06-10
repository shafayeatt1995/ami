<template>
  <b-card no-body class="border border-0 mb-2">
    <b-card-header class="border-0 p-0">
      <div
        block
        class="bg-white border rounded-10 fw-600 border-1 px-3 py-2 br-3"
        @click="is_open = !is_open"
      >
        {{ title }}
      </div>
    </b-card-header>
    <b-collapse v-model="is_open" accordion="my-accordion" role="tabpanel">
      <b-card-body class="cursor-pointer">
        <b-card-text v-html="text"></b-card-text>
      </b-card-body>
    </b-collapse>
  </b-card>
</template>

<script>
export default {
  name: 'FootyDropdownFAQ',
  props: {
    title: {type: String, default: 'How does the “Amigo Copier” page work?'},
    text: {
      type: String,
      default:
        'Footy Amigo helps football bettors and traders from around the world make smarter and well informed data-driven betting decisions.',
    },
  },
  data() {
    return {
      is_open: false,
    };
  },
};
</script>
<style lang="scss"></style>
