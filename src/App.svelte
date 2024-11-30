<script lang="ts">
    import {blur} from "svelte/transition";
    import {deriveIterations} from "./lib/LSystem";
    import {unique_characters_in_string} from "./lib/stringUtililities";

    import WelcomeScreen from "./lib/WelcomeScreen.svelte";
    import LSystemCanvasRenderer from "./lib/LSystemCanvasRenderer.svelte";

    type predecessor = string;
    type successor = string;

    let root = $state("-X");
    let iterations = $state(4);
    let angle = $state(15);
    let length = $state(4);
    let length_factor = $state(1);
    let rules: [predecessor, successor][] = $state([["F", "FF"], ["X", "F+[[X]-X]-F[-FX]+X"]]);

    let result = $derived(deriveIterations({root, iterations, rules}))

    let alphabet = $derived(unique_characters_in_string([root, ...rules.flat()].map(unique_characters_in_string).join("")))

    let sideEffects = $state({})

    let onSplash = $state(true)
</script>

<svelte:window onclick={() =>{onSplash=false}}/>

<main>
    {#if onSplash}
        <div transition:blur>
            <WelcomeScreen/>
        </div>
    {:else}
        <div class="editor">
            <div style="grid-area: r">
                <LSystemCanvasRenderer lsystem={result[result.length - 1]} parameters={{
                    angle,
                    length,
                    length_factor
                }} sideEffects={sideEffects}/>
            </div>

            <div class="configuration" style="grid-area: s" transition:blur>
                <fieldset id="parameters">
                    <legend>Drawing parameters</legend>
                    <label for="angle">Angle</label>
                    <input type="number" id="angle" bind:value={angle}>
                    <label for="length">Length</label>
                    <input type="number" id="length" bind:value={length}>
                    <label for="length_factor">Length factor</label>
                    <input type="number" id="length_factor" bind:value={length_factor}>
                </fieldset>

                <fieldset id="definition">
                    <legend>L-System definition</legend>

                    <label for="iterations">Iterations</label>
                    <input type="number" bind:value={iterations}>
                    <!--

                    ω (start, axiom or initiator) is a string of symbols from V defining the initial state of the system

                    -->
                    <label for="Root">Root</label>
                    <input type="text" name="Root" id="Root" bind:value={root}>

                    <!--

                    P is a set of production rules or productions defining the way variables can be replaced with combinations of constants and other variables.
                    A production consists of two strings, the predecessor and the successor.
                    For any symbol A which is a member of the set V which does not appear on the left hand side of a production in P, the identity production A → A is assumed;
                      these symbols are called constants or terminals. (See Law of identity).

                    -->
                    <label for="rules">Rules</label>
                    <div>
                        {#each rules as rule, index}
                            <div>
                                <input type="text" bind:value={rule[0]}>
                                →
                                <input type="text" bind:value={rule[1]}>
                                <button onclick={() => rules.splice(index, 1)}>✕</button>
                            </div>
                        {/each}
                        <button id="add-rule" onclick={() => rules.push(["", ""])}>+</button>
                    </div>
                </fieldset>

                <!--

                V (the alphabet) is a set of symbols containing both elements that can be replaced (variables) and those which cannot be replaced ("constants" or "terminals")

                -->
                <fieldset id="alphabet">
                    <legend>Examples</legend>
                    <select name="examples" id="examples">
                        <option value="leaf">L-System Leaf</option>
                    </select>
                </fieldset>
            </div>
        </div>
    {/if}
</main>

<style>
    .editor {
        height: calc(100vh - 64px);
        display: grid;
        grid-template:
                "r r" 1fr
                "s s" auto;
    }

    .configuration {
        display: grid;
        grid-template-columns: max-content 1fr;
        gap: 8px;

        & #parameters {
            display: grid;
            grid-template-columns: min-content 1fr;
            grid-template-rows: repeat(3, min-content);
            gap: 8px;
        }

        & #definition {
            display: grid;
            grid-template-columns: min-content 1fr;
            grid-template-rows: repeat(3, min-content);
            gap: 8px;

            & input:first-child {
                width: 3rem;
            }
        }
    }

    .configuration {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
    }

    details {
        border: 1px solid #aaa;
        border-radius: 4px;
        margin: 8px 0;
        padding: 0.5em 0.5em 0;
    }

    summary {
        font-weight: bold;
        margin: -0.5em -0.5em 0;
        padding: 0.5em;
    }

    details[open] {
        padding: 0.5em;
    }
</style>
