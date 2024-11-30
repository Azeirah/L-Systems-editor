type predecessor = string;
type successor = string;

export interface LSystemGrammar {
    root: string;
    rules: [predecessor, successor][];
}

export interface LSystemRenderParameters {
    angle: number;
    length: number;
    length_factor: number;
    iterations: number;
}