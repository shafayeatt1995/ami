<template>
  <div class="d-grid gap-20" style="align-content: start">
    <h3 class="inner-heading">Recent Match Picks</h3>
    <footy-radio
      id="recent-picks"
      v-model="recent_pick.active"
      :options="recent_pick.modes"
      radioClass="w-100-mobile centered "
    >
    </footy-radio>

    <div class="fmt">
      <div class="fmt-head fmt-row text-grey">
        <div class="fixture-title">FIXTURE</div>
        <div class="created-at">SENT AT</div>
        <div class="actions centered">ACTIONS</div>
      </div>

      <b-skeleton-wrapper :loading="loading">
        <template #loading>
          <div v-for="index in 4" :key="'recent_picks' + index" class="fmt-row">
            <b-skeleton height="40px" class="fixture-title" />
            <b-skeleton height="40px" class="created-at" />
            <b-skeleton height="40px" class="actions" />
          </div>
        </template>
        <template v-if="picks.length">
          <div v-for="(pick, i) in picks" :key="i" class="fmt-row">
            <div class="fmt-label text-grey">FIXTURE</div>
            <div class="fmt-label text-grey">SENT AT</div>
            <div class="fixture-title">
              {{ pick.home_name }} - {{ pick.away_name }}
            </div>
            <div class="created-at">
              {{
                $moment
                  .utc(pick.sending_time * 1000)
                  .local()
                  .format('lll')
              }}
            </div>
            <div class="actions">
              <b-button
                variant="secondary"
                class="footy-button"
                block
                :to="'/fixtures?fixture_id=' + pick.fixture_id"
                >View</b-button
              >
            </div>
          </div>
        </template>
        <div v-else class="centered py-3">
          <h4 class="text-grey">No picks sent yet !</h4>
        </div>
      </b-skeleton-wrapper>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      is_strategy_shown: false,
      strategyId: null,
      recent_picks: {
        sent_to_user: [
          // { title: "Arsenal - Chelsea", date: new Date() },
          // { title: "Liverpool- Man United", date: new Date() },
          // { title: "Barcelona - Real Ma...", date: new Date() },
          // { title: "Bangladesh - Nigeria", date: new Date() },
        ],
        sent_to_others: [
          // { title: "Demo - Demo1", date: new Date() },
          // { title: "Daniel - Vishal", date: new Date() },
          // { title: "Laora - Lesson", date: new Date() },
          // { title: "Damn - Bangladesh", date: new Date() },
        ],
      },
      recent_pick: {
        modes: [
          {text: 'Sent to Others', value: 'sent_to_others'},
          {text: 'Sent to You', value: 'sent_to_user'},
        ],
        active: 'sent_to_others',
        fields: ['title', 'created_at', 'actions'],
      },
      loading: true,
    };
  },
  computed: {
    picks() {
      return this.recent_picks[this.recent_pick.active];
    },
  },
  mounted() {
    this.getRecentPicks();
  },
  methods: {
    async getRecentPicks() {
      try {
        this.loading = true;
        const picks = await this.$axios.getRecentPicks();
        this.recent_picks = picks;
      } catch (error) {
        console.log(error);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
