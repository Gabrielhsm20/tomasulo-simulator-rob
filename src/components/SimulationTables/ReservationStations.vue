<template>
  <section>
    <h2 class="mb-4">Reservation Stations</h2>
    <table>
      <thead>
        <tr>
          <th>Instruction</th>
          <th>Busy</th>
          <th>Op</th>
          <th>Vj</th>
          <th>Vk</th>
          <th>Qj</th>
          <th>Qk</th>
          <th>Destiny</th>
          <th>Address</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(el, index) in Object.values(functionalUnits)"
          :key="`reservation-station-${index}`"
        >
          <td class="capitalize">{{ el.id }}</td>
          <td>{{ el.busy ? '✔️' : '' }}</td>
          <td>{{ el.op }}</td>
          <td>{{ el.vj }}</td>
          <td>{{ el.vk }}</td>
          <td>{{ el.qj }}</td>
          <td>{{ el.qk }}</td>
          <td>{{ el.destiny ? `#${el.destiny}` : '' }}</td>
          <td>{{ el.address }}</td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<script>
export default {
  name: 'ReservationStations',
  computed: {
    functionalUnits() {
      return this.$store.getters['tomasulo/getFunctionalUnits'];
    },
  },
}
</script>

<style lang="scss" scoped>
</style>