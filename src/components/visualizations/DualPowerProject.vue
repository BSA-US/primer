<template lang='pug'>
.visualization(ref='visualization')
  svg(
    v-if='simulation'
    pointer-events='all'
    preserveAspectRatio='xMinYMin meet'
    :viewBox='`0 0 ${renderer.width} ${renderer.height}`'
  )
    g.links(fill='none')
      path.link(
        v-for='l in graph.links' :key='l.id'
        :class='{ "matches-pillar": linkMatchesPillar(l), "matches-step": linkMatchesStep(l) }'
        :d='linkArc(l)'
      )
    g.nodes
      template(v-for='n in graph.nodes' :key='n.id')
        g.node(:class='{ "matches-pillar": nodeMatchesPillar(n), "matches-step": nodeMatchesStep(n) }')
          circle.background(
            :cx='n.x'
            :cy='n.y'
          )
          circle.foreground(
            :style='{ fill: nodeColor(n) }'
            :cx='n.x'
            :cy='n.y'
          )
          foreignObject.annotation-container(
            width='100'
            height='100'
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
    activePillar: {
      validator: value =>
        Object.keys(k => ['active', 'color', 'id', 'name'].includes(k))
    },
    activeStep: {
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
  computed: mapGetters('visualizations/dualPowerProject', [
    'graph',
    'node',
    'stepIndex'
  ]),
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
      return this.linkMatchesPillar(link) ? this.activePillar.color : null
    },
    linkMatchesPillar({ source, target }) {
      return [source, target].every(({ id }) =>
        this.nodeMatchesPillar(this.node(id))
      )
    },
    linkMatchesStep({ source, target }) {
      return [source, target].every(({ id }) =>
        this.nodeMatchesStep(this.node(id))
      )
    },
    nodeColor(node) {
      if (this.nodeMatchesPillar(node)) return `rgb(${this.activePillar.color})`
    },
    nodeMatchesPillar({ pillars }) {
      return pillars?.includes(this.activePillar?.id)
    },
    nodeMatchesStep({ step }) {
      return !this.activeStep || step && this.stepIndex(step && step[0]) <= this.stepIndex(this.activeStep?.id)
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
      console.log(this.$refs.visualization)
      this.renderer.width = this.$refs.visualization.clientWidth
      this.renderer.height = this.$refs.visualization.clientHeight
    },
  }
}
</script>

<style scoped lang='stylus'>
$color-black-tint = rgba(0, 0, 0, 0.05)
$color-black-shadow = rgba(0, 0, 0, 0.1)
$color-black-hint = rgba(0, 0, 0, 0.25)
$color-white-tint = rgba(255, 255, 255, 0.1)
$color-white-shadow = rgba(255, 255, 255, 0.1)
$color-white-hint = rgba(255, 255, 255, 0.25)

stroke-width()
  stroke-width 2px
  &.matches-pillar
    stroke-width 4px

text-color()
  color $color-black-hint
  &.matches-step
    color black

.visualization
  position relative

svg
  width 100%
  height 100%

.link
  stroke-width()
  animation flow 2s linear infinite
  stroke $color-black-shadow
  stroke-dasharray 10px
  &.matches-pillar
    animation-duration 1s
    &.matches-step
      stroke black

.node
  stroke-width()
  cursor grab
  circle
    fill white
    r 60px
    &.foreground
      stroke black
      &:active
        cursor grabbing
      ~/
        &:not(.matches-step)^[-1]
          opacity 0.25 !important
        &:not(.matches-pillar)^[-1]
          @media(hover: hover)
            &:hover
              fill $color-black-tint
        &.matches-pillar^[-1]
          @media(hover: hover)
            &:hover
              opacity 0.9

.annotation-container
  &, & *
    pointer-events none
    user-select none

  .annotation
    position fixed
    top 50%
    left 50%
    text-align center
    transform translate(-50%, -50%)
    color $color-black-hint
    /.matches-step &
      color initial
    /.node
      &
        width 100px
        height @width
      &.matches-pillar ^[-1]
        font-weight bold

@keyframes flow
  to
    stroke-dashoffset -100
</style>
