<template>
  <section class="row">
    <div class="col-12">
      <register-status />
    </div>
    <div class="col-12 col-lg-7 mt-5">
      <reorder-buffer />
    </div>
    <div class="col-12 col-lg-5 mt-5">
      <reservation-stations />
    </div>
  </section>
</template>

<script>
import ReorderBuffer from './ReorderBuffer.vue';
import ReservationStations from './ReservationStations.vue';
import RegisterStatus from './RegisterStatus.vue';

export default {
  name: 'SimulationTables',
  components: {
    ReorderBuffer,
    ReservationStations,
    RegisterStatus,
  }
}
</script>

<style lang="scss" scoped>
</style>