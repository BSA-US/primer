<template lang='pug'>
.filter(:class='type')
  ul(:style="{ '--end-padding': endPadding }" ref='ul')
    li(v-for='({ active, color, name }, i) in options' :key='name')
      button(
        :ref='i===0 ? `first` : i===options.length-1 ? `last` : undefined'
        :class='{ active }'
        :style='{ [`--color`]: active && color && `rgb(${color})` || null, [`--color-hint`]: active && color && `rgba(${color}, 0.5)` || null }'
        @click='onOptionClicked($event, { active, name })'
        v-text='name'
      )
  span(
    v-if='type!=="select-multiple" && activeOptions[0]?.description'
    :class="{ inset: options.indexOf(activeOptions[0]) !== (isFlipped ? options.length-1 : 0) }"
    v-text='activeOptions[0].description'
  )
</template>

<script>
export default {
  name: 'Filter',
  props: {
    options: Array,
    type: { default: 'select', type: String }
  },
  data() {
    return { endPadding: 0 }
  },
  computed: {
    activeOptions() { return this.options.filter(({ active }) => active) },
    isFlipped() { return this.type==='linear' }
  },
  watch: {
    options() { this.onResized() }
  },
  mounted() {
    if (this.options) this.onResized()
    window.addEventListener('resize', this.onResized)
  },
  beforeDestroy() {
    window.removeEventLister('resize', this.onResized)
  },
  methods: {
    onOptionClicked(event, { active, name }) {
      const inset =
        parseInt(getComputedStyle(this.$refs.ul).getPropertyValue(
          `--spacing-${window.innerWidth >= 480 ? 'lg' : 'md'}`
        ), 10)

      if (!active) event.target.parentNode.parentNode.scrollTo({
        top: 0,
        left: event.target.parentNode.offsetLeft - (this.isFlipped
          ? window.innerWidth - event.target.offsetWidth - inset
          : inset),
        behavior: 'smooth'
      })
      if (this.type!=='select-multiple')
        this.activeOptions
          .forEach(({ name }) => this.$emit(`option-deactivated`, name))
      this.$emit(`option-${active ? 'de' : ''}activated`, name)
    },
    onResized() {
      if (this.$refs.first && this.$refs.last) {
        const endItemWidth =
          this.$refs[this.isFlipped ? 'first' : 'last'].offsetWidth
        const padding =
          parseInt(getComputedStyle(this.$refs.ul).getPropertyValue(
            `padding-${this.isFlipped ? 'right' : 'left'}`
          ), 10)

        this.endPadding = `${window.innerWidth - (endItemWidth + padding)}px`
      }
    }
  }
}
</script>

<style scoped lang='stylus'>
  .filter
    display flex
    flex-direction column
    align-items flex-start
    user-select none
    *::-webkit-scrollbar
      display none
    &.linear {
      align-items flex-end
    }

  ul
    display inline-block
    max-width 100%
    padding var(--spacing-sm) var(--spacing-xs)
    scroll-snap-type x mandatory
    overflow-x scroll
    overflow-y hidden
    white-space nowrap
    @media (min-width 480px)
      padding calc(var(--spacing-sm) + var(--spacing-md)) var(--spacing-md)
    /.filter
      &:not(.linear) ^[-1]
        padding-right: var(--end-padding, 0)
      &.linear ^[-1]
        padding-left: var(--end-padding, 0)

    li
      display inline-block
      /.filter
        &:not(.linear)
          & ^[-2]
            scroll-snap-align start
          & ^[-3]
            scroll-padding-left var(--spacing-md)
            @media (min-width 480px)
              scroll-padding-left var(--spacing-lg)
        &.linear
          & ^[-2]
            scroll-snap-align end
          & ^[-3]
            scroll-padding-right var(--spacing-md)
            @media (min-width 480px)
              scroll-padding-right var(--spacing-lg)

  button
    color var(--color-secondary)
    font-family var(--font-family-header)
    font-size 16px
    line-height 20px
    font-weight bold
    padding var(--spacing-sm)
    @media (min-width 480px)
      font-size 20px
      line-height 24px
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
        bottom 0
        left 50%
        transform translate(-50%, 50%)
        width 10px
        height @width
        background-color var(--color)
        mask url(https://unpkg.com/@mdi/svg@5.3.45/svg/circle.svg)
        mask-size cover
        content ' '

  span
    padding calc(var(--spacing-sm) + var(--spacing-xs))
    max-width 320px
    position relative
    left 0
    right 0
    transition all 150ms ease-in-out
    @media (min-width 480px)
      padding var(--spacing-lg)
    /.filter
      &:not(.linear) ^[-1]
        margin-top calc(-1 * var(--spacing-sm))
        padding-top 0
        @media (min-width 480px)
          margin-bottom calc(-1 * var(--spacing-md))
        &.inset
          left calc(var(--spacing-md) - var(--spacing-xs))
          right calc(-1 * calc(var(--spacing-md) - var(--spacing-xs)))
          @media (min-width 480px)
            left var(--spacing-md)
            right calc(-1 * var(--spacing-md))
      &.linear ^[-1]
        margin-bottom calc(-1 * var(--spacing-sm))
        padding-bottom 0
        order -1
        @media (min-width 480px)
          margin-bottom calc(-1 * var(--spacing-md))
        &.inset
          right calc(var(--spacing-md) - var(--spacing-xs))
          left calc(-1 * calc(var(--spacing-md) - var(--spacing-xs)))
          @media (min-width 480px)
            right var(--spacing-md)
            left calc(-1 * var(--spacing-md))
</style>
