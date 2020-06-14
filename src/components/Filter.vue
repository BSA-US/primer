<template lang='pug'>
.filter(:class='type')
  ul
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
  .filter
    display flex
    justify-content center
    user-select none
    *::-webkit-scrollbar
      display none

  ul
    display inline-block
    padding var(--spacing-sm) var(--spacing-md)
    scroll-snap-type x mandatory
    overflow-x scroll
    overflow-y hidden
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
    /.linear li:not(:last-child) &
      $icon-size = 24px
      position relative
      margin-right $icon-size
      &::after
        display block
        position absolute
        top 50%
        transform translateY(-50%)
        right -1.5 * $icon-size
        width $icon-size
        height @width
        background-image url(https://unpkg.com/@mdi/svg@5.3.45/svg/menu-right.svg)
        content ' '
</style>
