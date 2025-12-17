// icPinDefinitions.js
export const IC_DEFINITIONS = {
  "7404": {
    type: "NOT",
    pins: {
      1: { role: "in", gate: 1 },
      2: { role: "out", gate: 1 },

      3: { role: "in", gate: 2 },
      4: { role: "out", gate: 2 },

      5: { role: "in", gate: 3 },
      6: { role: "out", gate: 3 },

      9: { role: "in", gate: 4 },
      8: { role: "out", gate: 4 },

      11: { role: "in", gate: 5 },
      10: { role: "out", gate: 5 },

      13: { role: "in", gate: 6 },
      12: { role: "out", gate: 6 },

      14: { role: "vcc" },
      7: { role: "gnd" },
    }
  },

  "7408": {
    type: "AND",
    pins: {
      1: { role: "inA", gate: 1 },
      2: { role: "inB", gate: 1 },
      3: { role: "out", gate: 1 },

      4: { role: "inA", gate: 2 },
      5: { role: "inB", gate: 2 },
      6: { role: "out", gate: 2 },

      10: { role: "inA", gate: 3 },
      9: { role: "inB", gate: 3 },
      8: { role: "out", gate: 3 },

      13: { role: "inA", gate: 4 },
      12: { role: "inB", gate: 4 },
      11: { role: "out", gate: 4 },

      14: { role: "vcc" },
      7: { role: "gnd" },
    }
  },

  "7432": {
    type: "OR",
    pins: {
      1: { role: "inA", gate: 1 },
      2: { role: "inB", gate: 1 },
      3: { role: "out", gate: 1 },

      4: { role: "inA", gate: 2 },
      5: { role: "inB", gate: 2 },
      6: { role: "out", gate: 2 },

      10: { role: "inA", gate: 3 },
      9: { role: "inB", gate: 3 },
      8: { role: "out", gate: 3 },

      13: { role: "inA", gate: 4 },
      12: { role: "inB", gate: 4 },
      11: { role: "out", gate: 4 },

      14: { role: "vcc" },
      7: { role: "gnd" },
    }
  }
};
