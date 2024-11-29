<script lang="ts">
    import {Turtle} from "./Turtle";

    let canvas: HTMLCanvasElement | undefined = $state();

    let {lsystem: LSystem, parameters, sideEffects} = $props();

    let startPos = $state({x: 0, y: 0})
    let dragging = $state(false)

    function getMaxDepth(str) {
        let depth = 0;
        let maxDepth = 0;

        for (let char of str) {
            if (char === '[') {
                depth++;
                maxDepth = Math.max(maxDepth, depth);
            }
            else if (char === ']') {
                depth--;
            }
        }
        return maxDepth;
    }

    $effect(() => {
        if (canvas) {
            const container = canvas.parentElement!
            canvas.width = container.clientWidth
            canvas.height = container.clientHeight

            window.addEventListener('resize', () => {
                canvas!.width = container.clientWidth
                canvas!.height = container.clientHeight
            })
        }
    })

    $effect(() => {
        if (canvas) {
            const ctx: CanvasRenderingContext2D = canvas.getContext('2d')!
            let turtle = new Turtle(ctx, ctx.canvas.width / 2 + startPos.x, ctx.canvas.height - 16 + startPos.y)
            const lsystem = {
                length: LSystem.length,
                current: 0,
                depth: 0,
                maxDepth: getMaxDepth(LSystem)
            }

            const turtleEval = (instruction: string, idx: number) => {
                lsystem.current = idx
                lsystem.depth = turtle.readDepth()
                if (instruction in sideEffects) {
                    eval(sideEffects[instruction]);
                }
            }

            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
            ctx.translate(0.5, 0.5)

            console.log(LSystem)

            for (let idx = 0; idx < LSystem.length; idx++) {
                let i = LSystem[idx]
                turtleEval(i, idx)
                if (i === "F") {
                    turtle.forward(parameters.length)
                } else if (i === "-") {
                    turtle.right(parameters.angle)
                } else if (i === "+") {
                    turtle.left(parameters.angle)
                } else if (i === "[") {
                    turtle.push()
                } else if (i === "]") {
                    turtle.pop()
                }
            }

            ctx.translate(-0.5, -0.5)
        }
    })
</script>

<svelte:window on:mousemove={(e) => {
    if (dragging) {
        startPos.x += e.movementX
        startPos.y += e.movementY
    }
}}></svelte:window>

<canvas bind:this={canvas} on:mousedown={(e) => dragging = true} on:mouseup={(e) => dragging = false}></canvas>

<style>
    canvas {
        background: white;
    }
</style>