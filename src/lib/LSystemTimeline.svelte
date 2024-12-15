<script lang="ts">
    const {lsystemDefinition, lsystemEvaluation} = $props()
    $effect(() => console.log(lsystemEvaluation))

    $inspect(lsystemDefinition)
    $inspect(lsystemEvaluation.alphabet)

    /**
     * Create a set of unique characters.
     * Each character is a row.
     */
</script>

<div id="timeline">
    {#each lsystemEvaluation as iteration}
        <div>{iteration}</div>
    {/each}
</div>

<style>
    #timeline {
        width: 100vw;
        margin: 0;
    }
</style>