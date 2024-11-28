<script lang="ts">
    import {blur} from "svelte/transition";
    import {deriveIterations} from "./lib/LSystem";
    import WelcomeScreen from "./lib/WelcomeScreen.svelte";
    import LSystemCanvasRenderer from "./lib/LSystemCanvasRenderer.svelte";

    type predecessor = string;
    type successor = string;

    let root = $state("-X");
    let iterations = $state(2);
    let angle = $state(15);
    let rules: [predecessor, successor][] = $state([["F", "FF"], ["X", "F+[[X]-X]-F[-FX]+X"]]);

    let result = $derived(deriveIterations({root, iterations, rules}))

    let alphabet = $derived.by(() => {
        const unique_characters_in_string = (input: string) => {
            const chars = new Set();

            for (let char of input) {
                chars.add(char);
            }

            return Array.from(chars).join("");
        }

        return unique_characters_in_string([root, ...rules.flatMap((value) => [value[0], value[1]])].map(unique_characters_in_string).join(""))
    })

    let onSplash = $state(true)
</script>

<svelte:window on:click={() =>{onSplash=false}}/>

<main>
    {#if onSplash}
        <div transition:blur>
            <WelcomeScreen />
        </div>
    {:else}
        <div class="editor">
            <div style="grid-area: r">
                <LSystemCanvasRenderer lsystem={result[result.length - 1]} />
            </div>

            <form action="javascript:void(0);" style="grid-area: s" transition:blur>
                <label for="iterations">Iterations</label>
                <input type="number" bind:value={iterations}>

                <label for="angle">Angle</label>
                <input type="number" id="angle" bind:value={angle}>

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
                <fieldset id="rules">
                    {#each rules as rule}
                        <div>
                            <input type="text" bind:value={rule[0]}>
                            →
                            <input type="text" bind:value={rule[1]}>
                        </div>
                    {/each}

                    <button id="add-rule" onclick={() => rules.push(["", ""])}>+</button>
                </fieldset>

                <!--

                V (the alphabet) is a set of symbols containing both elements that can be replaced (variables) and those which cannot be replaced ("constants" or "terminals")

                -->
                <label title="The alphabet is..." for="alphabet">Alphabet</label>
                <span id="alphabet">{alphabet}</span>
            </form>
        </div>

<!--        <div class="timeline">-->
<!--            <input id="timeline" type="range" min="0" max={iterations - 1} list="timeline-iterations"/>-->
<!--            <datalist id="timeline-iterations">-->
<!--                {#each Object.entries(result) as [iteration, derivation]}-->
<!--                    <option value={iteration} label={derivation}></option>-->
<!--                {/each}-->
<!--            </datalist>-->
<!--        </div>-->
    {/if}
</main>

<style>
    /*.timeline {*/
    /*    position: absolute;*/
    /*    left: 16px;*/
    /*    bottom: 16px;*/

    /*    input[type='range'] {*/
    /*        width: calc(100vw - 32px);*/
    /*    }*/
    /*}*/

    .editor {
        height: calc(100vh - 64px);
        display: grid;
        grid-template:
                "r r" 1fr
                "s s" auto;
    }

    form {
        display: grid;
        grid-template-columns: max-content 1fr;
        gap: 8px;
    }

    #rules {
        display: subgrid;
    }
</style>
