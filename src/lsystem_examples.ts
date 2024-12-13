import type {LSystemGrammar, LSystemRenderParameters} from "./types/LSystems";

export const examples: Record<string, LSystemGrammar & LSystemRenderParameters> = {
    "small tree": {
        root: "-X",
        rules: [["F", "FF"], ["X", "F+[[X]-X]-F[-FX]+X"]],
        angle: 15,
        iterations: 4,
        length_factor: 1,
        length: 4,
    },
    "feathery bush": {
        root: "Y",
        rules: [["X", "X[-FFF][+FFF]FX"], ["Y", "YFX[+Y][-Y]"]],
        angle: 25.7,
        iterations: 4,
        length_factor: 1,
        length: 4,
    },
    "seaweed bush": {
        root: "F",
        rules: [["F", "FF+[+F-F-F]-[-F+F+F]"]],
        angle: 22.5,
        iterations: 4,
        length_factor: 1,
        length: 4
    },
    "lively seaweed": {
        root: "VZFFF",
        rules: [
            ["V", "[+++W][---W]YV"],
            ["W", "+X[-W]Z"],
            ["X", "-W[+X]Z"],
            ["Y", "YZ"],
            ["Z", "[-FFF][+FFF]F"]
        ],
        angle: 20,
        iterations: 4,
        length_factor: 1,
        length: 4
    },
    "snowflake": {
        root: "F++F++F",
        rules: [
            ["F", "F-F++F-F"]
        ],
        angle: 60,
        iterations: 4,
        length_factor: 1,
        length: 4
    },
    "feather star (sea creature)": {
       root: "+B+B+B+B+B+B+B+B+B+B",
        rules: [
            ["B", "Fa"],
            ["a", "YFX[+Y][-Y]"],
            ["Y", "YFX[+Y][-Y]"],
        ],
        angle: 36,
        iterations: 4,
        length: 4,
        length_factor: 1
    }
}