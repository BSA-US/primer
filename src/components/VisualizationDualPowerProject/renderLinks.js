import * as d3 from 'd3'

export default ({ graph: { links }}) =>
  d3
    .select('#svg')
    .append('g')
    .attr('fill', 'none')
    .attr('class', 'links')
    .selectAll('path')
    .data(links)
    .join('path')
    .attr('stroke-width', 1 /* d => Math.sqrt(d.value) */)
    .attr('stroke', 'rgba(0, 0, 0, 0.25)')
    .attr('marker-end', 'url(#triangle)')
