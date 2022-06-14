<template>
  <section>
    <h2 class="mb-4">Cycles per Instruction</h2>
    <div class="w-100 d-flex align-items-center">
      <span class="w-70 mr-2">Load</span>
      <input
        type="number"
        v-model="cyclesPerInstruction.load"
      />
    </div>
    <div class="w-100 d-flex align-items-center mt-2">
      <span class="w-70 mr-2">Add</span>
      <input
        type="number"
        v-model="cyclesPerInstruction.add"
      />
    </div>
    <div class="w-100 d-flex align-items-center mt-2">
      <span class="w-70 mr-2">Mult</span>
      <input
        type="number"
        v-model="cyclesPerInstruction.mult"
      />
    </div>
  </section>
</template>

<script>
export default {
  name: 'CyclesPerInstruction',
  computed: {
    cyclesPerInstruction: {
      get() {
        return this.$store.getters['getCyclesPerInstruction'];
      },
      set(cyclesPerInstruction) {
        this.$store.commit('setCyclesPerInstruction', cyclesPerInstruction);
      },
    },
  },
}
</script>

<style lang="scss" scoped>
</style>