<template>
  <section>
    <h2 class="mb-4">Reorder Buffer</h2>
    <table>
      <thead>
        <tr>
          <th>Order</th>
          <th>Busy</th>
          <th>Instruction</th>
          <th>Params</th>
          <th>Dispatch</th>
          <th>Execute</th>
          <th>WriteResult</th>
          <th>Commit</th>
          <th>Status</th>
          <th>Destiny</th>
          <th>Value</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(instruction, index) in instructionList.filter((el) => el.busy)"
          :key="`instruction-${index}`"
          :class="instruction.status.current"
        >
          <td>{{ index + 1 }}</td>
          <td>{{ instruction.busy && !instruction.status.commit && !instruction.status.descard ? '✔️' : '' }}</td>
          <td>{{ instruction.operation }}</td>
          <td>{{ formatParams(instruction) }}</td>
          <td>{{ instruction.status.dispatch }}</td>
          <td>{{ instruction.status.execute }}</td>
          <td>{{ instruction.status.writeResult }}</td>
          <td>{{ instruction.status.commit }}</td>
          <td>{{ instruction.status.current }}</td>
          <td>
            {{
              ['STUR'].includes(instruction.operation)
                ? `${instruction.data[2]} + ${instruction.data[1]}`
                : (
                  !['CBZ'].includes(instruction.operation)
                    ? instruction.data[0]
                    : ''
                  )
            }}
          </td>
          <td>{{ instruction.value }}</td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<script>
export default {
  name: 'ReorderBuffer',
  computed: {
    instructionList() {
      return this.$store.getters['tomasulo/getInstructionList'];
    },
  },
  methods: {
    formatParams(instruction) {
      const [X, Y, Z] = instruction.data;

      if (['STUR', 'LDUR'].includes(instruction.operation))
        return `${X}, [${Y}, ${Z}]`;
      if (['CBZ', 'CBNZ'].includes(instruction.operation))
        return `${X}, ${Y}`;

      return instruction.data.join(', ');
    },
  },
}
</script>

<style lang="scss" scoped>
tr.commit {
  background-color: rgba(0, 109, 5, 0.1);
}

tr.descard {
  background-color: rgba(255, 0, 0, 0.15);
}
</style>