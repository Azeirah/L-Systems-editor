<script lang="ts">
  import {deriveIterations} from "./lib/LSystem";

  type predecessor = string;
  type successor = string;

  // let alphabet = $state("");
  let root = $state("X");
  let iterations = $state(2);
  let angle = $state(15);
  let rules: [predecessor, successor][] = $state([["X", "X[-X][+X]"]]);

  let result = $derived.by(() => deriveIterations({root, iterations, angle, rules}))

  $effect(() => {
    console.log(iterations);
    console.log(result)
  })
</script>

<main>
<!--  <blockquote cite="https://tinlizzie.org/IA/index.php/An_Interview_with_Dr._Alan_Kay_(1991)#:~:text=useful%20or%20very%20beautiful">-->
<!--    <p>Either make something really useful, or something really beautiful.</p>-->
<!--    <p>—Bell Labs Motto <cite>Alan Kay</cite></p>-->
<!--  </blockquote>-->

  <h1>L-systems</h1>

  <form action="javascript:void(0);">
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

    V (the alphabet) is a set of symbols containing both elements that can be replaced (variables) and those which cannot be replaced ("constants" or "terminals")

    -->
<!--    <label for="alphabet">Alphabet</label>-->
<!--    <input type="text" name="alphabet" bind:value={alphabet}/>-->

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
  </form>



  <canvas>

  </canvas>

  <div class="timeline">
    <input id="timeline" type="range" min="0" max={iterations - 1} list="timeline-iterations"/>
    <datalist id="timeline-iterations">
      {#each Object.entries(result) as [iteration, derivation]}
        <option value={iteration} label={derivation}></option>
      {/each}
    </datalist>
  </div>
</main>

<style>
  .timeline {
    position: absolute;
    left: 16px;
    bottom: 16px;

    input[type='range'] {
      width: calc(100vw - 32px);
    }
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
