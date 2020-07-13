<template lang='pug'>
.visualization(:id='rootId', ref='visualization')
  svg(
    v-if='simulation'
    pointer-events='all'
    preserveAspectRatio='xMinYMin meet'
    :style='rendererCssVariables'
    :viewBox='`0 0 ${renderer.width} ${renderer.height}`'
  )
    g.links(fill='none')
      g.link(
        v-for='l in graph.links' :key='l.id'
        :class='{ "matches-pillar": linkMatchesPillar(l), "matches-step": linkMatchesStep(l) }'
      )
        path(:d='linkArc(l)')
        foreignObject.annotation-container(
          width='100'
          height='100'
          :x='linkMidpoint(l).x - 50'
          :y='linkMidpoint(l).y - 50'
        )
          body(xmlns='http://www.w3.org/1999/xhtml')
            span.annotation(v-text='l.annotation')
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
            body(xmlns='http://www.w3.org/1999/xhtml')
              span.annotation(v-text='n.name' width="100px" height="100px")
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import {
  forceCenter,
  forceCollide,
  forceLink,
  forceManyBody,
  forceRadial,
  forceSimulation
} from 'd3-force'
import { drag } from 'd3-drag'
import { zoom } from 'd3-zoom'
import { event, select, selectAll } from 'd3-selection'
import { snakeCase } from 'change-case'

const { mapGetters, mapState } =
  createNamespacedHelpers('visualizations/dualPowerProject')

export default {
  name: 'VisualizationDualPowerProject',
  props: {
    activePillar: Object,
    activeStep: Object
  },
  data() {
    return {
      activeNodeDrags: 0,
      rootId: 'dual-power-project-visualization',
      simulation: null,
      renderer: {
        width: 0,
        height: 0,
        scale: 1
      }
    }
  },
  computed: {
    ...mapGetters(['links', 'node', 'stepIndex']),
    ...mapState(['nodes']),
    graph() {
      return {
        links: this.activePillar
          ? this.links.filter(l => this.linkMatchesPillar(l))
          : this.links,
        nodes: this.activePillar
          ? this.nodes.filter(n => this.nodeMatchesPillar(n))
          : this.nodes
      }
    },
    rendererCssVariables() {
      return {
        ['--width']: `${this.renderer.width}px`,
        ['--height']: `${this.renderer.height}px`,
        ['--scale']: this.renderer.scale
      }
    }
  },
  watch: {
    activePillar(newPillar, oldPillar) {
      if (newPillar !== oldPillar) this.initSimulation()
    },
    graph(newGraph, oldGraph) {
      if (!this.simulation && newGraph !== oldGraph) this.initSimulation()
    },
    simulation(newSimulation, oldSimulation) {
      if (newSimulation && !oldSimulation) {
        selectAll(`#${this.rootId} .node`).call(drag()
          .on('start', this.onNodeDragStarted)
          .on('drag', this.onNodeDragged)
          .on('end', this.onNodeDragEnded)
        )
      }
    }
  },
  mounted() {
    this.attachListeners()
    this.setConstraints()

    if (this.graph) this.initSimulation()
  },
  beforeDestroy() {
    this.detachListeners()
  },
  methods: {
    attachListeners() {
      window.addEventListener('resize', this.onResized)
      select(`#${this.rootId}`).call(zoom().on('zoom', this.onZoomed))
    },
    detachListeners() {
      window.removeEventLister('resize', this.onResized)
      select(`#${this.rootId}`).call(zoom().on('zoom', null)),
      selectAll(`#${this.rootId} .node`).call(drag()
        .on('start', null)
        .on('drag', null)
        .on('end', null)
      )
    },
    initSimulation() {
      const {
        graph: { links, nodes },
        renderer: { width, height }
      } = this

      this.simulation = forceSimulation(nodes)
        .force('link', forceLink(links).distance(360).strength(0.2))
        .force('charge', forceManyBody().strength(40))
        //.force('center', forceCenter(width/2, height/2))
        .force('radial', forceRadial(40, width/2, height/2))
        .force('collide', forceCollide(100))
    },
    linkMidpoint({ target: { x: tx, y: ty }, source: { x: sx, y: sy }}) {
      const [xMinuend, xSubtrahend] = tx > sx ? [tx, sx] : [sx, tx]
      const [yMinuend, ySubtrahend] = ty > sy ? [ty, sy] : [sy, ty]

      return {
        x: xSubtrahend + (xMinuend - xSubtrahend)/2,
        y: ySubtrahend + (yMinuend - ySubtrahend)/2
      }
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
    onZoomed() {
      this.renderer.scale = Math.max(0.1, Math.min(event.transform.k, 2))
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
      this.renderer.width = this.$refs.visualization.clientWidth * 100
      this.renderer.height = this.$refs.visualization.clientHeight * 100
    },
  }
}
</script>

<style scoped lang='stylus'>
stroke-width()
  stroke-width 1px
  &.matches-pillar
    stroke-width 2px

text-color()
  color var(--color-hint)
  &.matches-step
    color var(--color)

.visualization
  position relative

svg
  fill var(--background-color)
  width var(--width, 100%)
  height var(--height, 100%)
  position absolute
  top 50%
  left 50%
  transform translate(-50%, -50%) scale(var(--scale, 1))

.link
  stroke-width()
  animation flow 2s linear infinite
  path
    stroke var(--color-stroke)
    stroke-dasharray 10px
    ~/
      &.matches-pillar^[-1]
        animation-duration 1s
      &.matches-step^[-1]
        stroke var(--color)

.node
  stroke-width()
  cursor grab
  circle
    fill var(--background-color)
    stroke var(--background-color)
    r 60px
    &.foreground
      stroke var(--color)
      &:active
        cursor grabbing
      ~/
        &:not(.matches-step)^[-1]
          opacity 0.25 !important
        &:not(.matches-pillar)^[-1]
          @media(hover: hover)
            &:hover
              fill var(--color-tint)
        &.matches-pillar^[-1]
          @media(hover: hover)
            &:hover
              opacity 0.9

.annotation-container
  &, & *
    pointer-events none
    user-select none

  body
    display flex
    justify-content center
    align-items center

  .annotation
    text-align center
    color var(--color-hint)
    /.matches-step &
      color var(--color)
    /.link
      & ^[-1]
        font-size 12px
        display none
      &.matches-pillar ^[-1]
        display initial

    /.node
      &
        width 100px
        height @width
      &.matches-pillar ^[-1]
        font-weight bold

@keyframes flow
  from
    stroke-dashoffset 0
  to
    stroke-dashoffset -100
</style>
