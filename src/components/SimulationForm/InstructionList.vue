<template>
  <section>
    <h2 class="mb-4">Instruction List</h2>
    <div
      class="w-100 d-flex justify-space-between"
      v-for="(instruction, index) in instructions"
      :key="`instruction-${index}`"
    >
      <select
        v-model="instruction.operation"
        class="mr-2"
      >
        <option
          v-for="(operation, index) in Object.keys(operations)"
          :key="`instruction-operation-${operation}-${index}`"
          :value="operation"
        >
          {{ operation }}
        </option>
      </select>
      <input type="text" v-model="instruction.data[0]" class="mr-2" />
      <input type="text" v-model="instruction.data[1]" class="mr-2" />
      <input type="text" v-model="instruction.data[2]" class="mr-2" />
      <button
        type="button"
        class="mb-2"
        style="width: 40px"
        @click="removeInstruction(instruction)"
      >
        X
      </button>
    </div>
    <button @click="addInstruction">
      Add
    </button>
  </section>
</template>

<script>
export default {
  name: 'InstructionList',
  components: {},
  methods: {
    addInstruction() {
      this.instructions = [
        ...this.instructions,
        { operation: '', data: [] },
      ];
    },
    removeInstruction(instruction) {
      this.instructions = this.instructions.filter((el) => el !== instruction);
    },
  },
  computed: {
    operations() {
      return this.$store.getters['getOperations'];
    },
    instructions: {
      get() {
        return this.$store.getters['getInstructions'];
      },
      set(instructions) {
        this.$store.commit('setInstructions', instructions);
      },
    },
  },
}
</script>

<style lang="scss" scoped>
</style>