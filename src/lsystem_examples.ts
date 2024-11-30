import type {LSystemGrammar, LSystemRenderParameters} from "./types/LSystems";

export const examples: Record<string, LSystemGrammar & LSystemRenderParameters> = {
    "default": {
        root: "-X",
        rules: [["F", "FF"], ["X", "F+[[X]-X]-F[-FX]+X"]],
        angle: 15,
        iterations: 4,
        length_factor: 1,
        length: 4,
    },
    "bushes": {
        root: "Y",
        rules: [["X", "X[-FFF][+FFF]FX"], ["Y", "YFX[+Y][-Y]"]],
        angle: 25.7,
        iterations: 4,
        length_factor: 1,
        length: 4,
    },
}