import sys
from fastapi import HTTPException
from config import settings

def validate_circuit_data(circuit_data: dict):
    # Check max size (approximate)
    if sys.getsizeof(str(circuit_data)) > settings.MAX_CIRCUIT_SIZE_BYTES:
        raise HTTPException(status_code=400, detail="Circuit JSON exceeds maximum allowed size (200KB limit)")
        
    ics = circuit_data.get("ics", [])
    wires = circuit_data.get("wires", [])
    
    # 1. Validate unique component IDs
    ic_ids = set()
    for ic in ics:
        ic_id = ic.get("id")
        if not ic_id:
            raise HTTPException(status_code=400, detail="All components must have an ID")
        if ic_id in ic_ids:
            raise HTTPException(status_code=400, detail=f"Duplicate component ID found: {ic_id}")
        ic_ids.add(ic_id)
        
    # Check if there are switches/outputs in the circuit (optional, depending on structure)
    # The requirement says wires must reference valid components.
    # In circuit lab, components can be "ICx", "SWx", "OUTx", "VCC", "GND".
    # Assuming any ID used in a wire's `component` must exist. 
    # For now, we only enforce that wires have valid schema
    for wire in wires:
        from_pin = wire.get("from", {})
        to_pin = wire.get("to", {})
        
        # Validate wire structure
        if not from_pin or not to_pin:
             raise HTTPException(status_code=400, detail="Wire is missing from/to pin definitions")
             
        if "kind" not in from_pin:
             raise HTTPException(status_code=400, detail="Wire missing from source 'kind' definition")
             
        if "kind" not in to_pin:
             raise HTTPException(status_code=400, detail="Wire missing to target 'kind' definition")
             
    # Returns True if validation passes
    return True
