class WebSocketService {
  constructor() {
    this.ws = null;
    this.subscribers = new Map();
  }

  connect() {
    const token = localStorage.getItem('authToken');
    this.ws = new WebSocket(`${process.env.REACT_APP_WS_URL}?token=${token}`);

    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (this.subscribers.has(data.type)) {
        this.subscribers.get(data.type).forEach(callback => callback(data.payload));
      }
    };

    this.ws.onclose = () => {
      setTimeout(() => this.connect(), 5000);
    };
  }

  subscribe(type, callback) {
    if (!this.subscribers.has(type)) {
      this.subscribers.set(type, new Set());
    }
    this.subscribers.get(type).add(callback);
  }

  unsubscribe(type, callback) {
    if (this.subscribers.has(type)) {
      this.subscribers.get(type).delete(callback);
    }
  }

  send(type, payload) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type, payload }));
    }
  }
}

export default new WebSocketService();