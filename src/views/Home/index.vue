<template lang='pug'>
main
  Filter(
    :options='pillars'
    @option-activated='onPillarFilterOptionActivated'
    @option-deactivated='onPillarFilterOptionDeactivated'
  )
  Visualization(
    v-if='ready'
    :activePillar='activePillar'
    :activeStep='activeStep'
  )
  Filter(
    type='linear'
    :options='steps'
    @option-activated='onStepFilterOptionActivated'
    @option-deactivated='onStepFilterOptionDeactivated'
  )
  router-link(to='/about')
</template>

<script>
import { mapGetters, mapMutations, mapState } from 'vuex'
import { Filter, Visualization } from './'

export default {
  name: 'Home',
  components: {
    Filter,
    Visualization
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
        return pillars.map(({ color, id, name, description }) => ({
          ...{ color, id, name, description },
          active: this.activePillarFilterOptions.includes(name)
        }))
      },
      steps({ steps }) {
        return steps.map(({ color, id, name, description }) => ({
          ...{ color, id, name, description },
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
main
  display flex
  flex 1
  flex-direction column
  justify-content space-between
  height 100%
  overflow hidden

.filter
  flex-shrink 0
  z-index 6910

.visualization
  position absolute
  top 0
  left 0
  right 0
  bottom 0
  z-index 6900

a
  z-index 6920
  display block
  position fixed
  bottom calc(20px + 3 * var(--spacing-md))
  left var(--spacing-sm)
  background-color var(--color-secondary)
  mask url(https://unpkg.com/@mdi/svg@5.3.45/svg/information-outline.svg)
  mask-size calc(var(--spacing-md) + var(--spacing-sm))
  content ' '
  width calc(var(--spacing-md) + var(--spacing-sm))
  height @width
  @media (min-width: 480px)
    bottom calc(24px + 3 * var(--spacing-md))
  @media (hover: hover)
    &:hover
      background-color var(--color)
      left calc(var(--spacing-sm) + calc(var(--spacing-xs) / 2))
</style>
