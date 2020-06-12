<template lang='pug'>
ul(:class='type')
  li(v-for='{ active, color, name } in options' :key='name')
    button(
      :class='{ active }'
      :style='{ [`--color`]: color && `rgb(${color})`, [`--color-tint`]: color && `rgba(${color}, 0.5)` }'
      @click='onOptionClicked({ active, name })'
      v-text='name'
    )
</template>

<script>
const isOption = x =>
  Object.keys(x).filter(k =>
    ['active', 'color', 'name'].includes(k)
  ).length===3
const isType = x => ['linear', 'select', 'select-multiple'].includes(x)

export default {
  name: 'Filter',
  props: {
    options: { validator: values => values.every(isOption) },
    type: { default: 'select', validator: isType }
  },
  methods: {
    onOptionClicked({ active, name }) {
      if (this.type!=='select-multiple')
        this.options
          .filter(({ active }) => ({ active }))
          .forEach(({ name }) => this.$emit(`option-deactivated`, name))
      this.$emit(`option-${active ? 'de' : ''}activated`, name)
    },
  }
}
</script>

<style scoped lang='stylus'>
  ul
    border-bottom 1px solid black
    padding var(--spacing-sm) var(--spacing-md)
    scroll-snap-type x mandatory
    overflow-x scroll
    white-space nowrap

    li
      display inline-block
      scroll-snap-align center
      &:not(:last-child)
        margin-right var(--spacing-md)

  button
    padding var(--spacing-sm)
    border 1px solid transparent
    @media (hover: hover)
      &:hover
        border-color var(--color-tint, rgba(0, 0, 0, .25))
    &.active
      background-color var(--color-tint, rgba(0, 0, 0, .05))
      border-color var(--color, black)
      font-weight bold
</style>
