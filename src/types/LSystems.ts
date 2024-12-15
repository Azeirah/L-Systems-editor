export type predecessor = string;
export type successor = string;

export interface LSystemGrammar {
    /** The root */
    root: string;
    rules: [predecessor, successor][];
}

export interface LSystemRenderParameters {
    angle: number;
    length: number;
    length_factor: number;
    iterations: number;
}

/**
 * @interface LSystemEvaluation
 * @property {string[]} derivations<br>
 *                      A list of derivations.<br>
 *                      A derivation is the string result of the evaluation of a single iteration.<br>
 *                      The length of the array is always equal to the number of iterations passed to the evaluator.<br>
 * @property {string} alphabet - The L-System alphabet. Consisting of drawing commands and stubs.
 */
export type LSystemEvaluation = {
    derivations: string[],
    /**
     * @example
     * "XY[]+-<>Ff"
     */
    alphabet: string
};