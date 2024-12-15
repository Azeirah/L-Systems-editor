import type {LSystemGrammar} from "../types/LSystems";

export const commands = "Ff+-[]><"

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