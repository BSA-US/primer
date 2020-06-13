<template lang='pug'>
main
  Filter.filter(
    :options='pillars'
    @option-activated='onPillarFilterOptionActivated'
    @option-deactivated='onPillarFilterOptionDeactivated'
  )
  DualPowerProject.visualization(
    v-if='ready'
    :activePillar='activePillar'
    :activeStep='activeStep'
  )
  Filter.filter(
    type='linear'
    :options='steps'
    @option-activated='onStepFilterOptionActivated'
    @option-deactivated='onStepFilterOptionDeactivated'
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
      activePillarFilterOptions: [],
      activeStepFilterOptions: []
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
      steps({ steps }) {
        return steps.map(({ color, id, name }) => ({
          ...{ color, id, name },
          active: this.activeStepFilterOptions.includes(name)
        }))
      },
      ready: 'ready'
    }),
    activePillar() {
      return this.pillars.find(({ active }) => active)
    },
    activeStep() {
      return this.steps.find(({ active }) => active)
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
    },
    onStepFilterOptionActivated(name) {
      this.activeStepFilterOptions.push(name)
    },
    onStepFilterOptionDeactivated(name) {
      this.activeStepFilterOptions =
        this.activeStepFilterOptions.filter(o => o!==name)
    }
  }
}
</script>

<style scoped lang='stylus'>
$border = 1px solid black

main
  display flex
  flex 1
  flex-direction column
  height 100%
  overflow-y: hidden

.filter
  flex-shrink 0
  &:first-child
    border-bottom $border
  &:last-child
    border-top $border

.visualization
  flex 1
</style>
