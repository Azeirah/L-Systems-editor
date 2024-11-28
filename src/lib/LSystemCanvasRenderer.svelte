<script lang="ts">
    let canvas: HTMLCanvasElement | undefined = $state();

    let {lsystem} = $props();

    class Turtle {
        private ctx: CanvasRenderingContext2D;
        private x: number;
        private y: number;
        private angle: number;
        private penState: boolean = false;
        private memory: {x: number, y: number, angle: number}[] = [];


        constructor(ctx: CanvasRenderingContext2D, startX: number, startY: number) {
            this.ctx = ctx;
            this.x = startX;
            this.y = startY;
            this.angle = -90;
            this.penState = true;
            this.ctx.lineWidth = 1;
            this.ctx.strokeStyle = '#000000';

            // Start position
            this.ctx.beginPath();
            this.ctx.moveTo(this.x, this.y);
        }

        // Move forward by specified distance
        forward(distance: number) {
            const newX = this.x + distance * Math.cos(this.angle * Math.PI / 180);
            const newY = this.y + distance * Math.sin(this.angle * Math.PI / 180);

            if (this.penState) {
                this.ctx.lineTo(newX, newY);
                this.ctx.stroke();
            } else {
                this.ctx.moveTo(newX, newY);
            }

            this.x = newX;
            this.y = newY;
        }

        // Turn right by specified angle in degrees
        right(angle: number) {
            this.angle = (this.angle + angle) % 360;
        }

        // Turn left by specified angle in degrees
        left(angle: number) {
            this.angle = (this.angle - angle) % 360;
        }

        // Lift the pen up (stop drawing)
        penUp() {
            this.penState = false;
        }

        push() {
            this.memory.push({x: this.x, y: this.y, angle: this.angle})
            console.log(JSON.stringify(this.memory, null, 2))
        }

        pop() {
            if (this.memory.length === 0) {
                throw new Error("Unbalanced stack!")
            }
            const {x, y, angle} = this.memory.pop()!

            this.x = x
            this.y = y
            this.angle = angle

            this.ctx.moveTo(this.x, this.y)
        }

        // Put the pen down (start drawing)
        penDown() {
            this.penState = true;
        }

        // Set the pen color
        setColor(color: string) {
            this.ctx.strokeStyle = color;
        }

        // Set the pen width
        setWidth(width: number) {
            this.ctx.lineWidth = width;
        }
    }

    $effect(() => {
        if (canvas) {
            const ctx: CanvasRenderingContext2D = canvas.getContext('2d')!
            let turtle = new Turtle(ctx, ctx.canvas.width / 2, ctx.canvas.height - 16)

            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

            console.log(lsystem)

            for (let i of lsystem) {
                if (i === "F") {
                    turtle.forward(4)
                } else if (i === "-") {
                    turtle.right(20)
                } else if (i === "+") {
                    turtle.left(20)
                } else if (i === "[") {
                    turtle.push()
                } else if (i === "]") {
                    turtle.pop()
                }
            }
        }
    })
</script>

<canvas bind:this={canvas}></canvas>