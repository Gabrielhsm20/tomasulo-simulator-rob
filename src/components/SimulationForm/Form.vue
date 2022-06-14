<template>
  <form class="row" @submit.prevent>
    <div class="col-12 col-md-6">
      <instruction-list />
    </div>
    <div class="col-12 col-md-6">
      <functional-units class="mt-5 mt-md-0"/>
      <cycles-per-instruction class=" mt-5"/>
      <div class="mt-5">
        <input type="checkbox" v-model="trueSpeculation">
        <span>True speculation? {{ trueSpeculation ? 'Y' : 'N' }}</span>
      </div>
    </div>
  </form>
</template>>

<script>
import InstructionList from './InstructionList.vue';
import CyclesPerInstruction from './CyclesPerInstruction.vue';
import FunctionalUnits from './FunctionalUnits.vue';

export default {
  name: 'SimulationForm',
  components: {
    InstructionList,
    CyclesPerInstruction,
    FunctionalUnits,
  },
  computed: {
    trueSpeculation: {
      get() {
        return this.$store.getters['getTrueSpeculation'];
      },
      set(trueSpeculation) {
        this.$store.commit('setTrueSpeculation', trueSpeculation);
      },
    },
  },
}
</script>

<style lang="scss" scoped>
input[type="checkbox"] {
  width: 20px;
  height: 20px;
  margin-right: 10px;
  transform: translateY(3px);
  cursor: pointer;
}
</style>