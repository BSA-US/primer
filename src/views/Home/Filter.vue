<template lang='pug'>
.filter(:class='type')
  ul
    li(v-for='{ active, color, name } in options' :key='name')
      button(
        :class='{ active }'
        :style='{ [`--color`]: active && color && `rgb(${color})` || null }'
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
    justify-content flex-start
    user-select none
    *::-webkit-scrollbar
      display none
    &.linear {
      justify-content flex-end
    }

  ul
    display inline-block
    padding calc(var(--spacing-sm) + var(--spacing-md))
    scroll-snap-type x mandatory
    overflow-x scroll
    overflow-y hidden
    white-space nowrap

    li
      display inline-block
      scroll-snap-align center

  button
    color var(--color-secondary)
    font-family var(--font-family-header)
    font-size 20px
    line-height 24px
    font-weight bold
    padding var(--spacing-sm) var(--spacing-md)
    @media (hover: hover)
      &:hover
        color var(--color)
    &.active
      color var(--color)
      @media (hover: hover)
        &:hover
          color var(--color-hint)
    /.linear &
      border-bottom 1px solid var(--color)
      position relative
      &::after
        display block
        position absolute
        bottom 0%
        left 50%
        transform translate(-50%, 50%)
        width 10px
        height @width
        background-color var(--color)
        mask url(https://unpkg.com/@mdi/svg@5.3.45/svg/circle.svg)
        mask-size cover
        content ' '
</style>
