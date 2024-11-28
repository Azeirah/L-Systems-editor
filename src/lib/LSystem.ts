type predecessor = string;
type successor = string;

interface LSystemGrammar {
    root: string;
    iterations: number;
    rules: [predecessor, successor][];
}

export function deriveIterations({root, iterations, rules}: LSystemGrammar): string[] {
    const derivations: string[] = [];
    let accumulation = root;

    derivations[0] = root;

    for (let i = 0; i < iterations; i++) {
        for (let [predecessor, successor] of rules) {
            accumulation = accumulation.replace(new RegExp(predecessor, "g"), successor);
        }
        derivations[i] = accumulation;
    }

    return derivations;
}