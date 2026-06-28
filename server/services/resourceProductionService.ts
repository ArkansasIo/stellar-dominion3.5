class ResourceProductionService {
  processProduction(userId: string): any {
    return { success: true };
  }
}

export const resourceProductionService = new ResourceProductionService();
