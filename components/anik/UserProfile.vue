<template>
  <div class="user-profile">
    <div class="row">
      <div class="col-12">
        <div
          class="user-profile-details d-flex flex-column flex-lg-row bg-light-grey p-0 p-lg-3 rounded-10 gap-20 pt-3 px-2"
        >
          <div class="align-self-center">
            <img
              :src="user.avatar"
              :alt="user.name"
              class="img-fluid user-profile-avatar"
            />
          </div>
          <div class="d-flex flex-column flex-1 px-2 px-lg-0">
            <div class="d-flex justify-content-between w-100">
              <h3 class="fw-600 mt-2 fs-m-20">
                {{ user.name }}
                <span class="text-grey fw-500 fs-16 fs-m-12">
                  @{{ user.username }}
                </span>
              </h3>
              <button
                type="button"
                class="text-grey profile-share-button mt-2"
                @click="openShareModal"
              >
                <IconShare />
              </button>
            </div>
            <div class="d-flex flex-column">
              <p class="d-flex align-items-center">
                <img
                  :src="user.address.flag"
                  :alt="user.address.country"
                  class="img-fluid h-15"
                />
                <span class="text-grey ml-2">
                  {{ user.address.city }}, {{ user.address.country }}
                </span>
              </p>
              <p class="text-grey mt-4 mb-2 mb-lg-4">{{ user.description }}</p>
              <div class="d-flex align-items-center mb-4">
                <button
                  type="button"
                  class="profile-play-video-button text-primary mr-3 fs-14 fs-m-12"
                >
                  <IconPlay />
                  Play Video
                </button>
                <p class="text-grey fs-m-14">
                  <span class="text-primary fw-600">05</span>
                  Public Strategies
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-12 mt-4 mb-2">
        <div class="d-flex justify-content-between align-items-center">
          <p class="fw-600 text-grey">
            <span class="text-primary">05</span> Public Strategies
          </p>
          <footy-dropdown-select
            type="text"
            class="profile-filter"
            :options="filter_options"
            v-model="filter_by"
          />
        </div>
      </div>
      <div
        class="col-lg-4 col-xl-3 my-3"
        v-for="(listing, index) in strategies"
        :key="index"
      >
        <AmigoListing
          :strategy_id="listing.id"
          :title="listing.title"
          :rating="listing.rating"
          :subscribers="listing.subscribers"
          :hit_rate="listing.hit_rate"
        />
      </div>
      <div class="col-12">
        <div class="fs-13 fw-600 text-success text-center mt-5">Load More</div>
      </div>
    </div>
    <ShareStrategyModal />
  </div>
</template>
<script>
import IconShare from '~/static/images/icon/share.svg';
import ShareStrategyModal from '~/components/anik/ShareStrategyModal.vue';
import AmigoListing from '~/components/amigo-copier/components/AmigoListing.vue';
import IconPlay from '~/static/icons/play.svg';

export default {
  name: 'user-profile',
  components: {
    IconShare,
    ShareStrategyModal,
    AmigoListing,
    IconPlay,
  },

  data() {
    return {
      filter_options: [
        {text: 'Popular', value: 'popular'},
        {text: 'Trending', value: 'trending'},
        {text: 'New', value: 'new'},
      ],
      filter_by: 'popular',

      user: {
        avatar: '../images/profile/avatar.png',
        name: 'Daniel Seavey',
        username: 'Daniel23',
        address: {
          flag: '../images/flag/gb.svg',
          city: 'London',
          country: 'United Kingdom',
        },
        description:
          'Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.',
      },

      strategies: [
        {
          id: '1',
          title: 'Over 2.5 Goals Strategy bet at first half',
          rating: 4.6,
          subscribers: 500,
          hit_rate: 89,
        },
        {
          id: '2',
          title: 'Over 2.5 Goals Strategy bet at first half',
          rating: 4.5,
          subscribers: 1500,
          hit_rate: 95,
        },
        {
          id: '3',
          title: 'Over 2.5 Goals Strategy bet at first half',
          rating: 4.2,
          subscribers: 1605,
          hit_rate: 86,
        },
        {
          id: '4',
          title: 'Over 2.5 Goals Strategy bet at first half',
          rating: 4.0,
          subscribers: 2570,
          hit_rate: 88,
        },
        {
          id: '5',
          title: 'Over 2.5 Goals Strategy bet at first half',
          rating: 3.8,
          subscribers: 1200,
          hit_rate: 74,
        },
        {
          id: '6',
          title: 'Over 2.5 Goals Strategy bet at first half',
          rating: 4.9,
          subscribers: 520,
          hit_rate: 95,
        },
        {
          id: '7',
          title: 'Over 2.5 Goals Strategy bet at first half',
          rating: 4.1,
          subscribers: 2500,
          hit_rate: 89,
        },
        {
          id: '8',
          title: 'Over 2.5 Goals Strategy bet at first half',
          rating: null,
          subscribers: 10,
          hit_rate: 0,
        },
      ],
    };
  },

  methods: {
    openShareModal() {
      const data = {
        mode: 'profile',
        avatar: this.user.avatar,
        name: this.user.name,
        username: this.user.username,
        address: this.user.address,
      };
      this.$nuxt.$emit('triggerShareStrategyModal', data);
    },
  },
};
</script>
