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
    <h3>
      Edit Strategy

      <b-button
        variant="white"
        class="float-right rounded"
        @click="cancelAction"
      >
        <span class="material-icons"> close </span>
      </b-button>
    </h3>

    <b-skeleton-wrapper :loading="loading">
      <template #loading>
        <div class="container m-0 p-0">
          <div class="row mb-4">
            <div class="col">
              <b-skeleton height="40px" />
            </div>
          </div>
          <div class="row mb-4">
            <b-form-group class="col-12 col-lg-4">
              <label class="footy-label">Strategy</label>
              <b-skeleton height="40px" />
            </b-form-group>
            <b-form-group class="col-12 col-lg-8">
              <label class="footy-label">Strategy Type</label>
              <b-skeleton height="40px" />
            </b-form-group>
          </div>
          <div class="row mb-4">
            <div class="col">
              <label for="" class="mb-2">Description</label>
              <b-skeleton height="40px" />
            </div>
          </div>
          <div class="row mb-4">
            <div class="col-12">
              <b-skeleton height="40px" />
            </div>
            <div class="col-12 col-lg-8">
              <label class="mb-3">Video Link</label>
              <b-skeleton height="40px" />
            </div>
          </div>
          <div class="row">
            <div class="col">
              <b-skeleton height="40px" />
            </div>
          </div>
        </div>
      </template>

      <div class="container m-0 p-0 fw-normal">
        <div class="row">
          <div class="col-12">
            <b-form-group>
              <label class="footy-label">Strategy Name</label>
              <b-form-input
                b-input
                v-model="form.sale_detail.title"
                label="Strategy Name"
                id="create-strategy-title"
                class="mb-3 footy-input"
                aria-describedby="error-alert-name"
                placeholder="Strategy Name Here"
              ></b-form-input>
              <b-form-invalid-feedback id="error-alert-name">
                Must be between 4 to 50 characters
              </b-form-invalid-feedback>
            </b-form-group>
          </div>
        </div>
        <div class="row mb-4">
          <b-form-group class="col-12 col-lg-4">
            <label class="footy-label">Strategy</label>
            <b-form-input
              disabled
              :value="
                form.type == 'pre-match'
                  ? 'PreMatch Strategy'
                  : 'InPlay Strategy'
              "
              b-input
              class="footy-input"
            ></b-form-input>
          </b-form-group>
          <b-form-group class="col-12 col-lg-8">
            <label class="footy-label">Strategy Type</label>
            <b-form-input
              disabled
              :value="form.title"
              b-input
              class="footy-input"
            ></b-form-input>
          </b-form-group>
        </div>
        <div class="row mb-4">
          <div class="col">
            <label for="" class="mb-2">Description</label>
            <div>
              <textarea
                type="text"
                class="footy-textarea w-100"
                placeholder="Strategy Description here"
                v-model="form.sale_detail.note"
                :rows="5"
              />
            </div>
          </div>
        </div>
        <div class="row mb-4">
          <footy-dropdown-select
            v-model="form.sale_detail.price"
            :options="price_options"
            label="Price"
            id="price"
            class="col-12 col-lg-4 mb-3 mb-lg-0"
          >
          </footy-dropdown-select>
          <div class="col-12 col-lg-8">
            <label class="mb-3">Video Link</label>
            <div>
              <b-form-input
                b-input
                type="text"
                class="footy-input w-100"
                v-model="form.sale_detail.video_url"
              />
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-12 col-lg-6">
            <label for="" class="mb-3">Rules and Conditions</label>
            <div>
              <footy-radio
                v-model="form.sale_detail.is_rules_hidden"
                id="is-rules-hidden"
                :options="is_rules_hidden_options"
                class="mb-3"
              ></footy-radio>
            </div>
          </div>
          <div class="col-12 col-lg-6">
            <label class="mb-3">Outcome</label>
            <div>
              <b-form-input
                b-input
                type="text"
                class="footy-input w-100"
                :value="form.outcome.label"
                disabled
              />
            </div>
          </div>
        </div>
      </div>

      <div class="d-flex justify-content-between m-3 gap-40">
        <div class="d-flex">
          <TipIcon />
          <p>
            How to get most out of selling a strategy.
            <a href="#">Learn more</a>
          </p>
        </div>
        <div class="footy-button-group prompt-button-group">
          <b-button variant="white" class="footy-button" @click="cancelAction">
            Cancel & Back
          </b-button>
          <b-button
            variant="primary"
            class="footy-button"
            @click="confirmAction"
          >
            Sell Strategy
          </b-button>
        </div>
      </div>
    </b-skeleton-wrapper>
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

const FORM_DEFAULT = {
  title: '', // disabled
  type: 'pre-match', // disabled
  outcome: {
    label: '', // disabled
  },
  sale_detail: {
    title: '',
    note: '',
    price: 4.99,
    is_rules_hidden: true,
    video_url: '',
  },
};

export default {
  props: {
    value: Boolean,
    strategy_id: String,
  },
  data() {
    return {
      form: FORM_DEFAULT,
      is_rules_hidden_options: IS_RULES_HIDDEN_OPTIONS,
      price_options: PRICE_OPTIONS,
      loading: true,
    };
  },
  computed: {
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
      if (newVal) this.fetchStrategy();
    },
    // strategy_id() {
    //   this.fetchStrategy();
    // },
  },
  methods: {
    async fetchStrategy() {
      try {
        this.loading = true;
        const res = await this.$axios.$get(
          `/user/strategies/seller/${this.strategy_id}`,
          {
            params: {
              projection: {
                title: 1,
                type: 1,
                'outcome.label': 1,
                'sale_detail.title': 1,
                'sale_detail.note': 1,
                'sale_detail.price': 1,
                'sale_detail.video_url': 1,
                'sale_detail.is_rules_hidden': 1,
              },
            },
          }
        );
        if (!res.success) {
          console.log('Failed to fetch strategy');
          throw new Error('Failed to fetch strategy');
        }
        this.form = this.$_.defaultsDeep(res.data.strategy, FORM_DEFAULT);
      } catch (error) {
        console.log(error);
      } finally {
        this.loading = false;
      }
    },
    cancelAction() {
      this.showPrompt = false;
      this.$emit('rejected');
    },
    confirmAction() {
      const strategy_data = this.$_.pick(this.form, [
        'sale_detail.title',
        'sale_detail.note',
        'sale_detail.price',
        'sale_detail.video_url',
        'sale_detail.is_rules_hidden',
      ]);
      this.$emit('accepted', strategy_data);
      this.showPrompt = false;
    },
  },
  components: {
    TipIcon,
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
