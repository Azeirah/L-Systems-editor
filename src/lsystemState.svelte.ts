import type {LSystemGrammar} from "./types/LSystems";

export let lsystemDefinition: LSystemGrammar = $state({
    root: "-X",
    rules: [["F", "FF"], ["X", "F+[[X]-X]-F[-FX]+X"]],
})
export let inspectorState: {evaluationIndex: null | number} = $state({
    evaluationIndex: null
})
export let lSystemRenderParameters = $state({
    angle: 15,
    length: 4,
    length_factor: 1,
    color: "black"
})
export let evaluationParameters = $state({
    iterations: 4
})