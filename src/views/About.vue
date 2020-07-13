<template lang="pug">
mixin circles
  .circles: .circle(v-for="n in 4")

header
  span <router-link to="/">Title</router-link> is a map of a functioning Solidarity Economy.
main
  div
    +circles
    span These are pillars of the <a href="">Dual Power</a> strategy
  span These are institutions in a <a href="">Solidarity Economy</a>
  div
    span These are different milestones in a <a href="">Dual Power Project</a>'s development. They aren't meant to be prescriptive
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
      margin-bottom var(--spacing-lg)

  header
    margin-top var(--spacing-xl)
    font-size 40px
    line-height 40px
    a
      font-family var(--font-family-header)
      font-weight bold

  main
    flex 1
    border 1px solid var(--color)
    display flex
    flex-direction column
    justify-content space-between
    align-items center
    padding var(--spacing-md)

    & > *
      display flex
      flex-direction column
      max-width 240px
      &:not(:last-child)
        margin-bottom var(--spacing-lg)
      & > *:not(:last-child)
        margin-bottom var(--spacing-sm)
      &:first-child
        align-self flex-start
      &:last-child
        align-self flex-end
        align-items flex-end
        text-align right

  footer
    margin-bottom var(--spacing-xl)
    display flex
    justify-content space-between
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
    height var(--spacing-sm)
    background-color var(--color)
    mask url(https://unpkg.com/@mdi/svg@5.3.45/svg/circle.svg)
    mask-size var(--spacing-sm)
    content ' '
    &:not(:last-child)
      margin-right var(--spacing-sm)
</style>
