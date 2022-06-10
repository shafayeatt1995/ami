<template>
  <div class="border rounded-10 footy-shadow p-2 my-4">
    <div class="row">
      <div class="col-12">
        <div class="d-flex justify-content-between align-items-center mt-3">
          <h3 class="fw-600 text-dark fs-m-18">Sales Over Time</h3>
          <footy-dropdown-select
            type="text"
            class="chart-filter"
            :options="filter_options"
            v-model="filter_by"
          />
        </div>
      </div>
      <div class="w-100" height="350">
        <apexchart
          type="area"
          height="350"
          :options="chartOptions"
          :series="series"
        ></apexchart>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'seller-chart',
  data() {
    return {
      filter_options: [
        {text: 'Today', value: 'today'},
        {text: 'Yesterday', value: 'yesterday'},
        {text: 'Last 7 Days', value: 'last_7days'},
        {text: 'Last Month', value: 'last_month'},
        {text: 'Last Year', value: 'last_year'},
        {text: 'All Time', value: 'all_time'},
      ],
      filter_by: 'last_year',

      series: [
        {
          name: 'series A',
          data: [
            {
              x: '01-01-2022',
              y: '3190.00',
            },
            {
              x: '02-02-2022',
              y: '4045.00',
            },
            {
              x: '03-03-2022',
              y: '5185.00',
            },
            {
              x: '04-04-2022',
              y: '8214.00',
            },
            {
              x: '05-05-2022',
              y: '10914.25',
            },
            {
              x: '06-06-2022',
              y: '10086.00',
            },
            {
              x: '07-07-2022',
              y: '12054.00',
            },
            {
              x: '08-08-2022',
              y: '13087.00',
            },
            {
              x: '09-09-2022',
              y: '12000.00',
            },
            {
              x: '10-10-2022',
              y: '13033.00',
            },
            {
              x: '11-11-2022',
              y: '14010.00',
            },
            {
              x: '12-01-2022',
              y: '18101.00',
            },
          ],
        },
      ],
      chartOptions: {
        chart: {
          type: 'area',
          toolbar: {
            show: false,
          },
          zoom: {
            enabled: false,
          },
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          curve: 'smooth',
        },
        xaxis: {
          type: 'category',
          labels: {
            show: true,
            formatter: function (value) {
              return new Date(value).toLocaleString('default', {
                month: 'short',
              });
            },
            style: {
              colors: [],
              fontSize: '15px',
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 400,
              cssClass: 'chart-xaxis-label-spacing',
            },
            offsetX: 0,
            offsetY: 5,
          },
          axisBorder: {
            show: true,
            color: '#b4b3b3',
            height: 1,
            width: '100%',
            offsetX: 0,
            offsetY: 0,
          },
          crosshairs: {
            stroke: {
              color: '#60B15A',
              width: 2,
              dashArray: 0,
            },
          },
        },
        yaxis: {
          labels: {
            show: true,
            formatter: function (value) {
              if (value >= 1000) {
                return `${Math.round(value) / 1000} k`;
              } else {
                return Math.round(value);
              }
            },
            style: {
              colors: [],
              fontSize: '14px',
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 400,
              cssClass: 'chart-xaxis-label-spacing',
            },
            offsetX: -10,
          },
          axisBorder: {
            show: true,
            color: '#b4b3b3',
            offsetX: 10,
            offsetY: 0,
          },
        },
        markers: {
          size: 0,
          strokeWidth: 25,
          strokeColors: '#60b15ab3',
          strokeOpacity: 1,
          hover: {
            size: 10,
          },
        },
        colors: ['#60b15a'],
        tooltip: {
          enabled: true,
          followCursor: true,
          style: {
            fontSize: '12px',
            fontFamily: 'Poppins, sans-serif',
          },
          custom: function ({dataPointIndex, w}) {
            const data = w.globals.initialSeries[0].data;
            return `<div class="apex-chart-data-box">
              <p>${new Date(data[dataPointIndex].x).toLocaleString('default', {
                month: 'long',
              })} ${new Date(data[dataPointIndex].x).getFullYear()}</p>
              <h5>$ ${data[dataPointIndex].y}</h5>
              </div>
              `;
          },
        },
        grid: {
          padding: {
            right: 40,
          },
        },
      },
    };
  },
};
</script>
