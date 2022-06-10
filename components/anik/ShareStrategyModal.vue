<template>
  <ModalOnMobile v-model="modal" :is_a_modal="true">
    <div class="share-strategy-modal row mt-2 mt-lg-0 py-4 px-lg-2">
      <div class="col-12 mb-4">
        <div class="d-flex justify-content-between align-items-center">
          <h3 class="fw-600 fs-m-22" v-if="mode === 'strategy'">
            Share this strategy
          </h3>
          <h3 class="fw-600 fs-m-22" v-else>Share this profile</h3>
          <b-button
            variant="white"
            class="float-right rounded px-2"
            @click="modal = !modal"
          >
            <span class="material-icons"> close </span>
          </b-button>
        </div>
      </div>
      <div class="col-12">
        <div class="border border-primary p-3 rounded-10">
          <div v-if="mode === 'strategy'">
            <p class="text-dark fw-500">{{ strategy.title }}</p>
            <div class="d-flex flex-wrap gap-20 fw-500 mt-3">
              <p class="d-flex align-items-center">
                <IconRating class="mr-2" />
                <span v-if="strategy.rating">{{ strategy.rating }}(5.0)</span>
                <span v-else>No Rating Yet</span>
              </p>
              <p class="d-flex align-items-center">
                <IconSubscribers class="mr-2" />
                {{ strategy.subscribers }} Subscribers
              </p>
              <p class="d-flex align-items-center text-grey">
                <IconHitRate class="mr-2" v-if="strategy.hit_rate" />
                <IconDash v-else />
                <span
                  class="mr-1"
                  :class="strategy.hit_rate ? 'text-primary' : ''"
                >
                  {{ strategy.hit_rate }}%
                </span>
                Hit Rate
              </p>
            </div>
          </div>
          <div class="d-flex align-items-center flex-column flex-lg-row" v-else>
            <div class="share-modal-avatar">
              <img
                :src="profile.avatar"
                class="img-fluid"
                :alt="profile.name"
              />
            </div>
            <div class="flex-1 ml-lg-3 mt-2 mt-lg-0">
              <h3 class="fw-600 fs-m-18">
                {{ profile.name }}
                <span class="text-grey fw-500 fs-16 fs-m-14">
                  @{{ profile.username }}
                </span>
              </h3>
              <p class="d-flex align-items-center">
                <img
                  :src="profile.address.flag"
                  :alt="profile.address.country"
                  class="img-fluid h-15"
                />
                <span class="text-grey fs-m-16 ml-2">
                  {{ profile.address.city }}, {{ profile.address.country }}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="col-12">
        <div class="modal-share-button d-flex gap-40 my-4">
          <button
            type="button"
            class="d-flex justify-content-center align-items-center"
          >
            <IconFacebook />
          </button>
          <button
            type="button"
            class="d-flex justify-content-center align-items-center"
          >
            <IconTwitter />
          </button>
          <button
            type="button"
            class="d-flex justify-content-center align-items-center"
          >
            <IconTelegram />
          </button>
          <button
            type="button"
            class="d-flex justify-content-center align-items-center"
          >
            <IconWhatsapp />
          </button>
        </div>
      </div>
      <div class="col-12">
        <b-form-group>
          <label class="footy-label">or Copy link</label>
          <b-input-group class="footy-copy-input-prepend">
            <b-form-input
              b-input
              v-model="link"
              id="link"
              class="mb-2 footy-input copy-link"
              autocomplete="off"
              @keydown.prevent
            ></b-form-input>
            <b-input-group-append>
              <b-button type="button" variant="white" @click="copy">
                Copy
              </b-button>
            </b-input-group-append>
          </b-input-group>
        </b-form-group>
      </div>
    </div>
  </ModalOnMobile>
</template>
<script>
import ModalOnMobile from '~/components/common/ModalOnMobile.vue';
import IconFacebook from '~/static/images/icon/facebook.svg';
import IconTwitter from '~/static/images/icon/twitter.svg';
import IconTelegram from '~/static/images/icon/telegram.svg';
import IconWhatsapp from '~/static/images/icon/whatsapp.svg';
import IconSubscribers from '~/components/amigo-copier/assets/icons/subscribers.svg';
import IconRating from '~/components/amigo-copier/assets/icons/rating.svg';
import IconHitRate from '@/components/amigo-copier/assets/icons/hit-rate.svg';
import IconDash from '@/components/amigo-copier/assets/icons/dash.svg';

export default {
  name: 'share-strategy-modal',
  components: {
    ModalOnMobile,
    IconFacebook,
    IconTwitter,
    IconTelegram,
    IconWhatsapp,
    IconSubscribers,
    IconRating,
    IconHitRate,
    IconDash,
  },
  data() {
    return {
      modal: false,
      mode: '',
      strategy: {
        title: '',
        rating: 0,
        subscribers: 0,
        hit_rate: 0,
      },
      profile: {
        avatar: '',
        name: '',
        username: '',
        address: {},
      },
      link: '',
    };
  },

  methods: {
    openModal(data) {
      if (data.mode === 'strategy') {
        this.strategy.title = data.title;
        this.strategy.rating = data.rating;
        this.strategy.subscribers = data.subscribers;
        this.strategy.hit_rate = data.hit_rate;
        this.link = 'http://footyamigo.com/strategies/over-2-5-goals';
      } else {
        this.profile.avatar = data.avatar;
        this.profile.name = data.name;
        this.profile.username = data.username;
        this.profile.address = data.address;
        this.link = 'http://footyamigo.com/strategies/over-2-5-goals';
      }
      this.mode = data.mode;
      this.modal = true;
    },

    copy() {
      navigator.clipboard.writeText(this.link);
      this.$bvToast.toast(`Link Copied`, {
        title: `Success!`,
        variant: 'success',
        toaster: 'b-toaster-top-right',
        solid: true,
      });
    },
  },

  created() {
    this.$nuxt.$on('triggerShareStrategyModal', (data) => {
      this.openModal(data);
    });
  },

  beforeDestroy() {
    this.$nuxt.$off('triggerShareStrategyModal');
  },
};
</script>
