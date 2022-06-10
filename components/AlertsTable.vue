<template>
  <div>
    <section
      class="page-strategies d-flex align-items-center justify-content-between"
    >
      <h4 class="mb-3">{{ total }} Strategies</h4>
      <div class="sort-lists d-flex column-gap-10">
        <div class="sort-item">
          <SmallDropdown :options="type_list" v-model="type" label="Type" />
        </div>

        <div class="sort-item">
          <SmallDropdown :options="sort_list" v-model="sort" label="Sort" />
        </div>
      </div>
    </section>

    <UpgradeToPro
      :message="upgradeMessage"
      :is_upgrade_overlay_shown="is_upgrade_overlay_shown"
    >
      <MyAlertsTable
        :strategies="strategies"
        :strategy_type="strategy_type"
        @viewfilter="viewFilter"
        @deleteStrategy="deleteStrategy"
        @sharefilter="shareFilter"
        @refetchTable="$emit('refetchTable')"
        @toggle-mute="toggleMuteStrategy"
        v-if="strategy_mode == 'my-alerts'"
      />
      <ExploreAlertsTable
        :strategies="strategies"
        :strategy_type="strategy_type"
        @viewfilter="viewFilter"
        v-else
        :strategy_mode="strategy_mode"
      />
    </UpgradeToPro>

    <sharer-modal
      v-model="is_sharer_shown"
      :id="strategyId"
      v-if="is_sharer_shown"
    >
    </sharer-modal>
    <sharer-modal
      v-model="is_strategy_shown"
      :id="strategyId"
      v-if="is_strategy_shown"
      :is_view_mode="true"
    >
    </sharer-modal>
  </div>
</template>

<script>
import SharerModal from '~/components/SharerModal';
import MyAlertsTable from '~/components/strategy-list/MyAlertsTable';
import ExploreAlertsTable from '~/components/strategy-list/ExploreAlertsTable';

export default {
  props: {
    strategies: Array,

    selectedType: String,
    selected_sort: String,
    strategy_mode: String,
    strategy_type: String,
    edited: Boolean,
    is_upgrade_overlay_shown: Boolean,
    total: Number,
  },
  components: {
    SharerModal,
    MyAlertsTable,
    ExploreAlertsTable,
  },
  data() {
    return {
      is_sharer_shown: false,
      strategyId: null,
      is_strategy_shown: false,
      type_list: [
        {value: 'all', text: 'All'},
        {value: 'active', text: 'Active'},
        {value: 'inactive', text: 'Inactive'},
      ],
      sort_list: [
        {value: 'status', text: 'Status'},
        {value: 'name', text: 'Name'},
        {value: 'updated_at', text: 'Last Edited'},
        {
          value: 'hit_rate',
          text:
            this.strategy_type == 'in-play-alerts' ? 'Strike Rate' : 'Hit Rate',
        },
        {value: 'picks_sent', text: 'Picks Sent'},
      ],
    };
  },
  computed: {
    upgradeMessage() {
      const messages = {
        'my-alerts': 'Upgrade to Pro to regain access to your strategies',
        'explore-alerts':
          'Upgrade to Pro to gain access to strategies from 100s of profitable users',
        'preset-alerts':
          'Upgrade to Pro to gain access to tested and trusted profitable preset strategies',
      };
      return messages[this.strategy_mode];
    },
    sort: {
      get() {
        return this.selected_sort;
      },
      set(value) {
        this.$emit('update:selected_sort', value);
      },
    },
    type: {
      get() {
        return this.selectedType;
      },
      set(value) {
        this.$emit('update:selectedType', value);
      },
    },
  },
  methods: {
    async deleteStrategy(id) {
      this.$emit('deleteStrategy', id);
    },
    async toggleMuteStrategy(index) {
      const id = this.strategies[index]._id;
      await this.$axios.toggleMuteStrategy(id);
      this.strategies[index].muted = !this.strategies[index].muted;
    },

    shareFilter(id) {
      this.is_sharer_shown = true;
      this.strategyId = id;
    },

    refreshTable() {
      this.$emit('refreshTable');
    },

    viewFilter(id) {
      this.is_strategy_shown = true;
      this.strategyId = id;
    },
    async trustStrategy(id, index) {
      await this.$axios.trustStrategy(id);
      this.strategies[index].trusted = true;
    },
    async cloneStrategy(id) {
      await this.$axios.cloneStrategy(id);
      this.refreshTable();
    },
    async untrustStrategy(id, index) {
      await this.$axios.untrustStrategy(id);
      this.strategies[index].trusted = false;
    },
    async toggleActiveStatus(id, index) {
      await this.$axios.toggleActiveStatus(id);
      this.strategies[index].active = !this.strategies[index].active;
    },
  },
};
</script>
