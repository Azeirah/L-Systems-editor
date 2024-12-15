export class Ticker {
    private registeredOnTickEventHandlers = new Map();

    onTick(dt) {
        this.registeredOnTickEventHandlers.forEach((handler) => handler(dt))
    }

    register(handler) {
        this.registeredOnTickEventHandlers.set(handler, handler)
    }

    unregister(handler) {
        this.registeredOnTickEventHandlers.delete(handler)
    }
}
