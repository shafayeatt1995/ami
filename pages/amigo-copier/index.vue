<template>
  <GeneralPage
    page_title="Amigo Copier"
    class=""
    extraHeaderClass="flex-row"
    page_description="Find 100s of profitable PreMatch & InPlay strategies from the smartest football bettors and traders online. Clone and copy their High Hit rate strategies with one click!"
  >
    <template v-slot:howItWorks>
      <HowItWorks location="TODO:Location" />
    </template>

    <ModalOnMobile v-model="is_filters_shown">
      <div class="footy-page-container">
        <div class="d-grid grid-col-lg-4 grid-col-sm-2 gap-20">
          <footy-dropdown-select
            :options="dropdown.options"
            v-for="dropdown in dropdowns"
            :key="dropdown.key"
            :label="dropdown.text"
            v-model="filters[dropdown.key]"
          >
          </footy-dropdown-select>
        </div>

        <div class="d-flex justify-content-flex-end mt-3">
          <div class="d-flex ml-auto" style="gap: 17px">
            <b-button
              @click="clearFilter"
              variant="white"
              class="text-danger footy-button"
            >
              Clear Filters
            </b-button>
            <b-button @click="searchHandler" variant="primary footy-button">
              Search
            </b-button>
          </div>
        </div>
      </div>
    </ModalOnMobile>

    <div class="text-grey fs-14 my-4 listing-count-and-actions">
      <div>Showing {{ total }} results</div>
      <b-button
        class="footy-button footy-button-thin d-block d-lg-none rounded-0 p-1"
        variant="success"
        @click="is_filters_shown = true"
        size="sm"
      >
        Filters
      </b-button>
    </div>
    <div v-if="!loading">
      <div
        class="d-grid d-grid grid-col-lg-4 grid-col-sm-2 gap-40 cursor-pointer"
      >
        <AmigoListing
          v-for="(listing, index) in strategies"
          @click="selectActiveStrategy(index)"
          :strategy_id="listing._id"
          :title="listing.sale_detail && listing.sale_detail.title"
          :rating="listing.sale_detail && listing.sale_detail.overall_rating"
          :subscribers="
            listing.sale_detail && listing.sale_detail.number_of_subscribers
          "
          :hit_rate="listing.hit_rate"
          :key="index"
        >
        </AmigoListing>
        <MugenScroll
          :handler="fetchMore"
          :should-handle="!loading"
          v-if="!loaded"
        >
          <div class="centered my-4">
            <b-spinner variant="primary" v-if="loading"></b-spinner>
          </div>
        </MugenScroll>
      </div>
      <div class="fs-13 fw-600 text-success text-center mt-5">Load More</div>
    </div>
    <div v-else>Loading ...</div>
    <ModalOnMobile v-model="is_filters_shown" :is_a_modal="true">
      <StrategyDetails
        :strategy="active_strategy"
        @close="active_strategy_index = null"
      >
      </StrategyDetails>
    </ModalOnMobile>
    <ShareStrategyModal />
  </GeneralPage>
</template>
<script>
import FootyDropdownSelect from '@/components/common/FootyDropdownSelect.vue';
import AmigoListing from '@/components/amigo-copier/components/AmigoListing.vue';
import StrategyDetails from '@/components/amigo-copier/components/StrategyDetails.vue';
import dropdowns from '@/components/amigo-copier/assets/homepage-dropdowns.json';
import ShareStrategyModal from '~/components/anik/ShareStrategyModal.vue';

export default {
  name: 'AmigoCopierHome',
  head() {
    return {
      title: this.$titles.dashboard,
    };
  },
  middleware: 'tester',
  components: {
    FootyDropdownSelect,
    AmigoListing,
    StrategyDetails,
    ShareStrategyModal,
  },
  data() {
    return {
      is_filters_shown: true,
      filters: {
        picked_matches_overall: 'all',
        picked_matches_last_7_days: 'all',
        date_of_publishing: 'all',
        reviews_score: 'all',
        number_of_reviews: 'all',
        number_of_subscribers: 'all',
        type_of_strategy: 'all',
        order_by: 'number_of_subscribers',
      },
      dropdowns: dropdowns,
      loaded: false,
      page: 1,
      per_page: 20,
      strategies: [
        {
          title: 'Over 2.5 Goals Strategy bet at first half',
        },
        {
          title: 'Over 3.5 Goals Strategy bet at first half',
        },
        {
          title: 'Over 4.5 Goals Strategy bet at first half',
        },
        {
          title: 'Over 2.5 Goals Strategy bet at first half',
        },
        {
          title: 'Over 3.5 Goals Strategy bet at first half',
        },
        {
          title: 'Over 4.5 Goals Strategy bet at first half',
        },
        {
          title: 'Over 3.5 Goals Strategy bet at first half',
        },
        {
          title: 'Over 4.5 Goals Strategy bet at first half',
        },
      ],
      total: 0,
      loading: true,
      active_strategy_index: null,
    };
  },
  computed: {
    sorter() {
      return this.filters.order_by;
    },

    active_strategy() {
      if (this.active_strategy_index != null) {
        return this.strategies[this.active_strategy_index];
      } else {
        return null;
      }
    },
  },
  mounted() {
    this.initialFetch();
  },
  // watch: {
  //   filters: {
  //     handler() {
  //       this.page = 1;
  //       this.initialFetch();
  //     },
  //     deep: true,
  //   },
  //   sorter() {
  //     this.page = 1;
  //     this.initialFetch();
  //   },
  // },
  methods: {
    async initialFetch() {
      try {
        this.loaded = false;
        this.loading = true;
        this.page = 1;
        const res = await this.$axios.$get('/user/strategies/for-sale', {
          params: {
            filters: this.filters,
            sorter: this.sorter,
            page: this.page,
            per_page: this.per_page,
          },
        });

        if (!res.success) {
          console.log('Failed to fetch strategies');
        }

        this.total = res.data.total;
        this.strategies = res.data.strategies;

        this.loading = false;
        if (res.data.strategies.length < this.per_page) {
          this.loaded = true;
        }
      } catch (error) {
        this.loading = false;
        this.loaded = true;
        console.log(error);
      } finally {
        this.loading = false;
      }
    },
    async fetchMore() {
      try {
        this.loading = true;
        this.page += 1;
        const res = await this.$axios.$get('/user/strategies/for-sale', {
          params: {
            filters: this.filters,
            sorter: this.sorter,
            page: this.page,
            per_page: this.per_page,
          },
        });

        if (!res.success) {
          console.log('Failed to fetch strategies');
        }
        this.total = res.data.total;
        this.strategies.push(...res.data.strategies);
        window.scrollBy(0, -200);
        this.loading = false;
        if (res.data.strategies.length < this.per_page) {
          this.loaded = true;
        }
      } catch (error) {
        console.log(error);
      } finally {
        this.loading = false;
      }
    },
    searchHandler() {
      this.initialFetch();
      this.is_filters_shown = false;
    },
    clearFilter() {
      this.filters = {
        picked_matches_overall: 'all',
        picked_matches_last_7_days: 'all',
        date_of_publishing: 'all',
        reviews_score: 'all',
        number_of_reviews: 'all',
        number_of_subscribers: 'all',
        type_of_strategy: 'all',
        order_by: 'number_of_subscribers',
      };
    },
    selectActiveStrategy(index) {
      this.active_strategy_index = index;
    },

    closeModal() {
      this.is_filters_shown = false;
    },
  },
  created() {
    this.$nuxt.$on('triggerStrategyDetailsModal', () => {
      this.closeModal();
    });
  },

  beforeDestroy() {
    this.$nuxt.$off('triggerStrategyDetailsModal');
  },
};
</script>

<style lang="scss" scoped>
	.listing-count-and-actions {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
</style>
