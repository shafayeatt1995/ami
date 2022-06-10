<template>
  <div>
    <h3 class="my-4">Strategies</h3>
    <b-skeleton-wrapper :loading="loading && page <= 1">
      <template #loading>
        <div rounded="sm" class="mt-4">
          <div class="my-alerts-table">
            <div class="my-alerts-table-head my-alerts-table-row text-grey">
              <b-skeleton height="20px" width="70%"></b-skeleton>
              <b-skeleton height="20px" width="70%"></b-skeleton>
              <b-skeleton height="20px" width="70%"></b-skeleton>
              <b-skeleton height="20px" width="70%"></b-skeleton>
              <b-skeleton height="20px" width="70%"></b-skeleton>
              <b-skeleton height="20px" width="70%"></b-skeleton>
              <b-skeleton height="20px" width="70%"></b-skeleton>
            </div>

            <div v-for="index in 5" :key="index" class="my-alerts-table-row">
              <div class="my-alerts-table-item">
                <b-skeleton height="40px" width="70%"></b-skeleton>
              </div>
              <div class="my-alerts-table-item">
                <b-skeleton height="20px" width="70%"></b-skeleton>
              </div>
              <div class="my-alerts-table-item">
                <b-skeleton height="20px" width="30px"></b-skeleton>
              </div>
              <div class="my-alerts-table-item">
                <b-skeleton height="40px" width="70%"></b-skeleton>
              </div>
              <div class="my-alerts-table-item">
                <b-skeleton height="20px" width="70%"></b-skeleton>
              </div>
              <div class="my-alerts-table-item">
                <b-skeleton height="30px" width="70%"></b-skeleton>
              </div>
              <div class="my-alerts-table-item">
                <b-skeleton height="40px" width="70%"></b-skeleton>
              </div>
            </div>
          </div>
        </div>
      </template>

      <template v-if="!strategies || !strategies.length">
        <div
          class="d-flex flex-column justify-content-center align-items-center my-5"
        >
          <GoalIcon />
          <div class="text-center mb-3">
            You have no strategy for sale! What are you waiting for? ☺️
          </div>
          <b-button
            class="footy-button"
            variant="primary"
            @click="$emit('openSellStrategyModal')"
          >
            <DollarCircleIcon class="mr-1" />
            Sell Strategy
          </b-button>
        </div>
      </template>
      <template v-else>
        <section
          class="page-strategies d-flex align-items-center justify-content-between"
        >
          <h4 class="mb-3">{{ total }} Strategies</h4>
          <div class="sort-lists d-flex column-gap-10">
            <!-- <div class="sort-item">
              <SmallDropdown :options="type_list" v-model="type" label="Type" />
            </div> -->

            <div class="sort-item">
              <SmallDropdown
                :options="sort_list"
                v-model="selected_sort"
                label="Sort"
              />
            </div>
          </div>
        </section>

        <StrategiesTable
          :strategies="strategies"
          @viewStrategy="viewStrategy"
          @editStrategy="openStrategyEditModal"
          @removeStrategy="removeStrategy"
          @refetchTable="initialFetch"
          @toggleStatus="toggleStatus"
        />

        <MugenScroll
          :handler="fetchMore"
          :should-handle="!loading"
          v-if="!loaded"
        >
          <div class="centered my-4">
            <b-spinner variant="primary" v-if="loading"></b-spinner>
          </div>
        </MugenScroll>
      </template>
    </b-skeleton-wrapper>
    <StrategyEditModal
      v-model="is_open_strategy_edit_modal"
      :strategy_id="editing_strategy_id"
      @accepted="editStrategy"
    />
  </div>
</template>

<script>
import StrategiesTable from '~/components/seller-dashboard/StrategiesTable.vue';
import StrategyEditModal from '~/components/seller-dashboard/StrategyEditModal.vue';
import GoalIcon from '~/static/icons/seller-dashboard/goal.svg';
import DollarCircleIcon from '~/static/icons/seller-dashboard/dollar-circle.svg';

export default {
  data() {
    return {
      sort_list: [
        {value: 'title', text: 'Name'},
        {value: 'hit_rate', text: 'Hit/Strike Rate'},
        {value: 'subscribers', text: 'Subscribers'},
        {value: 'price', text: 'Price'},
        {value: 'status', text: 'Status'},
      ],

      strategies: [],
      loading: false,
      loaded: false,
      page: 1,
      per_page: 20,
      total: 0,
      selected_sort: 'name',
      isAlert: false,

      is_open_strategy_edit_modal: false,
      editing_strategy_id: null,
    };
  },
  beforeMount() {
    this.initialFetch();
  },
  watch: {
    selected_sort() {
      this.initialFetch();
    },
  },

  methods: {
    async editStrategy(strategy_data) {
      const res = await this.$axios.$put(
        `/user/strategies/seller/${this.editing_strategy_id}`,
        strategy_data
      );
      if (!res.success) {
        console.log('Failed to update strategy');
        return;
      }
      this.initialFetch();
    },

    openStrategyEditModal(id) {
      this.editing_strategy_id = id;
      this.is_open_strategy_edit_modal = true;
    },

    async removeStrategy(id) {
      // TODO: confirm dialog
      const res = await this.$axios.$delete('/user/strategies/seller/' + id);
      if (!res.success) {
        console.log('Failed to remove');
        return;
      }
      const index = this.strategies.findIndex((item) => item._id === id);

      if (index !== -1) {
        this.strategies.splice(index, 1);
      }
    },

    async initialFetch() {
      try {
        this.loaded = false;
        this.loading = true;
        this.page = 1;
        const res = await this.$axios.$get('/user/strategies/seller/', {
          params: {
            // filters: this.filters,
            // sorter: this.sorter,
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
        const res = await this.$axios.$get('/user/strategies/seller/', {
          params: {
            // filters: this.filters,
            // sorter: this.sorter,
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
    async toggleStatus(strategy_id) {
      try {
        const res = await this.$axios.$patch(
          `/user/strategies/seller/${strategy_id}/toggleStatus`
        );
        if (!res.success) {
          console.log('Failed to fetch strategies');
          return;
        }
        const index = this.$_.findIndex(this.strategies, {_id: strategy_id});
        this.$set(
          this.strategies[index].sale_detail,
          'status',
          res.data.strategy.sale_detail.status
        );
      } catch (error) {
        console.log(error);
      }
    },
    viewStrategy() {},
  },
  components: {
    StrategiesTable,
    StrategyEditModal,
    GoalIcon,
    DollarCircleIcon,
  },
  computed: {
    userStrategies() {
      return this.strategies;
    },
  },
};
</script>

<style lang="scss"></style>
