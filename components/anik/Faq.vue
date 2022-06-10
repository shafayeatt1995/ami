<template>
  <div class="footy-faq">
    <div class="footy-faq-hero-area row rounded-20">
      <div class="col-lg-7">
        <div
          class="d-flex flex-column justify-content-center align-items-start h-100 pl-3 footy-faq-hero-area-left"
        >
          <h1 class="text-white fw-600">Make Money From Your Strategies 💰</h1>
          <p class="text-white fw-500 fs-24 mt-3">
            It's a WIN-WIN for everyone.
          </p>
        </div>
      </div>
      <div
        class="col-lg-5 d-flex justify-content-lg-end justify-content-between align-items-end mt-4 mt-lg-0 footy-faq-hero-area-right"
      >
        <img src="/images/faq/hero.jpg" class="img-fluid" alt="faq-hero" />
        <button class="text-white">
          <span class="material-icons"> play_arrow </span>
          Play Video
        </button>
      </div>
    </div>
    <div class="faq-info row">
      <div class="col-12">
        <h1 class="text-center fs-m-24 fw-600 mt-5 mb-4">How It Works</h1>
      </div>
      <div
        class="col-lg-4 mt-2 mb-5 mb-lg-0"
        v-for="(data, key) in info"
        :key="`info-${key}`"
      >
        <div class="faq-single-info text-center">
          <img :src="data.image" class="img-fluid" :alt="data.title" />
          <h4 class="fs-22 fs-m-20 fw-600 pt-2 mt-3 mb-2">{{ data.title }}</h4>
          <p class="text-grey fw-400 fs-14">{{ data.text }}</p>
        </div>
      </div>
    </div>
    <div class="faq-question row">
      <div class="col-12">
        <h1 class="text-center fs-m-24 fw-600 mt-5 mb-4">
          Frequently Asked Questions
        </h1>
      </div>
      <div
        class="col-lg-6"
        v-for="(data, key) in questions"
        :key="`question-${key}`"
      >
        <div class="faq-single-question border rounded-sm my-2">
          <h5
            class="text-grey fw-500 fs-14 d-flex justify-content-between cursor-pointer px-3"
            @click="showAnswer(key)"
          >
            <span> {{ data.question }} </span>
            <span
              class="material-icons"
              :class="
                active.some((item) => item === key) ? 'rotate-180' : 'rotate-0'
              "
            >
              keyboard_arrow_down
            </span>
          </h5>
          <slide-up-down
            :active="active.some((item) => item === key)"
            :duration="300"
          >
            <p
              class="text-grey fw-400 fs-14 p-3 border"
              v-html="data.answer"
            ></p>
          </slide-up-down>
        </div>
      </div>
    </div>

    <div
      class="faq-seller-account d-flex flex-column flex-lg-row justify-content-center align-items-center mt-5 rounded-10 px-4"
    >
      <p class="text-white fw-500 mr-0 mr-lg-4 mb-3 mb-lg-0 fs-18 fs-m-16">
        Create your seller account today.
      </p>
      <b-button
        variant="white"
        type="button"
        class="footy-button text-primary w-m-100"
        @click="$nuxt.$emit('triggerProAccountModal')"
      >
        Become A Seller Today
      </b-button>
    </div>
    <CancelSubscriptionModal />
  </div>
</template>
<script>
import CancelSubscriptionModal from '~/components/anik/CancelSubscriptionModal.vue';

export default {
  name: 'faq-component',
  components: {CancelSubscriptionModal},
  data() {
    return {
      active: [],
      info: [
        {
          image: '../images/faq/note.svg',
          title: 'Have a Pro Account',
          text: 'To start making money from your strategies you need to have an active Pro account.',
        },
        {
          image: '../images/faq/send.svg',
          title: 'List Your Strategies',
          text: 'List your top performing PreMatch and/or InPlay strategies for sale and we’ll handle the rest.',
        },
        {
          image: '../images/faq/fund.svg',
          title: 'Get Paid',
          text: 'You already make money with Footy Amigo, now you can make some extra whilst helping others.',
        },
      ],
      questions: [
        {
          question: 'How does the “Amigo Copier” page work?',
          answer: `<p>Footy Amigo helps football bettors and traders from around the world make smarter and well informed data-driven betting decisions. 
          <br><br>
          Our new innovative “Amigo Copier” functionality allows football bettors and traders to copy and clone successful strategies from other successful amigos, so that they can win more bets and make money. 
          <br><br>
          <b>Fun Fact:</b> The word “Amigo” in our name “Footy Amigo” is a portuguese word for “Friend”. At Footy Amigo, we strongly believe in friendships, brotherhood and the act of sharing. 
          <br><br>
          So, if you’ve got a high hit rate or strike rate strategy, there are hundreds and thousands of other amigos who would gladly pay to copy your strategy because at the end of the day - it’s a WIN-WIN for everyone. 
          <br><br>
          It’s simple - the buyer of a strategy makes money and wins more bets from the strategies they copy and the seller makes money from his strategy being copied.
          <br><br>
          It’s a WIN-WIN for everyone involved!
          <br><br>
          The bookies make billions of dollars every year, it’s time for the amigos to come together to take a slice of the cake.</p>`,
        },
        {
          question: 'How can I make money from my strategies?',
          answer: `If you have a strategy that has a high strike rate or hit rate, there are thousands of other amigos who will gladly pay to copy your strategy. 
          <br><br>
          Why would they pay? Well, because if a strategy has a high strike rate or hit rate, it means it’s profitable and the end goal of football betting and trading is to make profits. 
          <br><br>
          So anyone in their right mind will pay for a strategy that will make them money in a heartbeat! 
          <br><br>
          You can set the price for your strategy and everytime someone copies your strategy - you get paid. Yes, you get paid over and over again for the same strategy for every amigo that copies it.
          <br><br>
          For example, If your strategy is priced at £4.99, if 100 people copies it, that’s £499. 
          <br><br>
          The sky is just the beginning.`,
        },
        {
          question: 'Is there a fee to sell my strategies?',
          answer: `There’s no listing fee to sell your strategies. 
          <br><br>
          However, only users with an active PRO account can sell their strategies.
          <br><br>
          We want you to keep the lion share of your sale, you get to keep 70% of every sale made!`,
        },
        {
          question: 'Will people see the rules I used in my strategy?',
          answer: `No, if you don’t want them to. 
          <br><br>
          As we all know - the power of a profitable strategy is the rules and conditions used to create the strategy, so if you don’t want to share your secret sauce, you don’t have to. 
          <br><br>
          You have the power to make your rules and conditions hidden.
          <br><br>
          By doing this, it means any amigo who buys your strategy will only receive alerts for the strategy but will NOT be able to see the rules you’ve used to create your amazing strategy. 
          <br><br>
          A magician doesn’t give away his tricks right? Yes :) `,
        },
        {
          question: 'How much time will I need to Invest?',
          answer: `You don’t have to invest any time at all because all the heavy lifting is done for you by Footy Amigo. 
          <br><br>
          You already have your strategies in your account, in the next 60 seconds you can list any (or all) of your strategies for sale on the Amigo Copier marketplace and start making sales from day 1.
          <br><br>
          Once you list your strategy for sale, it will be visible to the community and ready to be bought and copied. 
          <br><br>
          We handle all the heavy lifting behind the scenes.
          `,
        },
        {
          question: 'How do I price my strategies?',
          answer: `We have set some preset prices for you to choose from and the price you decide to list your strategy is totally up to you.
          <br><br>
          The reason we don’t allow people to set their own custom prices is because we want to keep the marketplace clean and affordable for everyone. 
          <br><br>
          We don’t want people listing their strategies for sale for £500 for example because with such prices, you will hardly make any sale and people generally will not be inclined to buy anything that expensive. 
          <br><br>
          However, prices such as £4.99, £9.99 or £12.99 are affordable and straightforward and can be even more rewarding.  
          <br><br>
          Let’s assume you price your strategy at £9.99, with just 100 sales of your strategy, you will be making an extra £999 without having to do any hard work. 
          <br><br>
          And the good part of everything is that - <b>it’s a WIN-WIN</b> for everyone because your strategy will help the buyer make money. `,
        },
        {
          question: 'How do I get paid?',
          answer: `Getting paid is easy and straightforward. 
        <br><br>
        You can select to be paid via Bank Transfer, Paypal, Crypto or other means.  
        <br><br>
        Whatever payment method you choose, you will receive your earnings!`,
        },
        {
          question: 'Why do I need a Pro account to sell?',
          answer: `Every seller needs a Pro account on Footy Amigo to sell their strategies and the reasons are as follows: 
          <br><br>
          <b>1. Because it shows you are a “True Amigo”! </b>
          <br>
          We offer a 7days trial because we want people to use and test out Footy Amigo without any risk. During these 7days - most people can already see the benefits and value that Footy Amigo offers and they either choose to upgrade to Pro before their trial ends or after it ends. 
          <br><br>
          Just like any other software, not everyone who starts a free trial chooses to upgrade to a paid version when their trial ends. Only the true believers in the product and the value it offers are the ones who will upgrade to a paid plan to keep using it. 
          <br><br>
          We don’t want strangers and freebie seekers to make money from Footy Amigo, we want only true amigos like you who understand the value Footy Amigo offers to make money from it. 
          <br><br><br>

          <b>2. You will most likely make money. </b>
          <br>
          99.99% of people who sign up on Footy Amigo sign up because they NEED a profitable football betting strategy. They either want to create one or they are willing to copy or clone already created ones from other amigos. 
          <br><br>
          It’s that simple.
          <br><br>
          So, there are thousands of people who will pay to copy your strategies (if it has a high strike rate or hit rate) 
          <br><br>
          With this in mind, you are most likely going to make money from your strategies. 
          <br><br>
          Oh, and it’s a double win because you make money from betting with your strategies and also make money from other people copying your strategy. 
          <br><br>
          Its a WIN-WIN for everyone.`,
        },
      ],
    };
  },

  methods: {
    showAnswer(key) {
      const exist = this.active.some((item) => item === key);
      if (exist) {
        const index = this.active.findIndex((item) => item === key);
        this.active.splice(index, 1);
      } else {
        this.active.push(key);
      }
    },
  },
};
</script>
