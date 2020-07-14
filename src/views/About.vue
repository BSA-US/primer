<template lang="pug">
mixin circles
  .circles: .circle(v-for="n in 4")

header
  span <router-link class="thick" to="/">This</router-link> is an overview of bodies in a <a href="https://dualpower.app/">Dual Power Project</a>.
main
  div
    +circles
    span These are pillars of Dual Power
  div.outline
    +circles
    span These are institutions & actions
  div
    span These are potential milestones in a Dual Power Project's development. Every project will develop differently
    +circles
footer
  span <a href="https://twitter.com/BlackSocialists">Follow @BlackSocialists</a> for more info
  span A <a href="https://github.com/BSA-US">BSA Open Tech</a> project
</template>

<style scoped lang="stylus">
  header, main, footer
    width calc(100% - var(--spacing-lg))
    max-width 640px
    align-self center
    &:not(:last-child)
      margin-bottom var(--spacing-md)
      @media (min-width 480px)
        margin-bottom var(--spacing-lg)

  header
    margin-top var(--spacing-lg)
    font-size 30px
    line-height 35px
    @media (min-width 480px)
      margin-top var(--spacing-xl)
      font-size 40px
      line-height 42px

  .thick
    font-family var(--font-family-header)
    font-weight bold

  main
    flex 1
    max-height 640px
    border 1px solid var(--color)
    display flex
    flex-direction column
    justify-content space-between
    align-items center
    padding var(--spacing-md)

    & > *
      display flex
      flex-direction column
      align-items center
      text-align center
      max-width 240px
      &:not(:last-child)
        margin-bottom var(--spacing-lg)
      & > *:not(:last-child)
        margin-bottom var(--spacing-sm)
      &:first-child
        align-self flex-start
        align-items flex-start
        text-align left
      &:last-child
        align-self flex-end
        align-items flex-end
        text-align right

  footer
    display flex
    justify-content space-between
    margin-bottom var(--spacing-lg)
    @media (min-width 480px)
      margin-bottom var(--spacing-xl)
    & > *
      &:not(:last-child)
        margin-right var(--spacing-lg)
      &:last-child
        text-align right


  .circles
    display flex

  .circle
    display block
    width var(--spacing-sm)
    height @width
    background-color var(--color)
    mask url(https://unpkg.com/@mdi/svg@5.3.45/svg/circle.svg)
    mask-size contain
    content ' '
    /.outline &
      mask url(https://unpkg.com/@mdi/svg@5.3.45/svg/circle-outline.svg)
      mask-size contain
    &:not(:last-child)
      margin-right var(--spacing-sm)
</style>
