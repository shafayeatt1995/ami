<template>
  <b-row>
    <b-col>
      <div class="p-lg-15">
        <section class="footy-page-header" :class="extraHeaderClass">
          <slot name="avatar"> </slot>
          <div class="footy-page-header-info">
            <slot name="back-button"></slot>
            <div class="footy-page-title-wrapper">
              <div class="d-flex align-items-center">
                <h1 class="footy-page-title" v-html="page_title"></h1>
                <div class="how-it-works ml-5" v-if="!disable_how_it_works">
                  <slot name="howItWorks">
                    <PlayIcon class="mr-2" />
                    How it works?
                  </slot>
                </div>
              </div>
            </div>

            <h2 class="footy-page-description" v-html="page_description"></h2>
          </div>
          <div class="footy-page-header-buttons">
            <slot name="pageButton"> </slot>
          </div>
        </section>

        <slot> </slot>
      </div>
    </b-col>
  </b-row>
</template>

<script>
import PlayIcon from '~/static/icons/play.svg';

export default {
  props: {
    page_title: String,
    page_description: String,
    extraHeaderClass: String,
    disable_how_it_works: Boolean,
  },
  data() {
    return {};
  },

  components: {
    PlayIcon,
  },
};
</script>
