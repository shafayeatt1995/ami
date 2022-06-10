<template>
  <div class="bg-light p-x-17 p-y-37 rounded-20">
    <transition name="fade" mode="out-in">
      <div class="strategy-for-sale-details is-poppins" v-if="!purchaseMode">
        <div>
          <div class="d-flex justify-content-between align-items-start">
            <div class="fs-24 fw-600 m-b-19">Strategy Details</div>
            <b-button
              variant="white"
              class="float-right rounded px-2"
              @click="$nuxt.$emit('triggerStrategyDetailsModal')"
            >
              <span class="material-icons"> close </span>
            </b-button>
          </div>
          <div>
            <b-img fluid src="https://i.imgur.com/EPjLMfe.png"></b-img>
          </div>
          <div
            class="d-flex gap-20 mb-3 wrap-on-mobile"
            style="margin-top: -20px"
          >
            <div class="flex-1">
              <SellerProfile />
            </div>

            <div
              class="footy-button-group w-100-mobile"
              style="align-items: flex-end; justify-content: flex-end"
            >
              <div>
                <b-button class="footy-button fw-600" variant="outline-primary">
                  View Profile
                </b-button>
              </div>
              <div>
                <b-button
                  class="footy-button fw-600"
                  variant="primary"
                  @click="purchaseMode = !purchaseMode"
                >
                  Buy This Strategy
                  <b-badge
                    class="price rounded-circle text-primary ml-3 centered fs-10"
                    variant="white"
                    >£5</b-badge
                  ></b-button
                >
              </div>
            </div>
          </div>
        </div>
        <b-tabs
          content-class="m-t-29"
          lazy
          class="strategy-details-tabs"
          nav-class="strategy-details-tabs__nav fw-500"
        >
          <b-tab title="About">
            <StrategyDetailsAbout />
          </b-tab>
          <b-tab title="Stats">
            <StrategyDetailsStats />
          </b-tab>
          <b-tab title="Reviews">
            <StrategyDetailsReviews />
          </b-tab>
          <b-tab title="Track">
            <StrategyDetailsTrack />
          </b-tab>
          <b-tab title="Picks">
            <StrategyDetailsPicks />
          </b-tab>
          <b-tab title="FAQ">
            <StrategyDetailsFAQ />
          </b-tab>
        </b-tabs>
      </div>
      <BuyStrategyModal @triggerBuyStrategyOption="changePurchaseMode" v-else />
    </transition>
  </div>
</template>

<script>
import StrategyDetailsAbout from './strategy-details/StrategyDetailsAbout';
import StrategyDetailsStats from './strategy-details/StrategyDetailsStats';
import StrategyDetailsReviews from './strategy-details/StrategyDetailsReviews';
import StrategyDetailsTrack from './strategy-details/StrategyDetailsTrack';
import StrategyDetailsPicks from './strategy-details/StrategyDetailsPicks';
import StrategyDetailsFAQ from './strategy-details/StrategyDetailsFAQ';
import SellerProfile from './strategy-details/SellerProfile';
import BuyStrategyModal from '~/components/anik/BuyStrategyModal';

export default {
  components: {
    StrategyDetailsAbout,
    StrategyDetailsStats,
    StrategyDetailsReviews,
    StrategyDetailsTrack,
    StrategyDetailsPicks,
    StrategyDetailsFAQ,
    SellerProfile,
    BuyStrategyModal,
  },
  props: {
    strategy: {
      type: Object,
      default: () => {
        return {
          full_name: 'Adrian Luna',
          user_name: '@Adrian',
        };
      },
    },
  },

  data() {
    return {
      is_modal_active: false,
      purchaseMode: false,
    };
  },
  watch: {
    is_modal_active(val) {
      if (!val) {
        this.$emit('close');
      }
    },
  },

  methods: {
    changePurchaseMode(status) {
      this.purchaseMode = status;
    },

    setPurchaseMode() {
      this.purchaseMode = false;
    },
  },

  created() {
    this.setPurchaseMode();
  },
};
</script>

<style lang="scss" scoped>
	.strategy-for-sale-details {
		.title {
			margin-bottom: 20px;
		}
	}
</style>

<style lang="scss">
	.strategy-details-tabs {
		&__nav {
			&.nav-tabs {
				border-bottom: 2px solid #d1e2cf;
			}
			&.nav {
				flex-wrap: nowrap;
				overflow-x: auto;
				overflow-y: hidden;
				padding-bottom: 1px;
			}
			.nav-item {
				.nav-link {
					color: $grey;

					&.active {
						background: transparent;
						border: none;
						color: $primary;
						border-bottom: 2px solid $primary;
					}
				}
			}
		}
	}
</style>
