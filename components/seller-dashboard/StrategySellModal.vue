<template>
  <b-modal
    hide-footer
    v-model="showPrompt"
    hide-header
    modal-class="promp-modal border-0"
    body-class="border-0 rounded-20 prompt-modal-body"
    content-class="border-0 rounded-20"
    body-bg-variant="light"
    size="lg"
  >
    <h3 class="rules-preview-title">
      Sell Strategy

      <b-button
        variant="white"
        class="float-right rounded"
        @click="cancelAction"
      >
        <span class="material-icons"> close </span>
      </b-button>
    </h3>
    <div class="container m-0 p-0 fw-normal">
      <div class="row">
        <div class="col col-lg-6">
          <b-form-group>
            <label class="footy-label">Strategy Name</label>
            <b-form-input
              b-input
              v-model="form.title"
              label="Strategy Name"
              id="create-strategy-title"
              class="mb-3 footy-input"
              aria-describedby="error-alert-name"
              placeholder="Strategy Name Here"
            ></b-form-input>
            <!-- :state="titleState" -->
            <b-form-invalid-feedback id="error-alert-name">
              Must be between 4 to 50 characters
            </b-form-invalid-feedback>
          </b-form-group>
        </div>
        <div class="col col-lg-6">
          <footy-dropdown-select
            v-model="form.type"
            :options="type_options"
            label="Strategy Type"
            id="strategy-type"
          >
          </footy-dropdown-select>
        </div>
      </div>
      <div class="row mb-4">
        <div class="col">
          <b-skeleton-wrapper :loading="loading">
            <template #loading>
              <label class="footy-label">Select Strategy</label>
              <b-skeleton class="my-2" width="100%" height="50px" />
            </template>
            <footy-dropdown-select
              v-model="form.strategy_id"
              :options="strategy_options"
              label="Select Strategy"
              id="select-strategy"
            >
            </footy-dropdown-select>
          </b-skeleton-wrapper>
        </div>
      </div>
      <div class="row mb-4">
        <div class="col">
          <label for="" class="mb-2">Description</label>
          <div>
            <textarea
              type="text"
              class="footy-textarea w-100"
              placeholder="Strategy Description here"
              v-model="form.note"
              :rows="5"
            />
          </div>
        </div>
      </div>
      <div class="row mb-4">
        <footy-dropdown-select
          v-model="form.price"
          :options="price_options"
          label="Price"
          id="price"
          class="col-12 col-lg-6"
        >
        </footy-dropdown-select>
        <div class="col-12 col-lg-6">
          <label class="mb-3">Outcome</label>
          <div>
            <b-form-input
              type="text"
              class="footy-input w-100"
              :value="outcome_title"
              disabled
            />
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <label for="" class="mb-3">Rules and Conditions</label>
          <div>
            <footy-radio
              v-model="form.is_rules_hidden"
              id="is-rules-hidden"
              :options="is_rules_hidden_options"
              class="mb-3"
            ></footy-radio>
          </div>
        </div>
      </div>
    </div>

    <div class="d-flex justify-content-between m-3 gap-40">
      <div class="d-flex">
        <TipIcon />
        <p>
          How to get most out of selling a strategy. <a href="#">Learn more</a>
        </p>
      </div>
      <div class="footy-button-group prompt-button-group">
        <b-button variant="white" class="footy-button" @click="cancelAction">
          Cancel & Back
        </b-button>
        <b-button variant="primary" class="footy-button" @click="confirmAction">
          Sell Strategy
        </b-button>
      </div>
    </div>
  </b-modal>
</template>

<script>
import TipIcon from '~/components/amigo-copier/assets/icons/tip.svg';

const IS_RULES_HIDDEN_OPTIONS = [
  {
    text: 'Hidden',
    value: true,
  },
  {
    text: 'Not Hidden',
    value: false,
  },
];
const STRATEGY_TYPE_OPTIONS = [
  {
    value: 'pre-match',
    text: 'Pre Match Strategy',
  },
  {
    value: 'in-play',
    text: 'In Play Strategy',
  },
];
const PRICE_OPTIONS = [
  {
    value: 4.99,
    text: '£4.99',
  },
  {
    value: 9.99,
    text: '£9.99',
  },
  {
    value: 12.99,
    text: '£12.99',
  },
];

export default {
  components: {
    TipIcon,
  },
  props: {
    value: Boolean,
  },
  data() {
    return {
      form: {
        title: '',
        type: 'pre-match',
        strategy_id: null,
        price: 4.99,
        note: '',
        is_rules_hidden: true,
      },
      is_rules_hidden_options: IS_RULES_HIDDEN_OPTIONS,
      type_options: STRATEGY_TYPE_OPTIONS,
      price_options: PRICE_OPTIONS,
      loading: true,
      strategies_can_sell: [],
    };
  },
  computed: {
    strategy_options() {
      const filtered = this.$_.filter(this.strategies_can_sell, {
        type: this.form.type,
      });
      const options = this.$_.map(filtered, ({_id: value, title: text}) => ({
        value,
        text,
      }));
      return options;
    },
    outcome_title() {
      const strategy = this.$_.find(this.strategies_can_sell, {
        _id: this.form.strategy_id,
      });

      return strategy && strategy.outcome && strategy.outcome.label;
    },
    showPrompt: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit('input', value);
      },
    },
  },
  watch: {
    value(newVal) {
      if (newVal) {
        console.log('value changed', newVal);
        this.getStrategies();
      }
    },
  },
  mounted() {
    this.getStrategies();
  },
  methods: {
    async getStrategies() {
      this.loading = true;

      this.strategies_can_sell = await this.$axios.$get(
        '/user/strategies/can-sell'
      );

      this.loading = false;
    },
    cancelAction() {
      this.showPrompt = false;
      this.$emit('rejected');
    },
    confirmAction() {
      this.$emit('accepted', this.form);
      this.showPrompt = false;
    },
  },
};
</script>

<style lang="scss">
.prompt-modal-body {
  padding: 28px 16px;
  display: grid;
  gap: 20px;
}
.prompt-button-group {
  justify-content: flex-end;
  &.centered {
    justify-content: center;
  }
}
</style>
