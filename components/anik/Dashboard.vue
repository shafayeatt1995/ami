<template>
  <div>
    <SellerEarningStatus :status="earningStatus" />
    <SellerChart />
    <SellerTab />

    <SellerSellStrategyModal />
    <SellerEditStrategyModal />
  </div>
</template>

<script>
import SellerEarningStatus from '~/components/anik/EarningStatus.vue';
import SellerChart from '~/components/anik/Chart.vue';
import SellerTab from '~/components/anik/Tab.vue';
import SellerSellStrategyModal from '~/components/anik/SellStrategyModal.vue';
import SellerEditStrategyModal from '~/components/anik/EditStrategyModal.vue';
export default {
  name: 'seller-dashboard',
  components: {
    SellerEarningStatus,
    SellerChart,
    SellerTab,
    SellerSellStrategyModal,
    SellerEditStrategyModal,
  },

  data() {
    return {
      earningStatus: [
        {
          amount: '$24020.00',
          title: 'Total Earning',
          icon: 'images/statement/coin.svg',
        },
        {
          amount: '650',
          title: 'Total Sales',
          icon: 'images/statement/chart.svg',
        },
        {
          amount: '2400',
          title: 'Subscribers',
          icon: 'images/statement/people.svg',
        },
      ],
    };
  },
};
</script>
