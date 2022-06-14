const initialState = () => ({
  simulating: false,
  finished: false,
  clock: 0,
  trueSpeculation: null,
  instructionList: [],
  functionalUnits: {},
  registerStatus: {},
});

export default {
  namespaced: true,
  state: initialState,
  mutations: {
    reset (state) {
      const s = initialState()
      Object.keys(s).forEach(key => {
        state[key] = s[key]
      })
    },
    setSimulating(state, value) {
      state.simulating = value;
    },
    setFinished(state, value) {
      state.finished = value;
    },
    setClock(state, value) {
      state.clock = value;
    },
    setTrueSpeculation(state, value) {
      state.trueSpeculation = value;
    },
    setInstructionList(state, value) {
      state.instructionList = value;
    },
    updateInstruction(state, { index, data: value }) {
      const { status, ...data } = value;
      state.instructionList = state.instructionList.map((el, i) => {
        return (i !== index)
         ? el
         : {
          ...el,
          ...data,
          status: {
            ...el.status,
            ...status,
          },
         }
      });
    },
    setFunctionalUnits(state, value) {
      state.functionalUnits = value;
    },
    updateFuncionalUnit(state, { id, data }) {
      state.functionalUnits = {
        ...state.functionalUnits,
        [id]: {
          ...state.functionalUnits[id],
          ...data,
        },
      };
    },
    setRegisterStatus(state, value) {
      state.registerStatus = value;
    },
    updateRegisterStatus(state, { register, ...data }) {
      let registerStatus = state.registerStatus;
      registerStatus[register] = {
        ...registerStatus[register],
        ...data,
      };
      state.registerStatus = registerStatus;
    },
  },
  actions: {
    simulate({ commit, dispatch, rootGetters }) {
      commit('setSimulating', true);
      commit('setTrueSpeculation', rootGetters['getTrueSpeculation']);

      dispatch('createInstructionList');
      dispatch('createFunctionalUnits');
      dispatch('createRegisterStatus');
    },
    createInstructionList({ commit, rootGetters }) {
      const operations = rootGetters['getOperations'];
      const cyclesPerInstruction = rootGetters['getCyclesPerInstruction'];

      commit(
        'setInstructionList',
        rootGetters['getInstructions'].map((instruction, index) => {
          const unitType = operations[instruction.operation];
          return {
            index,
            order: index + 1,
            position: 0,
            type: unitType,
            time: cyclesPerInstruction[unitType] - 1,
            busy: false,
            status: {
              current: null,
              dispatch: null,
              execute: null,
              writeResult: null,
              commit: null,
              descard: null,
            },
            destiny: null,
            value: null,
            ...instruction,
          }
        })
      );
    },
    createFunctionalUnits({ commit, rootGetters }) {
      const numberOfFunctionalUnits = rootGetters['getNumberOfFunctionalUnits'];
      const functionalUnits = Object.keys(numberOfFunctionalUnits).reduce((acc, unit) => {
        for (let i = 0; i < numberOfFunctionalUnits[unit]; i++) {
          acc[unit + (i + 1)] = {
            id: unit + (i + 1),
            type: unit,
            busy: false,
            op: null,
            vj: null,
            vk: null,
            qj: null,
            qk: null,
            destiny: null,
            address: null,
          };
        }
        return acc;
      }, {});
      commit('setFunctionalUnits', functionalUnits);
    },
    createRegisterStatus({ commit }) {
      let registerStatus = {};
      for (let i = 0; i < 15; i += 1) {
        registerStatus[`X${i}`] = {
          busy: false,
          order: null,
          functionalUnit: null,
          value: null,
        };
      }
      commit('setRegisterStatus', registerStatus);
    },
    async next({ state, commit, dispatch }) {
      if (state.finished) return;

      commit('setClock', state.clock + 1);

      await dispatch('commitInstruction');
      await dispatch('writeInstructionsResult');
      await dispatch('executeInstructions');
      await dispatch('dispatchInstructions');

      if (state.instructionList.every(({ status }) => status.commit || status.descard))
        commit('setFinished', true);
    },
    commitInstruction({ state, commit }) {
      const instruction = state.instructionList.find((el) => el.status.writeResult && !el.status.commit);
      if (!instruction) return;

      commit('updateInstruction', {
        index: instruction.index,
        data: {
          status: {
            current: 'commit',
            commit: state.clock,
          },
        },
      });

      commit('updateRegisterStatus', {
        register: instruction.data[0],
        functionalUnit: null,
        order: null,
        busy: false,
        value: null,
      });
    },
    writeInstructionsResult({ state, commit, dispatch, rootGetters }) {
      const instruction = state.instructionList.find((el) => el.status.execute && !el.status.writeResult && !el.status.commit && !el.status.descard);
      if (!instruction) return;

      if (
        instruction.order > 1 &&
        !state.instructionList.every((el) =>
          el.index === instruction.index ||
          el.order > instruction.order ||
          ['commit', 'descard'].includes(el.status.current) 
        )
      ) return;

      // If the cycles by instruction starts count from the execution
      const cyclesPerInstruction = rootGetters['getCyclesPerInstruction'];
      if (cyclesPerInstruction[instruction.type] > state.clock - instruction.status.execute) return;

      // If the cycles by instruction begins to count after the writeResult of the previous instruction
      // if (instruction.time > 0) {
      //   commit('updateInstruction', { index: instruction.index, data: { time: instruction.time - 1 }});
      //   return;
      // }

      let functionalUnitsToFree = [];

      if (instruction.operation === 'CBZ') {
        if (!state.trueSpeculation) {
          for (
            let i = instruction.index;
            i <= instruction.index + parseInt(instruction.data[1].replace(/[^0-9]/g, ''));
            i++
          ) {
            commit('updateInstruction', {
              index: i,
              data: {
                status: i === instruction.index
                  ? {
                    current: 'commit',
                    commit: state.clock,
                  }
                  : {
                    current: 'descard',
                    descard: state.clock,
                  },
              }
            });
  
            commit('updateRegisterStatus', {
              register: state.instructionList[i]?.data[0],
              value: '',
              functionalUnit: null,
              order: null,
              busy: false,
            });
            functionalUnitsToFree.push(i + 1);
          }
        }
        else {
          commit('updateInstruction', {
            index: instruction.index,
            data: {
              status: {
                current: 'commit',
                commit: state.clock,
              },
            },
          });
          functionalUnitsToFree.push(instruction.order);
        }
      }
      else {
        commit('updateInstruction', {
          index: instruction.index,
          data: {
            status: {
              current: 'writeResult',
              writeResult: state.clock,
            },
            value: `${instruction.data[1]} + ${instruction.data[2]}`,
          },
        });
        functionalUnitsToFree.push(instruction.order);
      }

      const functionalUnits = state.functionalUnits;
      Object.keys(functionalUnits).forEach((key) => {
        const functionalUnit = functionalUnits[key];
        if (functionalUnit.busy && functionalUnitsToFree.includes(functionalUnit.destiny)) {
          dispatch('freeFunctionalUnit', functionalUnit);
        }
      });
    },
    async executeInstructions({ state, commit, dispatch }) {
      if (!state.instructionList.every((el) => el.busy)) return;

      await dispatch('updateFunctionalUnits');

      let functionalUnits = state.functionalUnits;

      Object.keys(functionalUnits).forEach((key) => {
        const functionalUnit = functionalUnits[key];
        const instruction = state.instructionList[functionalUnit?.instructionIndex];
        const isLoad = ['load'].includes(functionalUnit.type);

        if (
          functionalUnit.busy &&
          !instruction.status.execute &&
          !instruction.status.descard &&
          (
            (isLoad && functionalUnit.qi === null && functionalUnit.qj === null) ||
            (!isLoad && functionalUnit.vj !== null && (instruction.operation === 'CBZ' || functionalUnit.vk !== null))
          )
        ) {
          commit('updateInstruction', {
            index: instruction.index,
            data: {
              status: {
                current: 'execute',
                execute: state.clock,
              },
            },
          });
        }
      });

      commit('setFunctionalUnits', functionalUnits);
    },
    dispatchInstructions({ state, commit, dispatch, getters }) {
      const instruction = getters['getNextInstruction'];
      if (!instruction) return;

      const functionalUnit = getters['getEmptyFunctionalUnit'](instruction.type);
      if (!functionalUnit) {
        commit('updateInstruction', {
          index: instruction.index,
          data: {
            busy: true,
            position: instruction.position + 1,
          },
        });
        return;
      }

      dispatch('updateFunctionalUnit', { functionalUnit, instruction });

      commit('updateInstruction', {
        index: instruction.index,
        data: {
          busy: true,
          status: {
            current: 'dispatch',
            dispatch: state.clock,
          },
        },
      });

      if (
        !['CBZ'].includes(instruction.operation) &&
        (!['load'].includes(instruction.type) || instruction.operation === 'LDUR')
      ) {
        commit('updateRegisterStatus', {
          register: instruction.data[0],
          value: functionalUnit.id,
          order: instruction.order,
          busy: true,
        });
      }
    },
    freeFunctionalUnit({ commit }, functionalUnit) {
      commit('updateFuncionalUnit', {
        id: functionalUnit.id,
        data: {
          instructionIndex: null,
          busy: false,
          op: null,
          vj: null,
          vk: null,
          qj: null,
          qk: null,
          destiny: null,
          address: null,
        },
      });
    },
    updateFunctionalUnits({ state, dispatch }) {
      const functionalUnits = state.functionalUnits;
      Object.keys(functionalUnits).forEach((key) => {
        const functionalUnit = functionalUnits[key];
        if (functionalUnit.busy) {
          const instruction = state.instructionList[functionalUnit?.instructionIndex];
          dispatch(
            'updateFunctionalUnit',
            {
              functionalUnit,
              instruction,
            },
          );
        }
      });
    },
    updateFunctionalUnit({ state, commit }, { functionalUnit, instruction }) {
      let qi = null;
      let qj = null;
      let vj = null;
      let qk = null;
      let vk = null;

      let reg_j;
      let reg_k;
      let reg_j_inst;
      let reg_k_inst;

      if (['load', 'store'].includes(instruction.type)) {
        // if (instruction.type === 'store') {
        //   const functionalUnitToWait = state.registerStatus[instruction.data[0]];
        //   if (state.functionalUnits[functionalUnitToWait])
        //     qi = functionalUnitToWait;
        // }

        // const intFunctionalUnitToWait = state.registerStatus[instruction.data[2]];
        // if (state.functionalUnits[intFunctionalUnitToWait])
        //   qj = intFunctionalUnitToWait;
      }
      else {
        if (['CBZ'].includes(instruction.operation)) {
          reg_j = state.registerStatus[instruction.data[0]]?.value;
          reg_k = state.registerStatus[instruction.data[1]]?.value;
          reg_j_inst = instruction.data[0];
          reg_k_inst = instruction.data[1];
        } else {
            reg_j = state.registerStatus[instruction.data[1]]?.value;
            reg_k = state.registerStatus[instruction.data[2]]?.value;
            reg_j_inst = instruction.data[1];
            reg_k_inst = instruction.data[2]; 
        }

        if (!reg_j || reg_j === functionalUnit.id)
            vj = reg_j_inst;
        else
            if (
              state.functionalUnits[reg_j] &&
              state.functionalUnits[reg_j].order < instruction.order
            )
                qj = reg_j;
            else
                vj = reg_j;

        if (!['CBZ'].includes(instruction.operation)) {
          if (!reg_k || reg_k === functionalUnit.id)
              vk = reg_k_inst;
          else
              if (
                state.functionalUnits[reg_k] &&
                state.functionalUnits[reg_k].order < instruction.order
              )
                  qk = reg_k;
              else
                  vk = reg_k;
        }
      }

      let address;
      if (['CBZ'].includes(instruction.operation))
        address = `${instruction.data[1]} + ${instruction.data[0]}`
      else if (['load'].includes(instruction.type))
        address = `${instruction.data[1]} + ${instruction.data[2]}`

      commit('updateFuncionalUnit', {
        id: functionalUnit.id,
        data: {
          instructionIndex: instruction.index,
          busy: true,
          op: instruction.operation,
          address,
          destiny: instruction.order,
          qi,
          qj,
          vj,
          qk,
          vk,
        },
      });
    },
  },
  getters: {
    getSimulating: (state) => state.simulating,
    getFinished: (state) => state.finished,
    getClock: (state) => state.clock,
    getInstructionList: (state) => state.instructionList,
    getFunctionalUnits: (state) => state.functionalUnits,
    getRegisterStatus: (state) => state.registerStatus,
    getNextInstruction: (state) => {
      return state.instructionList.every((el) => el.status.execute)
        ? null
        : state.instructionList.reduce((prev, current) => {
        if (prev === undefined) return current;
        if (prev === null) return null;

        if (
          prev.order > current.order ||
          (prev.busy && !current.busy) ||
          (prev.busy && current.busy && !current.status.execute)
        )
          return current;
      
        return prev;
      }, undefined);
    },
    getEmptyFunctionalUnit: (state) => (type) => {
      const [functionalUnit] = Object.keys(state.functionalUnits).filter(
        (key) => state.functionalUnits[key].busy === false && state.functionalUnits[key].type === type
      );
      return state.functionalUnits[functionalUnit];
    },
  },
}
