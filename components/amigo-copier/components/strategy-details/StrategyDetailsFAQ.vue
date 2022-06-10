<template>
  <div>
    <h3 class="fs-18 fw-600 m-b-28">Frequently Asked Questions</h3>

    <div class="accordion bg-transparent" role="tablist">
      <div
        no-body
        class="mb-3 bg-transparent border br-8"
        v-for="(faq, index) in faqs"
        :key="index"
        :class="[active_faq == index ? 'border-primary' : 'border-border']"
      >
        <b-button
          variant="white"
          class="p-3 w-100 text-left fs-14 fw-600 br-8"
          :class="[active_faq == index ? 'text-primary ' : 'text-dark ']"
          @click="active_faq = index"
          >{{ faq.q }}</b-button
        >

        <b-collapse
          :visible="active_faq === index"
          accordion="my-accordion"
          role="tabpanel"
          class="p-3 br-8 bg-white"
          v-html="faq.a"
        >
        </b-collapse>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      active_faq: 0,
      faqs: [
        {
          q: 'How Does the Footy Amigo Marketplace Work?',
          a: `<p>We’ve built the Footy Amigo marketplace with TRANSPARENCY in mind, this is why every strategy for sale from a seller shows the Hit Rate and/or Strike Rate percentage publicly. 
</p><p>
The hit rate or strike rate CANNOT be manipulated by the seller because it is powered by our system. 
</p><p>
So, in a nutshell - if you see a strategy for sale with a 75% Hit Rate, you can be rest assured that the hit rate figure is accurately calculated by our system that is powered by Artificial Intelligence and not manually inserted or manipulated by the seller. 
</p><br><p>
So, there’s no room for human error or interference. </p>
`,
        },
        {
          q: 'Can I Trust The Seller?',
          a: `<p>We’ve built the Footy Amigo marketplace with TRANSPARENCY in mind, this is why every strategy for sale from a seller shows the Hit Rate and/or Strike Rate percentage publicly. 
</p><p>
The hit rate or strike rate CANNOT be manipulated by the seller because it is powered by our system. 
</p><p>
So, in a nutshell - if you see a strategy for sale with a 75% Hit Rate, you can be rest assured that the hit rate figure is accurately calculated by our system that is powered by Artificial Intelligence and not manually inserted or manipulated by the seller. 
</p><br><p>
So, there’s no room for human error or interference. </p>
`,
        },
        {
          q: 'What’s the Difference Between Buying a Strategy or Paying for Tips? ',
          a: `<p>We’ve built the Footy Amigo marketplace with TRANSPARENCY in mind, this is why every strategy for sale from a seller shows the Hit Rate and/or Strike Rate percentage publicly. 
</p><br><p>
The hit rate or strike rate CANNOT be manipulated by the seller because it is powered by our system. 
</p><br><p>
So, in a nutshell - if you see a strategy for sale with a 75% Hit Rate, you can be rest assured that the hit rate figure is accurately calculated by our system that is powered by Artificial Intelligence and not manually inserted or manipulated by the seller. 
</p><br><p>
So, there’s no room for human error or interference. </p>
`,
        },
        {
          q: 'What Happens After I Buy A Strategy?',
          a: `<p>We’ve built the Footy Amigo marketplace with TRANSPARENCY in mind, this is why every strategy for sale from a seller shows the Hit Rate and/or Strike Rate percentage publicly. 
</p><p>
The hit rate or strike rate CANNOT be manipulated by the seller because it is powered by our system. 
</p><p>
So, in a nutshell - if you see a strategy for sale with a 75% Hit Rate, you can be rest assured that the hit rate figure is accurately calculated by our system that is powered by Artificial Intelligence and not manually inserted or manipulated by the seller. 
</p><br><p>
So, there’s no room for human error or interference. </p>
`,
        },
        {
          q: 'Why Would Someone Sell Their Profitable Strategy?',
          a: `<p>We’ve built the Footy Amigo marketplace with TRANSPARENCY in mind, this is why every strategy for sale from a seller shows the Hit Rate and/or Strike Rate percentage publicly. 
</p><p>
The hit rate or strike rate CANNOT be manipulated by the seller because it is powered by our system. 
</p><p>
So, in a nutshell - if you see a strategy for sale with a 75% Hit Rate, you can be rest assured that the hit rate figure is accurately calculated by our system that is powered by Artificial Intelligence and not manually inserted or manipulated by the seller. 
</p><br><p>
So, there’s no room for human error or interference. </p>
`,
        },
      ],
    };
  },
};
</script>

<style></style>
