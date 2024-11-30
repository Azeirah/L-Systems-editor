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
            let step_size = parameters.length
            let angle = parameters.angle

            const ctx: CanvasRenderingContext2D = canvas.getContext('2d')!
            let turtle = new Turtle(ctx, ctx.canvas.width / 2 + startPos.x, ctx.canvas.height - 16 + startPos.y)

            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
            // ctx.translate(0.5, 0.5)

            for (let idx = 0; idx < lsystem.length; idx++) {
                let i = lsystem[idx]
                if (i === "F") {
                    turtle.forward(step_size)
                } else if (i === "f") {
                    turtle.penUp()
                    turtle.forward(step_size)
                    turtle.penDown()
                }
                else if (i === "-") {
                    turtle.right(angle)
                } else if (i === "+") {
                    turtle.left(angle)
                } else if (i === "[") {
                    turtle.push()
                } else if (i === "]") {
                    turtle.pop()
                } else if (i === ">") {
                    step_size *= parameters.length_factor
                } else if (i === "<") {
                    step_size /= parameters.length_factor
                }
            }

            // ctx.translate(-0.5, -0.5)
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