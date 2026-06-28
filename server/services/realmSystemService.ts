class RealmSystemService {
  getRealmConfig(realmId: string): any {
    return { id: realmId };
  }
}

export const realmSystemService = new RealmSystemService();
