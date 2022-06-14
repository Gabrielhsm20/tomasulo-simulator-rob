<template>
  <section>
    <SimulationForm class="py-3 form" v-if="!simulating" />
    <SimulationControls class="px-3 mt-5" />
    <SimulationTables class="mt-5" v-if="simulating" />
  </section>
</template>

<script>
import SimulationForm from './components/SimulationForm/Form.vue';
import SimulationControls from './components/SimulationControls.vue';
import SimulationTables from './components/SimulationTables/Tables.vue';

export default {
  name: 'App',
  components: {
    SimulationForm,
    SimulationControls,
    SimulationTables,
  },
  computed: {
    simulating() {
      return this.$store.getters['tomasulo/getSimulating'];
    },
  }
};
</script>

<style scoped>
</style>
