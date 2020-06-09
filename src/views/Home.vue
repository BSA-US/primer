<template lang='pug'>
main
  Filter(
    :options='pillars'
    @option-activated='onPillarFilterOptionActivated'
    @option-deactivated='onPillarFilterOptionDeactivated'
  )
  VisualizationDualPowerProject.visualization(
    v-if='ready'
    :pillar='activePillar'
  )
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { Filter, VisualizationDualPowerProject } from '@/components'

export default {
  name: 'Home',
  components: {
    Filter,
    VisualizationDualPowerProject
  },
  data() {
    return {
      activePillarFilterOptions: []
    }
  },
  computed: {
    ...mapGetters(['links']),
    ...mapState({
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
