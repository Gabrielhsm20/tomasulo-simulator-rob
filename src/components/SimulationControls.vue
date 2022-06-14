<template>
  <section>
    <button
      v-if="!simulating"
      @click="simulate"
    >
      Simulate
    </button>
    <template v-else>
      <button @click="reset">Reset</button>
      <button
        class="ml-3"
        v-if="!finished"
        @click="next"
      >
        Next step
      </button>
      <span class="ml-3">Clock: {{ clock }}</span>
    </template>
  </section>
</template>

<script>
export default {
  name: 'SimulationControls',
  methods: {
    simulate() {
      this.$store.dispatch('tomasulo/simulate');
    },
    next() {
      this.$store.dispatch('tomasulo/next');
    },
    reset() {
      this.$store.commit('tomasulo/reset');
    },
  },
  computed: {
    simulating() {
      return this.$store.getters['tomasulo/getSimulating'];
    },
    finished() {
      return this.$store.getters['tomasulo/getFinished'];
    },
    clock() {
      return this.$store.getters['tomasulo/getClock'];
    },
  },
}
</script>