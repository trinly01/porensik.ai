<template>
  <div class="row q-pa-md q-gutter-sm justify-center" :key="timestamp ">
    <div v-for="(que, i) in charts.filter(
      que => que.stat.max || que.stat.data && que.stat.data.filter(o => typeof o[1] === 'number').reduce((a, b) => a + (b[1] || 0), 0)
    )" :key="'quegdhfgjgf' + i" class="col" style="min-width: 300px;">
      <div class="row justify-center">
        {{ que.field }}
      </div>
      <div class="row justify-center text-caption">
        {{ que.description }}
      </div>
      <div class="row justify-center" v-if="que.stat && que.stat.max && ['Number', 'Rating'].includes(que.type.value)" >
        <q-knob
          readonly
          v-model="que.stat.min"
          :max="que.stat.max"
          show-value
          size="120px"
          :thickness="0.22"
          color="secondary"
          track-color="grey-3"
          class="text-secondary q-ma-md"
        >
          <div class="column items-center">
            <div class="text-h5">{{ que.stat.min }}</div>
            <div class="text-caption">min</div>
          </div>
        </q-knob>
        <q-knob
          readonly
          v-model="que.stat.max"
          :max="que.stat.max"
          show-value
          size="120px"
          :thickness="0.22"
          color="primary"
          track-color="grey-3"
          class="text-primary q-ma-md"
        >
          <div class="column items-center">
            <div class="text-h5">{{ que.stat.max }}</div>
            <div class="text-caption">max</div>
          </div>
        </q-knob>
        <q-knob
          readonly
          v-model="que.stat.mean"
          :max="que.stat.max"
          show-value
          size="120px"
          :thickness="0.22"
          color="warning"
          track-color="grey-3"
          class="text-warning q-ma-md"
        >
          <div class="column items-center">
            <div class="text-h5">{{ que.stat.mean }}</div>
            <div class="text-caption">ave</div>
          </div>
        </q-knob>
      </div>
      <div style="min-width: 300px;" class="row justify-center"
      v-else-if="que.stat && que.type.value === 'Select'">
        <!-- {{ que.stat.data  }} -->
        <!-- {{ que.stat.data.filter(o => typeof o[1] === 'number').reduce((a, b) => a + (b[1] || 0), 0) }} -->
        <GChart
          style="height: 300px;"
          type="PieChart"
          :data="$lodash.orderBy(que.stat.data, [1], ['desc'])"
          :options="{
            pieHole: 0.5,
            animation:{
              startup: true,
              duration: 1000,
              easing: 'inAndOut',
            }
          }"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { GChart } from 'vue-google-charts'
export default {
  props: ['node'],
  components: { GChart },
  beforeDestroy () {
    this.responseSrvc.destroy()
  },
  mounted () {
    this.responseSrvc = this.$dbCon.wingsService('juan-responses').on('dataChange', responses => {
      this.query()
    }).init()
  },
  data () {
    return {
      timestamp: Date.now(),
      charts: []
    }
  },
  methods: {
    async query () {
      this.charts = await Promise.all(this.node.format.filter(que => {
        return que.type.value && ['Number', 'Rating', 'Select'].includes(que.type.value)
      }).map(async que => {
        if (['Number', 'Rating'].includes(que.type.value)) {
          let query = {
            formID: this.node._id,
            $sort: {},
            $limit: 1
          }
          query.$sort[que.field] = 1
          let minResult = await this.responseSrvc.find({ query })
          query.$sort[que.field] = -1
          let maxResult = await this.responseSrvc.find({ query })
          query.$select = [que.field]
          query.$limit = 5000
          let meanResult = await this.responseSrvc.find({ query })
          console.log('mean', meanResult)
          que.stat = {
            min: minResult.data ? minResult.data[0][que.field] : 'n/a',
            max: maxResult.data ? maxResult.data[0][que.field] : 'n/a',
            mean: meanResult.data ? this.$lodash.round(this.$lodash.meanBy(meanResult.data, que.field), 2) : 'n/a'
          }
        } else if (que.type.value === 'Select') {
          let data = [['option', 'count']]
          await Promise.all(que.options.map(async opt => {
            const query = {}
            query[que.field + '.value'] = opt.value
            const query2 = {}
            query2[que.field] = opt.value
            let result = await this.responseSrvc.find({
              query: {
                $limit: 0,
                formID: this.node._id,
                $or: [
                  query,
                  query2
                ]
              }
            })
            data.push([opt.value, result.total])
            console.log('TRINMAR', query)
          }))
          console.log('Pogi si timi asd', data)
          que.stat = {
            data
          }
        }
        this.timestamp = Date.now()
        return que
      }))
    }
  }
}
</script>
