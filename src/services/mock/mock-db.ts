const resolve = <T>(payload?: T) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(payload);
    }, 1000);
  });
};

class Db<T extends { id: string | number }> {
  private items: T[];

  constructor(items: T[] = []) {
    this.items = items;
  }
  add(item: T) {
    this.items = [...this.items, item];
    return resolve();
  }
  update(item: Partial<T>) {
    this.items = this.items.map((i) => {
      if (i.id === item.id) {
        return { ...i, ...item };
      }
      return i;
    });
    return resolve();
  }
  remove(id: string) {
    this.items = this.items.filter((i) => id !== i.id);
    return resolve();
  }
  get(id: string) {
    const found = this.items.find((i) => i.id === id);
    return resolve(found) as Promise<T>;
  }
  gets() {
    return resolve([...this.items]) as Promise<T[]>;
  }
}

export const MockDb = Db;
