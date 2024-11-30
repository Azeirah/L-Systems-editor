import type {LSystemGrammar} from "./types/LSystems";

export const examples: Record<string, LSystemGrammar> = {
    "bushes": {
        root: "Y",
        rules: [["X", "X[-FFF][+FFF]FX"], ["Y", "YFX[+Y][-Y]"]]
    }
}