<template lang='pug'>
.visualization(ref='visualization')
  svg#svg(
    pointer-events='all'
    preserveAspectRatio='xMinYMin meet'
    :viewBox='`0 0 ${settings.svgWidth} ${settings.svgHeight}`'
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
</template>

<script>
import { mapGetters } from 'vuex'
import * as d3 from 'd3'
import { renderLinks, renderNodes } from './'

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
      simulation: null,
      color: d3.scaleOrdinal(d3.schemeCategory10),
      settings: {
        strokeColor: '#0022dd',
        width: 100,
        svgWidth: 600,
        svgHeight: 400
      }
    }
  },
  computed: {
    ...mapGetters(['graph']),
    nodes() { if (this.graph) return renderNodes(this) },
    links() { if (this.graph) return renderLinks(this) }
  },
  watch: {
    graph(newGraph, oldGraph) {
      console.log('graph')
      if (!this.simulation && newGraph !== oldGraph) this.initSimulation()
    },
    pillar(newPillar, oldPillar) {
      if (newPillar!==oldPillar) {
        d3.select('#svg').selectAll('g.nodes').remove()
      }
    }
  },
  mounted() {
    this.setConstraints()
    window.addEventListener('resize', this.onResized)

    if (module.hot) this.teardownD3()
    if (this.graph) this.initSimulation()
  },
  updated() {
    const { graph, linkArc, links, nodes, pillar } = this
    if (this.simulation)
      this.simulation.nodes(graph.nodes).on('tick', () => {
        links
          .attr('d', linkArc)
        nodes
          .attr('cx', d => d.x)
          .attr('cy', d => d.y)
      })
  },
  beforeDestroy() {
    window.removeEventLister('resize', this.onResized)
  },
  methods: {
    initSimulation() {
      const {
        graph: { links, nodes },
        settings: { svgWidth, svgHeight }
      } = this

      this.simulation = d3.forceSimulation(nodes)
        .force('link', d3.forceLink(links).distance(100).strength(0.1))
        .force('charge', d3.forceManyBody())
        .force('center', d3.forceCenter(svgWidth/2, svgHeight/2))
    },
    linkArc({ target: { x: tx, y: ty }, source: { x: sx, y: sy }}) {
      const r = Math.hypot(tx - sx, ty - sy)
      return `
        M${sx},${sy}
        A${r},${r} 0 0,1 ${tx},${ty}
      `
    },
    onResized() {
      this.setConstraints()
      this.teardownD3()
      this.initSimulation()
    },
    setConstraints() {
      this.settings.svgWidth = this.$refs.visualization.clientWidth
      this.settings.svgHeight = this.$refs.visualization.clientHeight
    },
    teardownD3() { d3.select('#svg').selectAll('g').remove() }
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
