<template>
  <section>
    <h2 class="mb-4">Number of FU's</h2>
    <div class="w-100 d-flex align-items-center">
      <span class="w-70 mr-2">Load</span>
      <input
        type="number"
        v-model="numberOfFunctionalUnits.load"
      />
    </div>
    <div class="w-100 d-flex align-items-center mt-2">
      <span class="w-70 mr-2">Add</span>
      <input
        type="number"
        v-model="numberOfFunctionalUnits.add"
      />
    </div>
    <div class="w-100 d-flex align-items-center mt-2">
      <span class="w-70 mr-2">Mult</span>
      <input
        type="number"
        v-model="numberOfFunctionalUnits.mult"
      />
    </div>
  </section>
</template>

<script>
export default {
  name: 'FunctionalUnits',
  computed: {
    numberOfFunctionalUnits: {
      get () {
        return this.$store.getters['getNumberOfFunctionalUnits'];
      },
      set(value) {
        this.$store.commit('setNumberOfFunctionalUnits', value);
      },
    },
  },
}
</script>

<style lang="scss" scoped>
</style>