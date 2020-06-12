<template lang='pug'>
.visualization(ref='visualization')
  svg#svg(
    v-if='simulation'
    pointer-events='all'
    preserveAspectRatio='xMinYMin meet'
    :viewBox='`0 0 ${renderer.width} ${renderer.height}`'
  )
    g.links(fill='none')
      path.link(
        v-for='l in graph.links' :key='l.id'
        :class='{ "matches-pillar": linkMatchesPillar(l) }'
        :d='linkArc(l)'
      )
    g.nodes
      template(v-for='n in graph.nodes' :key='n.id')
        circle.node(
          :class='{ "matches-pillar": nodeMatchesPillar(n) }'
          :style='{ fill: nodeColor(n) }'
          :cx='n.x'
          :cy='n.y'
        )
        foreignObject.annotation-container(
          :x='n.x - 50'
          :y='n.y - 50'
        )
          span.annotation(v-text='n.name')
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
  computed: mapGetters('visualizations/dualPowerProject', ['graph', 'node']),
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
    linkColor(link) {
      return this.linkMatchesPillar(link) ? this.pillar.color : null
    },
    linkMatchesPillar({ source, target }) {
      return [source, target].every(({ id }) =>
        this.nodeMatchesPillar(this.node(id))
      )
    },
    nodeColor(node) {
      if (this.nodeMatchesPillar(node)) return `rgb(${this.pillar.color})`
    },
    nodeMatchesPillar(node) {
      return node.pillars?.includes(this.pillar?.id)
    },
    onNodeDragStarted() {
      this.activeNodeDrags += 1
      this.restartSimulation()
    },
    onNodeDragged(_d, i) {
      this.restartSimulation({ force: true } /* ugly but works for now */)
      Object.assign(this.graph.nodes[i], { fx: event.x, fy: event.y })
    },
    onNodeDragEnded(_d, i) {
      this.activeNodeDrags -= 1
      this.relaxSimulation()
      Object.assign(this.graph.nodes[i], { fx: null, fy: null })
    },
    onResized() {
      this.setConstraints()
      this.initSimulation()
    },
    relaxSimulation({ force = false } = {}) {
      if (!this.activeNodeDrags || force)
        this.simulation.alphaTarget(0)
    },
    restartSimulation({ force = false } = {}) {
      if (!this.activeNodeDrags || force)
        this.simulation.alphaTarget(0.3).restart()
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
$stroke-width = 2px
$stroke-width-matches-pillar = 2 * $stroke-width

stroke-width()
  stroke-width 2px
  &.matches-pillar
    stroke-width 4px

.visualization
  width 100%
  height 100%

.link
  stroke-width()
  animation flow 2s linear infinite
  stroke $color-black-tint
  stroke-dasharray 10px
  &.matches-pillar
    stroke black
    animation-duration 1s

.node
  stroke-width()
  cursor grab
  fill white
  r 60px
  stroke black
  @media (hover: hover)
    &:hover
      fill $color-black-tint
  &:active
    cursor grabbing

.annotation-container
  /.nodes &
    width 100px
    height 100px

  &, & *
    pointer-events none
    user-select none

  .annotation
    position absolute
    top 50%
    left 50%
    text-align center
    transform translate(-50%, -50%)
    /.matches-pillar + &
      font-weight bold

@keyframes flow
  to
    stroke-dashoffset 100
</style>
