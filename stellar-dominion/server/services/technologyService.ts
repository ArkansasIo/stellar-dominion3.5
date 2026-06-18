
import { researches } from '../../researches';

class TechnologyService {
  constructor() {
    console.log('Technology service started!');
  }

  public getTechnologyTree() {
    return researches.slice(20, 100);
  }
}

export const technologyService = new TechnologyService();
