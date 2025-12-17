import { IC_DEFINITIONS } from "./icPinDefinitions";

export function computeLogic(wires, icSlots, inputStates, powerOn) {
  if (!powerOn) {
    return {
      nodeValues: {}, 
      outputs: Array(16).fill(0) // all LEDs OFF
    };
  }

  // Build graph of connectivity
  const nodes = {};  // nodeId → list of connected pins
  const pinToNode = {}; // "ic-1-3" → nodeId

  let nodeCounter = 1;

  function findOrCreateNode(pinId) {
    if (pinToNode[pinId]) return pinToNode[pinId];
    const id = "N" + (nodeCounter++);
    pinToNode[pinId] = id;
    nodes[id] = new Set([pinId]);
    return id;
  }

  // Connect wires
  wires.forEach(w => {
    const p1 = pinIdString(w.from);
    const p2 = pinIdString(w.to);

    const n1 = findOrCreateNode(p1);
    const n2 = findOrCreateNode(p2);

    if (n1 !== n2) {
      // merge n2 into n1
      nodes[n2].forEach(pin => {
        pinToNode[pin] = n1;
        nodes[n1].add(pin);
      });
      delete nodes[n2];
    }
  });

  // Step 2: assign voltage sources (inputs & VCC/GND)
  const nodeValues = {}; // nodeId → 0/1/undefined

  Object.entries(nodes).forEach(([nodeId, pins]) => {
    let value = undefined;

    pins.forEach(pin => {
      const p = decodePin(pin);

      // input switches
      if (p.kind === "input") {
        const v = inputStates[p.pin] ?? 0;
        value = v;
      }

      // IC VCC/GND
      if (p.kind === "ic") {
        const ic = icSlots.find(s => s.id === p.compId);
        const def = IC_DEFINITIONS[ic?.type];
        if (def) {
          const role = def.pins[p.pin]?.role;
          if (role === "vcc") value = 1;
          if (role === "gnd") value = 0;
        }
      }
    });

    nodeValues[nodeId] = value;
  });

  // Step 3: Evaluate each IC
  icSlots.forEach(slot => {
    if (!slot.type) return;

    const def = IC_DEFINITIONS[slot.type];

    def && Object.values(def.pins).forEach(pinDef => {
      if (pinDef.role === "out") {
        evaluateICOutput(slot, def, pinDef, nodes, pinToNode, nodeValues);
      }
    });
  });

  // Step 4: Determine LED outputs
  const outputs = Array(16).fill(0);
  Object.entries(pinToNode).forEach(([pin, node]) => {
    const p = decodePin(pin);
    if (p.kind === "output") {
      outputs[p.pin] = nodeValues[node] ?? 0;
    }
  });

  return { nodeValues, outputs };
}

function evaluateICOutput(slot, def, pinDef, nodes, pinToNode, nodeValues) {
  const gate = pinDef.gate;
  const pins = Object.entries(def.pins)
    .filter(([p, d]) => d.gate === gate)
    .map(([p, d]) => ({ pin: Number(p), role: d.role }));

  const inputs = {};
  pins.forEach(p => {
    if (p.role !== "out") {
      const pinId = `pin-ic-${slot.id}-${p.pin}`;
      const node = pinToNode[pinId];
      inputs[p.role] = nodeValues[node] ?? 0;
    }
  });

  let result = 0;

  if (def.type === "NOT") {
    result = inputs["in"] ? 0 : 1;
  } else if (def.type === "AND") {
    result = inputs["inA"] && inputs["inB"] ? 1 : 0;
  } else if (def.type === "OR") {
    result = inputs["inA"] || inputs["inB"] ? 1 : 0;
  }

  const outputPinNumber = pins.find(p => p.role === "out").pin;
  const outPinId = `pin-ic-${slot.id}-${outputPinNumber}`;
  const node = pinToNode[outPinId];
  nodeValues[node] = result;
}

// helpers
function pinIdString(p) {
  return `pin-${p.kind}-${p.compId}-${p.pin}`;
}

function decodePin(str) {
  const [, kind, compId, pin] = str.split("-");
  return { kind, compId: isNaN(Number(compId)) ? compId : Number(compId), pin: Number(pin) };
}
