<template lang='pug'>
.visualization(ref='visualization')
  svg#svg(
    v-if='simulation'
    pointer-events='all'
    preserveAspectRatio='xMinYMin meet'
    :viewBox='`0 0 ${renderer.width} ${renderer.height}`'
  )
    defs
      marker#triangle(
        markerWidth='20'
        markerHeight='20'
        orient='auto'
        refX='30'
        refY='-3'
        viewBox='-5 -10 20 20'
      )
        path(
          d='M0,-5L10,0L0,5'
          fill='rgba(0,0,0,0.25)'
          transform='rotate(-10)'
        )
    g.links(fill='none')
      path.link(
        v-for='{ id, source, target } in graph.links' :key='id'
        stroke='rgba(0,0,0,0.25)'
        stroke-width='1'
        marker-end='url(#triangle)'
        :d='linkArc({ source, target })'
      )
    g.nodes
      circle.node(
        v-for='n in graph.nodes' :key='n.id'
        r='20'
        :fill='n.pillars.includes(pillar?.id) ? pillar.color : "white"'
        stroke='black'
        stroke-width='1'
        :cx='n.x'
        :cy='n.y'
      )
</template>

<script>
import { mapGetters } from 'vuex'
import {
  forceCenter,
  forceLink,
  forceManyBody,
  forceSimulation
} from 'd3-force'
import { drag } from 'd3-drag'
import { event, selectAll } from 'd3-selection'

export default {
  name: 'VisualizationDualPowerProject',
  props: {
    pillar: {
      validator: value =>
        Object.keys(k => ['active', 'color', 'id', 'name'].includes(k))
    }
  },
  data() {
    return {
      activeNodeDrags: 0,
      simulation: null,
      renderer: {
        width: 600,
        height: 400
      }
    }
  },
  computed: mapGetters(['graph']),
  watch: {
    graph(newGraph, oldGraph) {
      if (!this.simulation && newGraph !== oldGraph) this.initSimulation()
    },
    simulation(newSimulation, oldSimulation) {
      if (newSimulation && !oldSimulation) {
        selectAll('.node').call(drag()
          .on('start', this.onNodeDragStarted)
          .on('drag', this.onNodeDragged)
          .on('end', this.onNodeDragEnded)
        )
      }
    }
  },
  mounted() {
    this.setConstraints()
    window.addEventListener('resize', this.onResized)

    if (this.graph) this.initSimulation()
  },
  beforeDestroy() {
    window.removeEventLister('resize', this.onResized)
  },
  methods: {
    initSimulation() {
      const {
        graph: { links, nodes },
        renderer: { width, height }
      } = this

      this.simulation = forceSimulation(nodes)
        .force('link', forceLink(links).distance(100).strength(0.1))
        .force('charge', forceManyBody())
        .force('center', forceCenter(width/2, height/2))
    },
    linkArc({ target: { x: tx, y: ty }, source: { x: sx, y: sy }}) {
      const r = Math.hypot(tx - sx, ty - sy)
      return `
        M${sx},${sy}
        A${r},${r} 0 0,1 ${tx},${ty}
      `
    },
    onNodeDragStarted() {
      this.activeNodeDrags += 1
      if (!this.activeNodeDrags) this.simulation.alphaTarget(0.3).restart()
    },
    onNodeDragged(_d, i) {
      Object.assign(this.graph.nodes[i], { fx: event.x, fy: event.y })
    },
    onNodeDragEnded(_d, i) {
      this.activeNodeDrags -= 1
      if (!this.activeNodeDrags) this.simulation.alphaTarget(0)
      Object.assign(this.graph.nodes[i], { fx: null, fy: null })
    },
    onResized() {
      this.setConstraints()
      this.initSimulation()
    },
    setConstraints() {
      this.renderer.width = this.$refs.visualization.clientWidth
      this.renderer.height = this.$refs.visualization.clientHeight
    },
  }
}
</script>

<style scoped lang='stylus'>
.visualization
  width 100%
  height 100%

.controls
  position fixed
  top 16px
  left 16px
  background #f8f8f8
  padding 0.5rem
  display flex
  flex-direction column

.svg-container
  display table
  border 1px solid #f8f8f8
  box-shadow 1px 2px 4px rgba(0, 0, 0, .5)

.controls > * + *
  margin-top 1rem

label
  display block

.links line
  stroke #999
  stroke-opacity 0.6
</style>
