<template>
  <div class="strategy-details-about">
    <div class="d-grid grid-col-md-2 gap-20">
      <div class="fw-500">
        <h3 class="fw-600 fs-18">Basic Details</h3>
        <h4 class="text-secondary fw-500 fs-14"></h4>

        <div class="text-grey mt-3 fs-14">Strategy Name</div>

        <div>{{ strategy_name }}</div>
        <h4 class="text-secondary fw-500 fs-14"></h4>
        <div class="text-grey mt-4 fs-14">Description</div>
        <div>
          {{ strategy_description }}
        </div>
      </div>
      <div>
        <h3 class="fw-600 fs-18">Reviews</h3>
        <h2 class="fw-600 fs-24 m-b-28 v-center gap-5">
          {{ average_rating }}(5.0)
          <b-form-rating
            v-model="average_rating"
            variant="primary"
            inline
            no-border
            class="bg-transparent p-0"
            size="lg"
            readonly
            precision="2"
          ></b-form-rating>
          <span class="fs-14 text-grey">{{ total_ratings_count }} Reviews</span>
        </h2>
        <div class="d-grid gap-10">
          <div
            class="rating-row gap-5 v-center"
            v-for="rating in ratings"
            :key="rating.rating"
          >
            <div class="fw-500 flex-1 text-grey">{{ rating.rating }}</div>
            <b-progress
              style="flex: 13; border-radius: 6px"
              :max="100"
              :min="0"
              :value="getPer(rating.count)"
              :variant="getVariant(rating.rating)"
            ></b-progress>
            <div style="flex: 2" class="text-grey fw-600">
              {{ getPer(rating.count) }}%
            </div>
            <div style="flex: 2" class="text-grey fw-500">
              {{ rating.count }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="d-grid grid-col-md-2 mt-4 gap-20">
      <div>
        <h3 class="fw-600 fs-18 m-b-11">What To Bet</h3>
        <div class="fw-500">
          <ball-icon class="mr-2"> </ball-icon>{{ outcome }}
        </div>
      </div>
      <div>
        <h3 class="fw-600 fs-18 m-b-11">Type of Strategy</h3>
        <div class="fw-500">
          <inplay-icon class="mr-2"></inplay-icon> InPlay
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BallIcon from '@/components/amigo-copier/assets/icons/ball.svg';
import InplayIcon from '@/components/amigo-copier/assets/icons/inplay.svg';
export default {
  components: {
    BallIcon,
    InplayIcon,
  },
  props: {
    strategy_name: {
      type: String,
      default: 'Over 0.5 1H Goals Strategy bet at first half 🤑',
    },
    strategy_description: {
      type: String,
      default:
        'For this strategy, I am expecting a goal at the first half, so you can place your bet at first half once the match starts or wait for minute 10.',
    },
    outcome: {
      type: String,
      default: '+0.5 First Half Goal',
    },
    ratings: {
      type: Array,
      default: () => [
        {
          rating: 5,
          count: 192,
        },
        {
          rating: 4,
          count: 60,
        },
        {
          rating: 3,
          count: 32,
        },
        {
          rating: 2,
          count: 32,
        },
        {
          rating: 1,
          count: 3,
        },
      ],
    },
  },

  computed: {
    total_ratings_count() {
      return this.ratings.reduce((acc, curr) => acc + curr.count, 0);
    },
    average_rating() {
      return (
        this.ratings.reduce((acc, curr) => acc + curr.rating * curr.count, 0) /
        this.total_ratings_count
      ).toFixed(1);
    },
  },
  methods: {
    getPer(val) {
      if (this.total_ratings_count) {
        return Math.round((val / this.total_ratings_count) * 100);
      } else {
        return 0;
      }
    },
    getVariant(rating) {
      if (rating == 5) {
        return 'primary';
      } else if (rating == 4) {
        return 'primary-2';
      } else if (rating == 3) {
        return 'yellow-2';
      } else if (rating == 2) {
        return 'warning';
      } else if (rating == 1) {
        return 'danger';
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.strategy-details-about {
  .rating-row {
    display: flex;
  }
}
</style>
