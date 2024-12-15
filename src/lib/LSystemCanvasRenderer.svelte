<script lang="ts">
    import {Turtle} from "./Turtle"
    import {inspectorState, lSystemRenderParameters} from "../lsystemState.svelte";
    import {Ticker} from "../drawingLib/Ticker";
    import {EntityPool, RenderEngine} from "../drawingLib/EntityPool";

    let {lsystem, dragHandlePosition} = $props()

    let ctx: CanvasRenderingContext2D | null = $state(null)
    let startPos = $state({x: 0, y: 0})
    let dragging = $state(false)

    class LSystemRenderer {
        private index = 0
        private turtle = new Turtle()
        private metrics: {depth: number, maxDepth: number} = {
            depth: 0,
            maxDepth: 0
        };
        private stepSize: number = 0
        private startX
        private startY

        constructor(lsystem, parameters, evaluationIndex, startX, startY) {
            this.metrics.maxDepth = this.calculateMaxDepth(lsystem)
            this.stepSize = parameters.length
            this.parameters = parameters
            this.evaluationIndex = evaluationIndex

            this.startX = startX
            this.startY = startY
        }

        private calculateMaxDepth(str) {
            let depth = 0
            let maxDepth = 0

            for (let char of str) {
                if (char === '[') {
                    depth++
                    maxDepth = Math.max(maxDepth, depth)
                } else if (char === ']') {
                    depth--
                }
            }
            return maxDepth
        }

        render(ctx) {
            if (!this.turtle.initialized()) {
                ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
                this.turtle.initialize(ctx, ctx.canvas.width / 2 + this.startX, ctx.canvas.height - 16 + this.startY)
            }

            const TIME_BUDGET_IN_MS = 16;

            const startTime = Date.now()
            while (this.index < dragHandlePosition) {
                if (Date.now() - startTime > TIME_BUDGET_IN_MS) return;

                const instruction = lsystem[this.index];

                switch (instruction) {
                    case 'F':
                        this.turtle.forward(this.stepSize);
                        break;
                    case 'f':
                        this.turtle.penUp();
                        this.turtle.forward(this.stepSize);
                        this.turtle.penDown();
                        break;
                    case '-':
                        this.turtle.right(this.parameters.angle);
                        break;
                    case '+':
                        this.turtle.left(this.parameters.angle);
                        break;
                    case '[':
                        this.metrics.depth += 1;
                        this.turtle.push();
                        break;
                    case ']':
                        this.metrics.depth -= 1;
                        this.turtle.pop();
                        break;
                    case '>':
                        this.stepSize *= this.length_factor;
                        break;
                    case '<':
                        this.stepSize /= this.length_factor;
                        break;
                }

                this.index++;
            }

        }
    }

    const engine = new RenderEngine(function (dt: number, ticker: Ticker, pool: EntityPool) {
        if (!ctx) return;

        ticker.onTick(dt)

        pool.update(dt)
        pool.render(ctx)
    })

    function initRender(canvas: HTMLCanvasElement) {
        ctx = canvas.getContext('2d')

        const container = canvas.parentElement

        const setSize = () => {
            canvas.width = container.clientWidth
            canvas.height = container.clientHeight - 8
        }

        setSize()
    }

    $effect(() => {
        engine.entityPool.deleteGroup("lsystem")

        const renderer = new LSystemRenderer(lsystem, lSystemRenderParameters, inspectorState.evaluationIndex, startPos.x, startPos.y)

        engine.entityPool.add("lsystem", renderer)
    })
</script>

<svelte:window onmousemove={(e) => {
    if (dragging) {
        startPos.x += e.movementX
        startPos.y += e.movementY
    }
}}></svelte:window>

<canvas data-testid="l-systems-canvas-renderer" use:initRender onmousedown={(e) => dragging = true}
        onmouseup={(e) => dragging = false}></canvas>

<style>
    canvas {
        background: white;
    }
</style>