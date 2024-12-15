import type {LSystemEvaluation, LSystemGrammar} from "../types/LSystems";

export const commands = "Ff+-[]><"

function alphabet(lsystemDefinition) {
    let alphabet = new Set()

    for (let symbol of lsystemDefinition.root) {
        alphabet.add(symbol)
    }

    for (let [predecessor, successor] of lsystemDefinition.rules) {
        for (let symbol of predecessor) {
            alphabet.add(symbol)
        }
        for (let symbol of successor) {
            alphabet.add(symbol)
        }
    }

    return Array.from(alphabet).join("")
}

export function evaluateLSystem({root, iterations, rules}: LSystemGrammar): LSystemEvaluation {
    const derivations: string[] = [];
    let accumulation = root;

    derivations[0] = root;

    for (let i = 0; i < iterations; i++) {
        for (let [predecessor, successor] of rules) {
            accumulation = accumulation.replace(new RegExp(predecessor, "g"), successor);
        }
        derivations[i] = accumulation;
    }

    return {
        alphabet: alphabet({root, rules}),
        derivations
    };
}