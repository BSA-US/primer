<template lang='pug'>
main
  Filter(
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
import { mapGetters, mapState } from 'vuex'
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
  methods: {
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
  flex-direction column

.visualization
  flex 1
</style>
