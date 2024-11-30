type predecessor = string;
type successor = string;

export interface LSystemGrammar {
    root: string;
    rules: [predecessor, successor][];
}