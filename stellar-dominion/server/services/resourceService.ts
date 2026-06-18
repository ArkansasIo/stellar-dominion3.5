
import { researches } from '../../researches';

class ResourceService {
  constructor() {
    console.log('Resource service started!');
  }

  public getResources() {
    return researches.slice(0, 10);
  }
}

export const resourceService = new ResourceService();
