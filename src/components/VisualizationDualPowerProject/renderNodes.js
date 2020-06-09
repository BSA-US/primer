import * as d3 from 'd3'

export default (vueInstance) =>
  d3
    .select('#svg')
    .append('g')
    .attr('class', 'nodes')
    .selectAll('circle')
    .data(vueInstance.graph.nodes)
    .enter()
    .append('circle')
    .attr('r', 20)
    .attr('fill', ({ pillars }) =>
      vueInstance.pillar && pillars[0]===vueInstance.pillar.id
        ? vueInstance.pillar.color
        : 'white'
    )
    .attr('stroke', 'black')
    .attr('stroke-width', 1)
    .call(d3.drag()
      .on('start', d => {
        if (!d3.event.active) vueInstance.simulation.alphaTarget(0.3).restart()
        Object.assign(d, { fx: d.x, fy: d.y })
      })
      .on('drag', d => Object.assign(d, { fx: d3.event.x, fy: d3.event.y }))
      .on('end', d => {
        if (!d3.event.active) vueInstance.simulation.alphaTarget(0)
        Object.assign(d, { fx: null, fy: null })
      })
    )
