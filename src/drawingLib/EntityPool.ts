import {Ticker} from "./Ticker";

export class EntityPool {
    private groups: Map<string, unknown[]> = new Map();

    add(group, entity) {
        if (this.groups.has(group)) {
            this.groups.get(group).push(entity)
        } else {
            this.groups.set(group, [entity])
        }
    }

    render(ctx) {
        this.groups.forEach((group) => {
            group.forEach((entity) => {
                if (entity.render) {
                    entity.render(ctx)
                }
            })
        })
    }

    update(frame) {
        this.groups.forEach((group) => {
            group.forEach((entity) => {
                if (entity.update) {
                    entity.update(frame)
                }
            })
        })
    }


    removeFromPool(group, entity) {
        if (this.groups.has(group)) {
            const indexToDelete = this.groups.get(group).indexOf(entity)
            if (indexToDelete !== -1) {
                this.groups.get(group).splice(indexToDelete, 1)
            }
        }
    }

    deleteGroup(group) {
        this.groups.delete(group)
    }

    getGroup(group) {
        return this.groups.get(group)
    }
}

export function renderLoop(renderFn) {
    let previous

    function innerRender(timestamp) {
        if (previous == null) {
            previous = timestamp
        }
        let dt = timestamp - previous
        renderFn(dt)

        previous = timestamp

        requestAnimationFrame(innerRender)
    }

    requestAnimationFrame(innerRender)
}

export class RenderEngine {
    ticker = new Ticker()
    entityPool = new EntityPool()

    constructor(onTick) {
        renderLoop((dt) => onTick(dt, this.ticker, this.entityPool))
    }
}