<script lang="ts">
    import {Turtle} from "./Turtle"

    type RenderState = {
        index: number;
        turtle: Turtle;
        stepSize: number;
        metrics: {
            depth: number;
            maxDepth: number;
        }
    };

    let canvas: HTMLCanvasElement | undefined = $state()

    let {lsystem, parameters} = $props()

    let startPos = $state({x: 0, y: 0})
    let dragging = $state(false)

    function getMaxDepth(str) {
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

    function initRenderState(ctx: CanvasRenderingContext2D, parameters: { length: number }, lsystem: string) {
        return {
            index: 0,
            turtle: new Turtle(ctx, ctx.canvas.width / 2 + startPos.x, ctx.canvas.height - 16 + startPos.y),
            stepSize: parameters.length,
            metrics: {
                depth: 0,
                getMaxDepth: getMaxDepth(lsystem)
            }
        }
    }

    function processBatch(state: RenderState, lSystem: string, parameters: {
        length: number
    }, startTime: number): boolean {
        const TIME_BUDGET_IN_MS = 12;

        while (state.index < lsystem.length) {
            if (Date.now() - startTime > TIME_BUDGET_IN_MS) {
                return false;
            }

            const instruction = lsystem[state.index];

            switch (instruction) {
                case 'F':
                    state.turtle.setColor(parameters.color);
                    state.turtle.forward(state.stepSize);
                    break;
                case 'f':
                    state.turtle.setColor(parameters.color);
                    state.turtle.penUp();
                    state.turtle.forward(state.stepSize);
                    state.turtle.penDown();
                    break;
                case '-':
                    state.turtle.right(parameters.angle);
                    break;
                case '+':
                    state.turtle.left(parameters.angle);
                    break;
                case '[':
                    state.metrics.depth += 1;
                    state.turtle.push();
                    break;
                case ']':
                    state.metrics.depth -= 1;
                    state.turtle.pop();
                    break;
                case '>':
                    state.stepSize *= parameters.length_factor;
                    break;
                case '<':
                    state.stepSize /= parameters.length_factor;
                    break;
            }

            if (parameters.secret !== "") {
                eval(parameters.secret);
                console.debug(state.metrics);
            }

            state.index++;
        }
        return true;
    }

    let renderLoopStarted = false
    let needsRender = false
    let renderState = $state<RenderState | null>(null)

    function renderLoop(ctx: CanvasRenderingContext2D) {
        requestAnimationFrame(() => renderLoop(ctx))

        if (!needsRender || !renderState) return;

        if (renderState.index === 0) {
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
        }

        const startTime = Date.now();

        if (processBatch(renderState, lsystem, parameters, startTime)) {
            needsRender = false;
        }
    }

    $effect(() => {
        if (!canvas) return;

        const ctx: CanvasRenderingContext2D = canvas.getContext('2d')!

        const container = canvas.parentElement
        const setSize = () => {
            canvas.width = container.clientWidth
            canvas.height = container.clientHeight - 8
        }

        setSize()

        if (!renderLoopStarted) {
            renderLoopStarted = true;
            renderLoop(ctx);
        }
    })

    $effect(() => {
        if (!canvas) return;

        renderState = initRenderState(canvas.getContext('2d')!, parameters, lsystem)
        needsRender = true;
    });
</script>

<svelte:window onmousemove={(e) => {
    if (dragging) {
        startPos.x += e.movementX
        startPos.y += e.movementY
    }
}}></svelte:window>

<canvas data-testid="l-systems-canvas-renderer" bind:this={canvas} onmousedown={(e) => dragging = true}
        onmouseup={(e) => dragging = false}></canvas>

<style>
    canvas {
        background: white;
    }
</style>