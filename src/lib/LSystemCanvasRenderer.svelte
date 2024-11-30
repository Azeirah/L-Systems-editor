<script lang="ts">
    import {Turtle} from "./Turtle"

    let canvas: HTMLCanvasElement | undefined = $state()

    let {lsystem, parameters, sideEffects} = $props()

    let startPos = $state({x: 0, y: 0})
    let dragging = $state(false)

    function getMaxDepth(str) {
        let depth = 0
        let maxDepth = 0

        for (let char of str) {
            if (char === '[') {
                depth++
                maxDepth = Math.max(maxDepth, depth)
            }
            else if (char === ']') {
                depth--
            }
        }
        return maxDepth
    }

    $effect(() => {
        if (canvas) {
            const container = canvas.parentElement!

            const setSize = () => {
                canvas.width = container.clientWidth
                canvas.height = container.clientHeight - 8
            }
            setSize()

            canvas.addEventListener('resize', setSize)
            window.addEventListener('resize', setSize)
        }
    })

    $effect(() => {
        if (canvas) {
            const ctx: CanvasRenderingContext2D = canvas.getContext('2d')!
            let turtle = new Turtle(ctx, ctx.canvas.width / 2 + startPos.x, ctx.canvas.height - 16 + startPos.y)
            let l_system = {
                length: lsystem.length,
                current: 0,
                depth: 0,
                maxDepth: getMaxDepth(lsystem)
            }

            const turtleEval = (instruction: string, idx: number) => {
                l_system.current = idx
                l_system.depth = turtle.readDepth()
                if (instruction in sideEffects) {
                    eval(sideEffects[instruction])
                    // Do not remove this debugging statement. It ensures that the `l_system` variable doesn't
                    // get optimized away by the compiler.
                    console.debug(l_system)
                }
            }

            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
            ctx.translate(0.5, 0.5)

            for (let idx = 0; idx < lsystem.length; idx++) {
                let i = lsystem[idx]
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

<svelte:window onmousemove={(e) => {
    if (dragging) {
        startPos.x += e.movementX
        startPos.y += e.movementY
    }
}}></svelte:window>

<canvas bind:this={canvas} onmousedown={(e) => dragging = true} onmouseup={(e) => dragging = false}></canvas>

<style>
    canvas {
        background: white;
    }
</style>