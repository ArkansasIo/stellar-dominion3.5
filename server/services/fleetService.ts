
import { researches } from '../../researches';

class FleetService {
  constructor() {
    console.log('Fleet service started!');
  }

  public getFleet() {
    return researches.slice(10, 20);
  }
}

export const fleetService = new FleetService();
