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
      template(v-for='n in graph.nodes' :key='n.id')
        circle.node(
          r='60'
          :fill='n.pillars.includes(pillar?.id) ? pillar.color : "white"'
          stroke='black'
          stroke-width='1'
          :cx='n.x'
          :cy='n.y'
        )
        foreignObject.annotation-container(
          :x='n.x - 50'
          :y='n.y - 50'
          width='100'
          height='100'
          pointer-events='none'
        )
          p.annotation(v-text='n.name')
</template>

<script>
import { mapGetters } from 'vuex'
import {
  forceCenter,
  forceCollide,
  forceLink,
  forceManyBody,
  forceRadial,
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
        .force('link', forceLink(links).distance(360).strength(0.1))
        .force('charge', forceManyBody().strength(40))
        .force('center', forceCenter(width/2, height/2))
        .force('radial', forceRadial(40, width/2, height/2))
        .force('collide', forceCollide(80))
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
$color-black-tint = #e6

.visualization
  width 100%
  height 100%

.node
  cursor grab
  @media (hover: hover)
    &:hover
      fill $color-black-tint
  &:active
    cursor grabbing

.annotation
  position absolute
  top 50%
  left 50%
  text-align center
  transform translate(-50%, -50%)
</style>
