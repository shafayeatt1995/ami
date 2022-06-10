<template>
  <div class="amigo-listing fw-500">
    <b-img
      fluid
      src="https://i.imgur.com/fPvyG6H.jpg"
      class="amigo-listing__featured-image"
    />
    <div class="amigo-listing__body d-grid gap-10">
      <div class="fs-14">
        {{ title }}
      </div>
      <div class="d-flex fs-13 gap-30">
        <div>
          <rating-icon class="mb-1"> </rating-icon>
          <div v-if="rating">{{ rating }}(5.0)</div>
          <div v-else>No Rating Yet</div>
        </div>
        <div>
          <subscribers-icon class="mb-1"> </subscribers-icon>
          <div>{{ subscribers }} Subscribers</div>
        </div>
      </div>
    </div>
    <div class="amigo-listing__footer fs-13">
      <div class="text-grey">
        <dash-icon class="mr-2" v-if="!hit_rate"></dash-icon>
        <hit-rate-icon v-else> </hit-rate-icon>
        <span :class="{'text-primary': hit_rate}"> {{ hit_rate }}</span>
        % Hit Rate
      </div>
      <div class="d-flex gap-15">
        <favorited-icon v-if="is_favorited"></favorited-icon>

        <not-favorited-icon v-else></not-favorited-icon>
        <share-icon class="cursor-pointer" @click="openModal"></share-icon>
      </div>
    </div>
  </div>
</template>

<script>
import image from '@/components/amigo-copier/assets/images/thumbnail-3.jpeg';
import FavoritedIcon from '@/components/amigo-copier/assets/icons/favorited.svg';
import HitRateIcon from '@/components/amigo-copier/assets/icons/hit-rate.svg';
import RatingIcon from '@/components/amigo-copier/assets/icons/rating.svg';
import NotFavoritedIcon from '@/components/amigo-copier/assets/icons/not-favorited.svg';
import ShareIcon from '@/components/amigo-copier/assets/icons/share.svg';
import SubscribersIcon from '@/components/amigo-copier/assets/icons/subscribers.svg';
import DashIcon from '@/components/amigo-copier/assets/icons/dash.svg';
export default {
  props: {
    strategy_id: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '---',
    },
    rating: {
      type: Number,
      default: 0.0,
    },
    subscribers: {
      type: Number,
      default: 0,
    },
    hit_rate: {
      type: Number,
      default: 0,
    },

    // TODO
    is_favorited: {
      type: Boolean,
      default: false,
    },

    // Not needed for now
    // is_conditions_visible: {
    //   type: Boolean,
    //   default: false,
    // },
  },
  components: {
    FavoritedIcon,
    HitRateIcon,
    RatingIcon,
    NotFavoritedIcon,
    ShareIcon,
    SubscribersIcon,
    DashIcon,
  },

  data() {
    return {
      image_src: image,
    };
  },
  //   computed: {
  //     image_src() {
  //       // random number between 1 and 15
  //       const index = Math.floor(Math.random() * 15) + 1;
  //       return require(`../assets/images/thumbnail-${index}.jpeg`);
  //     },
  //   },

  methods: {
    openModal() {
      const data = {
        mode: 'strategy',
        title: this.title,
        rating: this.rating,
        subscribers: this.subscribers,
        hit_rate: this.hit_rate,
      };
      this.$nuxt.$emit('triggerShareStrategyModal', data);
    },
  },
};
</script>

<style lang="scss" scoped>
	.amigo-listing {
		border-radius: 11px;
		&__featured-image {
			border-radius: 11px 11px 0 0;
		}
		&__body {
			padding: 0 20px;
			border: 1px solid $border;
			border-bottom: none;
			padding: 11px 20px 15px 12px;
		}
		&__footer {
			@include justify-between;
			padding: 12px 20px 17px 14px;
			border: 1px solid $border;
			border-radius: 0 0 11px 11px;
		}
	}
</style>
