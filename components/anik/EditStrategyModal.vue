<template>
  <ModalOnMobile v-model="modal" :is_a_modal="true">
    <div class="row mt-2 mt-lg-0 py-4 px-lg-2">
      <div class="col-12 mb-4">
        <h3 class="d-flex justify-content-between">
          Edit Strategy
          <b-button
            variant="white"
            class="float-right rounded px-2"
            @click="modal = !modal"
          >
            <span class="material-icons"> close </span>
          </b-button>
        </h3>
      </div>
      <div class="col-lg-6">
        <b-form-group>
          <label class="footy-label">
            Strategy Name
            <span>
              <InfoIcon class="icon-right" id="name-info"> </InfoIcon>
              <b-popover
                target="name-info"
                variant="grey"
                triggers="hover"
                placement="topright"
              >
                This is what other amigos will see on the marketplace. Make it
                standout, memorable and short. 😏
              </b-popover>
            </span>
          </label>
          <b-form-input
            b-input
            v-model="form.name"
            label="Strategy Name"
            id="strategy-name"
            class="mb-2 footy-input"
            placeholder="Strategy Name Here"
          ></b-form-input>
        </b-form-group>
      </div>
      <footy-dropdown-select
        v-model="form.type"
        :options="typeOption"
        label="Strategy Type"
        id="strategy-type"
        class="col-lg-6 mb-4"
        :is_disabled="true"
      />
      <footy-dropdown-select
        v-model="form.strategy"
        :options="strategyOption"
        label="Strategy"
        id="strategy"
        class="col-lg-6 mb-4"
        :is_disabled="true"
      />
      <div class="col-lg-6 mb-4">
        <b-form-group>
          <label class="footy-label">Desired Outcome</label>
          <b-form-input
            b-input
            v-model="form.outcome"
            label="Outcome"
            id="outcome"
            type="text"
            class="mb-2 footy-input"
            placeholder="Away Win"
            disabled
          ></b-form-input>
        </b-form-group>
      </div>
      <div class="col-12 mb-4">
        <label for="description" class="mb-2">
          Description
          <span>
            <InfoIcon class="icon-right" id="description-info"> </InfoIcon>
            <b-popover
              target="description-info"
              variant="grey"
              triggers="hover"
              placement="topright"
            >
              Describe your strategy in easy to understand language. Something
              that makes them want to buy!
            </b-popover>
          </span>
        </label>
        <div>
          <textarea
            type="text"
            class="footy-textarea w-100"
            placeholder="Strategy Description here"
            v-model="form.description"
            id="description"
            rows="3"
          />
        </div>
      </div>
      <footy-dropdown-select
        v-model="form.price"
        :options="priceOption"
        label="Price"
        info="Set the price you want to sell your strategy for. Remember to make it affordable and fair."
        id="price"
        class="col-lg-6 mb-4"
      />
      <div class="col-lg-6 mb-4">
        <label for="" class="mb-3">
          Rules and Conditions
          <span>
            <InfoIcon class="icon-right" id="rules-info"> </InfoIcon>
            <b-popover
              target="rules-info"
              variant="grey"
              triggers="hover"
              placement="topright"
            >
              If you don't want the buyer to see the rules and conditions you've
              inside your strategy, make it hidden. 🤫
            </b-popover>
          </span>
        </label>
        <div>
          <footy-radio
            v-model="form.rules"
            id="is-rules-hidden"
            :options="ruleOption"
            class="mb-3"
          ></footy-radio>
        </div>
      </div>
      <div class="col-lg-6 mb-5 mb-lg-0">
        <div class="d-flex align-items-center h-100 gap-10">
          <IconTip />
          <p class="text-grey">
            How to get most out of selling a strategy.
            <nuxt-link :to="{name: 'dashboard'}" class="text-primary">
              Learn more
            </nuxt-link>
          </p>
        </div>
      </div>
      <div class="col-lg-6 mb-4 mb-lg-0">
        <div class="modal-submit-button-group text-right">
          <b-button
            variant="white"
            class="footy-button border"
            @click="modal = !modal"
          >
            Cancel & Back
          </b-button>
          <b-button variant="primary" class="footy-button ml-2" @click="submit">
            Sell Strategy
          </b-button>
        </div>
      </div>
    </div>
  </ModalOnMobile>
</template>
<script>
import ModalOnMobile from '~/components/common/ModalOnMobile.vue';
import IconTip from '~/static/images/icon/tip.svg';

const defaultForm = {
  name: '',
  type: '1',
  strategy: '1',
  description: '',
  price: '4.99',
  link: '',
  rules: true,
  outcome: '',
};

export default {
  name: 'edit-strategy-modal',
  components: {
    IconTip,
    ModalOnMobile,
  },
  data() {
    return {
      modal: false,
      typeOption: [
        {
          value: 1,
          text: 'PreMatch Strategy',
        },
        {
          value: 2,
          text: 'InPlay Strategy',
        },
      ],
      priceOption: [
        {
          value: '4.99',
          text: '£4.99',
        },
        {
          value: '9.99',
          text: '£9.99',
        },
        {
          value: '12.99',
          text: '£12.99',
        },
      ],
      strategyOption: [
        {
          value: 1,
          text: 'Over 2.5 Goals in First Half',
        },
        {
          value: 2,
          text: 'Over 2 Goals in First Half',
        },
      ],
      ruleOption: [
        {
          text: 'Hidden',
          value: true,
        },
        {
          text: 'Not Hidden',
          value: false,
        },
      ],
      form: {
        ...defaultForm,
      },
    };
  },

  methods: {
    openModal() {
      this.form = {...defaultForm};
      this.modal = true;
    },

    submit() {
      console.log('form submit');
    },
  },

  created() {
    this.$nuxt.$on('triggerEditStrategyModal', () => {
      this.openModal();
    });
  },

  beforeDestroy() {
    this.$nuxt.$off('triggerEditStrategyModal');
  },
};
</script>
