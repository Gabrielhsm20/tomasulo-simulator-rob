<template>
  <section>
    <h2 class="mb-4">Register Status</h2>
    <table>
      <thead>
        <tr>
          <th>Register</th>
          <th
            v-for="(registerKey, index) in Object.keys(registerStatus)"
            :key="`register-${index}`"
          >
            {{ registerKey }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><span style="font-weight: 500">Value</span></td>
          <td
            v-for="(registerKey, index) in Object.keys(registerStatus)"
            :key="`register-value-${index}`"
          >
            {{
              registerStatus[registerKey].instructionOrder
                ? `#${registerStatus[registerKey].instructionOrder}`
                : ''
            }}
          </td>
        </tr>
        <tr>
          <td><span style="font-weight: 500">Busy</span></td>
          <td
            v-for="(registerKey, index) in Object.keys(registerStatus)"
            :key="`register-value-${index}`"
          >
            {{ registerStatus[registerKey].busy ? '✔️' : '' }}
          </td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<script>
export default {
  name: 'RegisterStatus',
  computed: {
    registerStatus() {
      return this.$store.getters['tomasulo/getRegisterStatus'];
    },
    registerStatusKey() {
      return Object.keys(this.registerStatus).filter(
        (key) => key.startsWith('F')
      );
    },
  },
}
</script>

<style lang="scss" scoped>
</style>