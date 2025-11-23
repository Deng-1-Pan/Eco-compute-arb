// backend/src/data/MockGrid.ts

export interface GridState {
  hour: number;
  gridLoadMw: number;      // How stressed the grid is
  carbonIntensity: number; // gCO2/kWh
  pricePerMwh: number;     // £/MWh
  isPeak: boolean;
}

export class GridService {
  // Returns the state of the grid for a specific hour (0-23)
  static getGridState(hour: number): GridState {
    const isPeakTime = hour === 19; // 7 PM is our scripted "Crisis"

    // Base values (sine wave-ish behavior)
    // Load peaks in evening, drops at night
    let baseLoad = 400 + (Math.sin((hour - 6) * 0.25) * 200); 
    let baseCarbon = 150 + (Math.random() * 50);
    let basePrice = 80 + (baseLoad * 0.2);

    // THE CRITICAL SCENARIO: 7 PM Spike
    if (isPeakTime) {
      return {
        hour,
        gridLoadMw: 950,        // Near max capacity
        carbonIntensity: 350,   // Very dirty (coal turning on)
        pricePerMwh: 450.00,    // Expensive!
        isPeak: true
      };
    }

    return {
      hour,
      gridLoadMw: Math.floor(baseLoad),
      carbonIntensity: Math.floor(baseCarbon),
      pricePerMwh: parseFloat(basePrice.toFixed(2)),
      isPeak: false
    };
  }
}
