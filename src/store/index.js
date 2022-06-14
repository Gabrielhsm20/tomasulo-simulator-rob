import Vue from 'vue';
import Vuex from 'vuex';
import Tomasulo from './tomasulo';

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    tomasulo: Tomasulo,
  },
  state: {
    operations: {
      ADD: 'add',
      SUB: 'add',
      CBZ: 'add',
      STUR: 'load',
      MUL: 'mult',
      LDUR: 'load',
    },
    instructions: [
      { operation: 'ADD', data: ['X1', 'X4', 'X6'] },
      { operation: 'SUB', data: ['X2', 'X1', 'X4'] },
      { operation: 'CBZ', data: ['X4', '#2', ''] },
      { operation: 'STUR', data: ['X1', 'X6', '#0'] },
      { operation: 'SUB', data: ['X3', 'X5', 'X0'] },
      { operation: 'MUL', data: ['X0', 'X1', 'X0'] },
      { operation: 'LDUR', data: ['X13', 'X5', '#3'] },
    ],
    numberOfFunctionalUnits: {
      load: 6,
      add: 3,
      mult: 2,
    },
    cyclesPerInstruction: {
      load: 1,
      add: 1,
      mult: 1,
    },
    trueSpeculation: false,
  },
  mutations: {
    setOperations(state, value) {
      state.operations = value;
    },
    setInstructions(state, value) {
      state.instructions = value;
    },
    setNumberOfFunctionalUnits(state, value) {
      state.numberOfFunctionalUnits = value;
    },
    setCyclesPerInstruction(state, value) {
      state.cyclesPerInstruction = value;
    },
    setTrueSpeculation(state, value) {
      state.trueSpeculation = value;
    },
  },
  actions: {
  },
  getters: {
    getOperations: (state) => state.operations,
    getInstructions: (state) => state.instructions,
    getNumberOfFunctionalUnits: (state) => state.numberOfFunctionalUnits,
    getCyclesPerInstruction: (state) => state.cyclesPerInstruction,
    getTrueSpeculation: (state) => state.trueSpeculation,
  },
});
