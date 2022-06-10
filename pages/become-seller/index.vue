<template>
  <GeneralPage
    page_title="Become A Seller"
    class=""
    extraHeaderClass="flex-row"
    page_description="Make money from your strategies 💰"
  >
    <template v-slot:howItWorks>
      <HowItWorks location="TODO:Location" />
    </template>

    <template v-slot:pageButton>
      <AvatarDropdown class="footy-button-group d-none d-lg-block" />
    </template>

    <div class="pt-4">
      <div class="intro">
        <div class="text m-4 my-5">
          <div class="fs-48 fs-m-28 fw-500">
            Make Money From Your Strategies 💰
          </div>
          <div class="fs-28 fs-m-22 fw-500 mt-3">
            It's a WIN-WIN for everyone.
          </div>
        </div>
        <b-img class="img m-4" src="/jpgs/amigo-copier.jpg"> </b-img>

        <div class="play-video">
          <PlayVideoIcon />
          <p class="ml-2">Play Video</p>
        </div>
      </div>
      <div class="how">
        <h2 class="text-center m-5">How It Works</h2>
        <div class="how-items">
          <div class="how-item m-3">
            <NotesIcon class="m-2 mb-4" />
            <div class="title h3">Have a Pro Account</div>
            <div class="text-center text-grey">
              To start making money from your strategies you need to have an
              active Pro account.
            </div>
          </div>
          <div class="how-item m-3">
            <SendIcon class="m-2 mb-4" />
            <div class="title h3">List Your Strategies</div>
            <div class="text-center text-grey">
              List your top performing PreMatch and/or InPlay strategies for
              sale and we'll handle the rest.
            </div>
          </div>
          <div class="how-item m-3">
            <DollarFundingIcon class="m-2 mb-4" />
            <div class="title h3">Get Paid</div>
            <div class="text-center text-grey">
              You already make money with Footy Amigo, now you can make some
              extra whilst helping others.
            </div>
          </div>
        </div>
      </div>
      <div class="faq mb-5">
        <h2 class="text-center my-5">Frequently Asked Questions</h2>
        <div class="faq-items d-grid grid-col-lg-1 col-gap-20">
          <FootyDropdownFAQ
            v-for="({title, text}, idx) in faqs"
            :title="title"
            :text="text"
            :key="'faq_' + idx"
          />
        </div>
      </div>
      <div class="footer centered wrap-on-mobile p-3">
        <h5 class="bs-f-text m-4">Create your seller account today.</h5>
        <b-button
          class="bs-f-button mx-3 p-2 px-4"
          to="/become-seller/registration"
          >Become A Seller Today</b-button
        >
      </div>
    </div>
  </GeneralPage>
</template>
<script>
import AvatarDropdown from '~/components/AvatarDropdown.vue';
import FootyDropdownFAQ from '~/components/common/FootyDropdownFAQ.vue';
import {become_seller} from '~/components/json/faqs.json';

export default {
  head() {
    return {
      title: this.$titles.dashboard,
    };
  },
  middleware: 'tester',
  data() {
    return {
      faqs: become_seller,
    };
  },
  components: {
    AvatarDropdown,
    FootyDropdownFAQ,
  },
};
</script>
<style lang="scss">
.intro {
  background: #61b15a;
  border-radius: 21px;
  color: white;
  position: relative;
  display: flex;
  .text {
    color: white;
    h1 {
      color: white;
    }
  }
  .play-video {
    position: absolute;
    right: 16px;
    bottom: 22px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}

.how {
  .how-items {
    display: flex;
    .how-item {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .title {
        font-size: 22px;
      }
    }
  }
}

.footer {
  background: linear-gradient(180deg, #60b15a -14.49%, #3b9534 134.58%);
  border-radius: 15px;
  .bs-f-text {
    color: white;
  }
  .bs-f-button {
    font-weight: 600;
    font-size: 13px;
    background: white;
    color: #60b15a;
    border-radius: 12px;
  }
}

@media screen and (max-width: $lg) {
  .intro {
    flex-direction: column;
  }
  .how {
    .how-items {
      flex-direction: column;
    }
  }
}
</style>
