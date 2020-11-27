class EventHub {
  events: Map<string, Function[]>;

  constructor() {
    this.events = new Map<string, Function[]>();
  }

  on(evt: string, handler: Function) {
    if (!this.events.has(evt)) {
      this.events.set(evt, []);
    }
    const fs = this.events.get(evt);
    if (fs) {
      fs.push(handler);
    }
  }

  off(evt: string, handler: Function) {
    let fs = this.events.get(evt);
    if (fs) {
      fs = fs.filter(func => func !== handler);
    }
  }

  emit(evt: string, ...params: object[]) {
    const fs = this.events.get(evt);
    if (fs) {
      fs.forEach(func => {
        func(...params);
      });
    }
  }
}

export default new EventHub();
