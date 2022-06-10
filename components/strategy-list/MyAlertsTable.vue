<template>
  <div class="my-alerts-table">
    <template v-if="strategies.length">
      <div class="my-alerts-table-head my-alerts-table-row text-grey">
        <div>STRATEGY NAME</div>
        <div>
          {{ strategy_type == 'pre-match-alerts' ? 'HIT RATE' : 'STRIKE RATE' }}
        </div>
        <div>PICKS SENT</div>
        <div>LAST EDITED</div>

        <div>STATUS</div>
        <div>ACTIVE</div>

        <div>ACTION</div>
      </div>

      <div
        v-for="(item, index) in strategies"
        :key="index"
        class="my-alerts-table-row"
      >
        <div class="strategy-name-item my-alerts-table-item">
          <div class="my-alerts-table-label">STRATEGY NAME</div>
          <div class="my-alerts-item-value">
            <div class="ellipsis-2-lines">
              {{ item.title }}
            </div>
          </div>
        </div>

        <div class="hit-rate-item my-alerts-table-item">
          <div class="my-alerts-table-label">
            {{
              strategy_type == 'pre-match-alerts' ? 'HIT RATE' : 'STRIKE RATE'
            }}
          </div>
          <div
            class="my-alerts-item-value"
            v-if="strategy_type == 'pre-match-alerts'"
          >
            <span
              :class="$getColor(item.hit_rate, 'text-')"
              v-if="item.hit_rate !== null"
            >
              {{ item.hit_rate | TwoDecimal }}%
            </span>
            <b-button
              variant="outline-info"
              style=""
              v-else
              size="sm"
              :to="`/pre-match-alerts/track/${item._id}`"
            >
              Calculate
            </b-button>
          </div>
          <div class="my-alerts-item-value" v-else>
            <span :class="$getColor(item.strike_rate, 'text-')">
              {{ item.strike_rate | TwoDecimal }}%
            </span>
          </div>
        </div>

        <div class="picks-sent-item my-alerts-table-item">
          <div class="my-alerts-table-label">PICKS SENT</div>
          <div class="my-alerts-item-value">
            {{ item.picks_sent }}
          </div>
        </div>

        <div class="last-edited-item my-alerts-table-item">
          <div class="my-alerts-table-label">LAST EDITED</div>
          <div class="my-alerts-item-value">
            <span :class="item.updated_at">
              {{ $moment(item.updated_at).format('ddd MMM D YYYY') }}
            </span>
          </div>
        </div>

        <div class="status-item my-alerts-table-item">
          <div class="my-alerts-table-label">STATUS</div>
          <div class="my-alerts-item-value">
            <b-dropdown
              size="sm"
              class="footy-dropdown"
              :class="item.trusted ? '' : 'testing'"
              no-caret
            >
              <template slot="button-content">
                {{ item.trusted ? 'Trusted' : 'Testing' }}

                <span class="material-icons-outlined"> expand_more </span>
              </template>
              <b-dropdown-item @click="untrustStrategy(item._id, index)"
                >Testing</b-dropdown-item
              >
              <b-dropdown-item @click="trustStrategy(item._id, index)"
                >Trusted</b-dropdown-item
              >
            </b-dropdown>
          </div>
        </div>

        <div class="active-item my-alerts-table-item">
          <div class="my-alerts-table-label">ACTIVE</div>
          <div class="my-alerts-item-value">
            <footy-switch
              v-model="item.active"
              @click.native.prevent="toggleActiveStatus(item._id, index)"
            >
            </footy-switch>
          </div>
        </div>

        <div class="actions-item my-alerts-table-item">
          <div class="my-alerts-item-value">
            <b-dropdown size="sm" text="View" no-caret class="multiactions-btn">
              <template slot="button-content">
                <!-- @click="$router.push(`/${data.item._id}/${type}/results`)" -->
                <div class="view-text" @click="$emit('viewfilter', item._id)">
                  View
                </div>
                <span class="btn-icon" style="">
                  <svg
                    width="11"
                    height="6"
                    viewBox="0 0 11 6"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9.66602 1L5.66602 5L1.66602 1"
                      stroke="#222622"
                      stroke-opacity="0.5"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </span>
              </template>
              <b-dropdown-item :to="`/${strategy_type}/edit/${item._id}`"
                >Edit</b-dropdown-item
              >
              <b-dropdown-item
                :to="`/pre-match-alerts/track/${item._id}`"
                v-if="strategy_type == 'pre-match-alerts'"
                >Track</b-dropdown-item
              >

              <b-dropdown-item :to="`/${strategy_type}/picks/${item._id}`"
                >Picks</b-dropdown-item
              >

              <b-dropdown-item @click="cloneStrategy(item._id)"
                >Clone</b-dropdown-item
              >

              <template v-if="is_pro_user">
                <b-dropdown-item @click="$emit('toggle-mute', index)"
                  ><span style="display: flex; align-items: center; gap: 8px">
                    <template v-if="item.muted">
                      Unmute <UnmuteIcon />
                    </template>
                    <template v-else> Mute <MuteIcon /> </template>
                  </span>
                </b-dropdown-item>
              </template>

              <!-- <b-dropdown-item @click="$emit('sharefilter', item._id)"
                >Share</b-dropdown-item
              > -->
              <b-dropdown-item
                @click="deleteStrategy(item._id)"
                variant="danger"
                active-class="bg-dangerous"
                link-class="bg-dangerous"
                class="bg-white"
              >
                Delete
              </b-dropdown-item>
            </b-dropdown>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import SharerModal from '~/components/SharerModal';
import {mapGetters} from 'vuex';
import MuteIcon from '~/static/icons/mute.svg';
import UnmuteIcon from '~/static/icons/unmute.svg';
export default {
  props: {
    strategies: Array,
    strategy_type: String,
  },
  components: {
    SharerModal,
    MuteIcon,
    UnmuteIcon,
  },
  data() {
    return {
      is_sharer_shown: false,
      strategyId: null,
      is_strategy_shown: false,
    };
  },
  computed: {
    ...mapGetters(['is_pro_user']),
  },
  methods: {
    async deleteStrategy(id) {
      if (confirm('Are you sure you want to delete this filter?')) {
        await this.$axios.deleteStrategy(id);
        this.$emit('deleteStrategy', id);
      }
    },

    shareFilter(id) {
      this.is_sharer_shown = true;
      this.strategyId = id;
    },
    toggleType(value) {
      this.$emit('toggleType', value);
    },
    toggleSort(value) {
      this.$emit('toggleSort', value);
    },
    editFilter(id) {
      this.$emit('editFilter', id);
    },
    refreshTable() {
      this.$emit('refreshTable');
    },

    async trustStrategy(id, index) {
      await this.$axios.trustStrategy(id);

      this.strategies[index].trusted = true;
    },
    async cloneStrategy(id) {
      await this.$axios.cloneStrategy(id);
      this.$emit('refetchTable');
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

<style lang="scss">
@import '~/assets/scss/colors';

@import '~/assets/scss/breakpoints';
.my-alerts-table {
  display: grid;
  gap: 0px;
  align-content: flex-start;
  min-height: 300px;
  .my-alerts-table-row {
    .my-alerts-table-label {
      color: $grey;
    }
    display: grid;
    grid-template-columns:
      minmax(0, 1.4fr) minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr)
      minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr);
    gap: 12px;
    border: 1px solid #f0f1f0;
    border-top: none;
    padding: 16px;
    .my-alerts-table-label {
      display: none;
    }
  }
  .my-alerts-table-head {
    border: none;
    // padding: 4px 16px;
    border-top: 1px solid #f0f1f0;
    border-bottom: 1px solid #f0f1f0;
  }
}
@media screen and (min-width: $lg) {
  .my-alerts-table {
    .my-alerts-table-row {
      .my-alerts-table-item {
        align-items: center;

        display: grid;
      }
      .my-alerts-table-label {
        display: none;
      }
    }
  }
}

@media screen and (max-width: $lg) {
  .my-alerts-table {
    gap: 12px;
    .my-alerts-table-row {
      .my-alerts-table-label {
        display: block;
        margin-bottom: 8px;
      }
      .actions-item {
        grid-column: span 2;
        .btn {
          width: 100%;
        }
      }
      border-top: 1px solid #f0f1f0;

      border-radius: 4px;
      grid-template-columns: 1fr 1fr;

      .hide-on-mobile {
        display: none;
      }
    }
    .my-alerts-table-head {
      display: none;
    }
  }
}
</style>
