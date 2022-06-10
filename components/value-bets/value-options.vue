<template>
  <b-row align-h="center" class="footy-page-container" no-gutters>
    <b-col style="max-width: 530px">
      <div class="row-gap-30 flex-col">
        <h3 class="text-center">How much odds value do you want?</h3>

        <div>
          <footy-radio
            :options="value_options"
            v-model="selected_value"
            fillWidth
            radioClass="centered"
            id="rules-selection"
            :noWrap="true"
            class="radio-boxes"
          >
          </footy-radio>
        </div>

        <b-button
          variant="primary"
          block
          @click="
            is_expired ? $router.push('/profile/subscription') : nextStep()
          "
          class="footy-button"
          id="show-me-bets"
        >
          {{ is_expired ? 'Upgrade to Pro' : 'Show me value bets for today' }}
          <NextIcon v-if="!is_expired" />
        </b-button>
      </div>
    </b-col>
  </b-row>
</template>

<script>
import NextIcon from '~/static/icons/east.svg';
import {mapGetters} from 'vuex';
export default {
  props: {
    value: String,
    category: String,
  },
  data() {
    return {
      value_options: [
        {
          value: '1.5',
          text: '1.5 odds',
          image: '/vectors/smiley-1.svg',
          imgclass: 'rules-icon',
        },
        {
          value: '2.0',
          text: '2.0 odds',
          image: '/vectors/smiley-2.svg',
          imgclass: 'rules-icon',
        },

        {
          value: '2.5',
          text: '2.5 odds',
          image: '/vectors/smiley-3.svg',
          imgclass: 'rules-icon',
        },
        {
          value: '3.0',
          text: '3.0 odds',
          image: '/vectors/smiley-4.svg',
          imgclass: 'rules-icon',
        },
        {
          value: '3.5',
          text: '3.5 odds',
          image: '/vectors/smiley-5.svg',
          imgclass: 'rules-icon',
        },
        {
          value: '4.0',
          text: '4.0 odds',
          image: '/vectors/smiley-6.svg',
          imgclass: 'rules-icon',
        },
      ],
      next_button_hovered: false,
    };
  },
  computed: {
    ...mapGetters(['is_pro_user', 'is_expired']),
    selected_value: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('input', val);
      },
    },
  },
  components: {
    NextIcon,
  },
  methods: {
    nextStep() {
      this.$emit('next-step');
    },
  },
};
</script>
