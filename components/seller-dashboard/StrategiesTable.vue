<template>
  <div class="strategies-table">
    <template v-if="strategies.length">
      <div class="strategies-table-head strategies-table-row text-grey">
        <div>STRATEGY NAME</div>
        <div>HIT/STRIKE</div>
        <div>PRICE</div>
        <div>SUBSCRIBERS</div>
        <div>CONDITIONS</div>
        <div>STATUS</div>
        <div>ACTION</div>
      </div>

      <div
        v-for="(item, index) in strategies"
        :key="index"
        class="strategies-table-row"
      >
        <div class="strategy-name-item strategies-table-item">
          <div class="strategies-table-label">STRATEGY NAME</div>
          <div class="strategy-item-value">
            <div class="ellipsis-2-lines">
              {{ item.sale_detail && item.sale_detail.title }}
            </div>
          </div>
        </div>

        <div class="hit-rate-item strategies-table-item">
          <div class="strategies-table-label">HIT/STRIKE</div>
          <div class="strategy-item-value" v-if="item.type == 'pre-match'">
            <span
              :class="$getColor(item.hit_rate, 'text-')"
              v-if="item.hit_rate !== null"
            >
              {{ item.hit_rate | TwoDecimal }}%
            </span>
          </div>
          <div class="strategy-item-value" v-else>
            <span :class="$getColor(item.strike_rate, 'text-')">
              {{ item.strike_rate | TwoDecimal }}%
            </span>
          </div>
        </div>

        <div class="picks-sent-item strategies-table-item">
          <div class="strategies-table-label">PRICE</div>
          <div class="strategy-item-value">
            £{{ item.sale_detail && item.sale_detail.price }}
          </div>
        </div>

        <div class="last-edited-item strategies-table-item">
          <div class="strategies-table-label">SUBSCRIBERS</div>
          <!-- TODO: show subscribers not 0 -->
          <div class="strategy-item-value">{{ item.subscribers || 0 }}</div>
        </div>

        <div class="status-item strategies-table-item">
          <div class="strategies-table-label">CONDITIONS</div>
          <div class="strategy-item-value">
            <div
              v-if="item.sale_detail && item.sale_detail.is_rules_hidden"
              class="text-danger"
            >
              <EyeOffIcon class="mr-1" />
              Hidden
            </div>
            <div v-else class="text-primary">
              <EyeOnIcon class="mr-1" />
              Visible
            </div>
          </div>
        </div>

        <div class="active-item strategies-table-item">
          <div class="strategies-table-label">STATUS</div>
          <div class="strategy-item-value">
            <footy-switch
              v-model="item.sale_detail.status"
              @click.native.prevent="$emit('toggleStatus', item._id)"
            >
            </footy-switch>
          </div>
        </div>

        <div class="actions-item strategies-table-item">
          <div class="strategy-item-value">
            <b-dropdown size="sm" text="View" no-caret class="multiactions-btn">
              <template slot="button-content">
                <div class="view-text" @click="$emit('viewStrategy', item._id)">
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
              <b-dropdown-item @click="$emit('editStrategy', item._id)">
                Edit
              </b-dropdown-item>
              <b-dropdown-item
                @click="$emit('removeStrategy', item._id)"
                variant="danger"
                active-class="bg-dangerous"
                link-class="bg-dangerous"
                class="bg-white"
              >
                Remove
              </b-dropdown-item>
            </b-dropdown>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import EyeOnIcon from '~/static/icons/seller-dashboard/eye-on.svg';
import EyeOffIcon from '~/static/icons/seller-dashboard/eye-off.svg';

export default {
  props: {
    strategies: Array,
  },
  data() {
    return {};
  },
  components: {
    EyeOnIcon,
    EyeOffIcon,
  },
};
</script>

<style lang="scss">
@import '~/assets/scss/colors';

@import '~/assets/scss/breakpoints';
.strategies-table {
  display: grid;
  gap: 0px;
  align-content: flex-start;
  min-height: 300px;
  font-weight: 600;
  .strategies-table-row {
    .strategies-table-label {
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
    .strategies-table-label {
      display: none;
    }
  }
  .strategies-table-head {
    border: none;
    // padding: 4px 16px;
    border-top: 1px solid #f0f1f0;
    border-bottom: 1px solid #f0f1f0;
  }
}
@media screen and (min-width: $lg) {
  .strategies-table {
    .strategies-table-row {
      .strategies-table-item {
        align-items: center;

        display: grid;
      }
      .strategies-table-label {
        display: none;
      }
    }
  }
}

@media screen and (max-width: $lg) {
  .strategies-table {
    gap: 12px;
    .strategies-table-row {
      .strategies-table-label {
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

      .strategy-item-value {
        // font-size: 0.625rem;
      }
    }
    .strategies-table-head {
      display: none;
    }
  }
}
</style>
