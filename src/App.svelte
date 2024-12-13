<script lang="ts">
    import {blur} from "svelte/transition";
    import {deriveIterations} from "./lib/LSystem";

    import WelcomeScreen from "./lib/WelcomeScreen.svelte";
    import LSystemCanvasRenderer from "./lib/LSystemCanvasRenderer.svelte";
    import {examples} from "./lsystem_examples";

    type predecessor = string
    type successor = string

    let root = $state("-X")
    let iterations = $state(4)
    let angle = $state(15)
    let length = $state(4)
    let length_factor = $state(1)
    let rules: [predecessor, successor][] = $state([["F", "FF"], ["X", "F+[[X]-X]-F[-FX]+X"]])
    let color = $state("black")

    let cheatsheetOverlayActive = $state(false)

    let result = $derived(deriveIterations({root, iterations, rules}))

    let secret = $state("")

    let onSplash = $state(false)

    const toggleCheatsheet = () => {
        cheatsheetOverlayActive = !cheatsheetOverlayActive
    }
</script>

<svelte:window onclick={() =>{onSplash=false}} onkeydown={(e) => {
    switch (e.key) {
        case "F1":
        case "?":
            toggleCheatsheet()
            break
    }
}}/>

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
                    length_factor,
                    color,
                    secret
                }}/>
            </div>

            {#if cheatsheetOverlayActive}
                <div id="cheatsheet-overlay">
                    <h1>Cheatsheet</h1>
                    <h2>Legend of commands</h2>

                    <pre>
                        <code>
Character        Meaning
`F`	         Move forward by line length drawing a line
`f`	         Move forward by line length without drawing a line
`+`	         Turn left by turning angle
`-`	         Turn right by turning angle
`[`	         Push current drawing state onto stack
`]`	         Pop current drawing state from the stack
`&gt;`	         Multiply the line length by the line length scale factor
`&lt;`	         Divide the line length by the line length scale factor
                </code>
                    </pre>
                </div>
            {/if}

            <div class="configuration" style="grid-area: s" transition:blur>
                <fieldset id="parameters">
                    <legend>Drawing parameters</legend>
                    <label for="angle">Angle</label>
                    <input type="number" id="angle" bind:value={angle}>
                    <label for="length">Length</label>
                    <input type="number" id="length" bind:value={length} min="1" step="1" max="10">
                    <label for="length_factor">Length factor</label>
                    <input type="number" id="length_factor" bind:value={length_factor} min="1" max="2" step="0.01">
                    <label for="secret">Secret</label>
                    <textarea type="text" id="secret" bind:value={secret}></textarea>
                </fieldset>

                <fieldset id="definition">
                    <legend>L-System</legend>

                    <label for="iterations">Iterations</label>
                    <input type="number" name="iterations" id="iterations" bind:value={iterations}>
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
                    <label for="rules">Rules
                        <button onclick={toggleCheatsheet}>(?)</button>
                    </label>
                    <div>
                        {#each rules as rule, index}
                            <div class="rule">
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
                    <select name="examples" id="examples" onchange={(e) => {
                        const chosen = e.target.value;
                        const config = examples[chosen]

                        rules = config.rules
                        root = config.root

                        angle = config.angle
                        length = config.length
                        length_factor = config.length_factor
                        iterations = config.iterations
                    }}>
                        {#each Object.entries(examples) as [name, config], index}
                            <option value={name}>{name}</option>
                        {/each}
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

    #cheatsheet-overlay {
        background: rgba(9, 8, 8, 0.74);
        border-radius: 6px;
        padding: 8px;
        position: absolute;
        top: 16px;
        left: 16px;
        width: calc(100vw - 32px);
        height: calc(100vh - 32px);
    }

    .configuration {
        display: grid;
        grid-template-columns: repeat(12, 1fr);
        gap: 8px;

        & #parameters {
            display: grid;
            grid-template-columns: min-content min-content;
            gap: 8px;
        }

        & #definition {
            display: grid;
            grid-template-columns: min-content;
            gap: 8px;

            & input:first-child {
                width: 2rem;
            }
        }

        .rule {
            display: flex;
            gap: 4px;
        }
    }
</style>
