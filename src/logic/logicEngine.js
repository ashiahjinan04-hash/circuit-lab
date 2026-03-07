import { IC_DEFINITIONS } from "./icPinDefinitions";

/*
Pin object shape everywhere:
{ kind: "ic" | "input" | "output" | "vcc" | "gnd", compId, pin }
*/

export function computeLogic(wires, icSlots, inputStates, powerOn) {
  // 🔴 Power OFF → everything OFF
  if (!powerOn) {
    return {
      nodeValues: {},
      outputs: Array(16).fill(0)
    };
  }

  /* =====================================================
     STEP 1: BUILD CONNECTIVITY GRAPH
     ===================================================== */

  const nodes = {};          // nodeId -> Set(pinIds)
  const pinToNode = {};      // pinId -> nodeId
  let nodeCounter = 1;

  function findOrCreateNode(pinId) {
    if (pinToNode[pinId]) return pinToNode[pinId];

    const id = "N" + nodeCounter++;
    pinToNode[pinId] = id;
    nodes[id] = new Set([pinId]);
    return id;
  }

  wires.forEach(w => {
    const p1 = pinIdString(w.from);
    const p2 = pinIdString(w.to);

    const n1 = findOrCreateNode(p1);
    const n2 = findOrCreateNode(p2);

    if (n1 !== n2) {
      nodes[n2].forEach(pin => {
        pinToNode[pin] = n1;
        nodes[n1].add(pin);
      });
      delete nodes[n2];
    }
  });

  /* =====================================================
     STEP 2: ASSIGN NODE VALUES (INPUTS / VCC / GND)
     ===================================================== */

  const nodeValues = {}; // nodeId -> 0 | 1 | undefined

  Object.entries(nodes).forEach(([nodeId, pins]) => {
    let value = undefined;

    pins.forEach(pinStr => {
      const p = decodePin(pinStr);

      // INPUT SWITCHES
      if (p.kind === "input") {
        value = inputStates[p.pin] ?? 0;
      }

      // IC VCC / GND
      if (p.kind === "ic") {
        const ic = icSlots.find(s => s.id === p.compId);
        const def = IC_DEFINITIONS[ic?.type];
        const role = def?.pins[p.pin]?.role;

        if (role === "vcc") value = 1;
        if (role === "gnd") value = 0;
      }
      // BOARD VCC / GND
      if (p.kind === "vcc") value = 1;
      if (p.kind === "gnd") value = 0;

    });

    nodeValues[nodeId] = value;
  });

  /* =====================================================
     STEP 3: EVALUATE ICs (ONLY IF POWERED)
     ===================================================== */

  icSlots.forEach(slot => {
    if (!slot.type) return;

    // 🔌 Check VCC (pin 14) & GND (pin 7)
    if (!isICPowered(slot.id, pinToNode, nodeValues)) return;

    const def = IC_DEFINITIONS[slot.type];

    Object.values(def.pins).forEach(pinDef => {
      if (pinDef.role === "out") {
        evaluateICOutput(
          slot,
          def,
          pinDef,
          pinToNode,
          nodeValues
        );
      }
    });
  });

  /* =====================================================
     STEP 4: MAP OUTPUT LEDs
     ===================================================== */

  const outputs = Array(16).fill(0);

  Object.entries(pinToNode).forEach(([pin, node]) => {
    const p = decodePin(pin);
    if (p.kind === "output") {
      outputs[p.pin] = nodeValues[node] ?? 0;
    }
  });

  return { nodeValues, outputs };
}

/* =====================================================
   IC POWER CHECK
   ===================================================== */

function isICPowered(icId, pinToNode, nodeValues) {
  const vccNode = pinToNode[`pin-ic-${icId}-14`];
  const gndNode = pinToNode[`pin-ic-${icId}-7`];

  return (
    nodeValues[vccNode] === 1 &&
    nodeValues[gndNode] === 0
  );
}

/* =====================================================
   IC OUTPUT EVALUATION
   ===================================================== */

function evaluateICOutput(slot, def, pinDef, pinToNode, nodeValues) {
  const gate = pinDef.gate;

  const relatedPins = Object.entries(def.pins)
    .filter(([_, d]) => d.gate === gate)
    .map(([p, d]) => ({ pin: Number(p), role: d.role }));

  const inputs = {};

  relatedPins.forEach(p => {
    if (p.role !== "out") {
      const id = `pin-ic-${slot.id}-${p.pin}`;
      const node = pinToNode[id];
      inputs[p.role] = nodeValues[node] ?? 0;
    }
  });

  let result = 0;

  if (def.type === "NOT") {
    result = inputs["in"] ? 0 : 1;
  }

  if (def.type === "AND") {
    result = inputs["inA"] && inputs["inB"] ? 1 : 0;
  }

  if (def.type === "OR") {
    result = inputs["inA"] || inputs["inB"] ? 1 : 0;
  }

  if (def.type === "NAND") {
    result = !(inputs["inA"] && inputs["inB"]) ? 1 : 0;
  }

  if (def.type === "NOR") {
    result = !(inputs["inA"] || inputs["inB"]) ? 1 : 0;
  }

  if (def.type === "XOR") {
    result = (inputs["inA"] !== inputs["inB"]) ? 1 : 0;
  }

  const outPin = relatedPins.find(p => p.role === "out").pin;
  const outNode = pinToNode[`pin-ic-${slot.id}-${outPin}`];
  nodeValues[outNode] = result;
}

/* =====================================================
   HELPERS
   ===================================================== */

function pinIdString(p) {
  return `pin-${p.kind}-${p.compId}-${p.pin}`;
}

function decodePin(str) {
  const [, kind, compId, pin] = str.split("-");
  return {
    kind,
    compId: isNaN(Number(compId)) ? compId : Number(compId),
    pin: Number(pin)
  };
}
