export class Turtle {
    private ctx: CanvasRenderingContext2D | null;
    private x: number;
    private y: number;
    private angle: number = -90;
    private penState: boolean = true;
    private memory: { x: number, y: number, angle: number }[] = [];

    readDepth() {
        return this.memory.length;
    }

    // Move forward by specified distance
    forward(distance: number) {
        const newX = this.x + distance * Math.cos(this.angle * Math.PI / 180);
        const newY = this.y + distance * Math.sin(this.angle * Math.PI / 180);

        this.ctx.beginPath()
        this.ctx.moveTo(this.x, this.y);
        this.ctx.lineTo(newX, newY)
        this.ctx.stroke()
        this.ctx.closePath()

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

    initialized() {
        return this.ctx != null
    }

    initialize(ctx, startX, startY) {
        this.ctx = ctx;
        this.x = startX
        this.y = startY

        this.ctx.lineWidth = 1;
        this.ctx.strokeStyle = '#000000';

        // Start position
        this.ctx.moveTo(this.x, this.y);
    }
}