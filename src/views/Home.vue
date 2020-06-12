<template lang='pug'>
main
  Filter.filter(
    :options='pillars'
    @option-activated='onPillarFilterOptionActivated'
    @option-deactivated='onPillarFilterOptionDeactivated'
  )
  DualPowerProject.visualization(
    v-if='ready'
    :pillar='activePillar'
  )
</template>

<script>
import { mapGetters, mapMutations, mapState } from 'vuex'
import { Filter } from '@/components'
import { DualPowerProject } from '@/components/visualizations'

export default {
  name: 'Home',
  components: {
    Filter,
    DualPowerProject
  },
  data() {
    return {
      activePillarFilterOptions: []
    }
  },
  computed: {
    ...mapGetters('visualizations/dualPowerProject', ['links']),
    ...mapState('visualizations/dualPowerProject', {
      pillars({ pillars }) {
        return pillars.map(({ color, id, name }) => ({
          ...{ color, id, name },
          active: this.activePillarFilterOptions.includes(name)
        }))
      },
      ready: 'ready'
    }),
    activePillar() {
      return this.pillars.find(({ active }) => active)
    }
  },
  created() {
    this.hideNav()
  },
  beforeRouteLeave(_to, _from, next) {
    this.showNav()
    next()
  },
  methods: {
    ...mapMutations('app', ['hideNav', 'showNav']),
    onPillarFilterOptionActivated(name) {
      this.activePillarFilterOptions.push(name)
    },
    onPillarFilterOptionDeactivated(name) {
      this.activePillarFilterOptions =
        this.activePillarFilterOptions.filter(o => o!==name)
    }
  }
}
</script>

<style scoped lang='stylus'>
main
  display flex
  flex 1
  flex-direction column
  height 100%

.filter >>> ul
  flex-shrink 0

.visualization
  flex 1
</style>
