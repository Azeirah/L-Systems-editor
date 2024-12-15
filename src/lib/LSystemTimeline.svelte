<script lang="ts">
    import type {LSystemEvaluation} from "../types/LSystems";
    import {scaleOrdinal} from "d3-scale";
    import {schemeSet2} from "d3-scale-chromatic"

    const {lsystemDefinition, lsystemEvaluation} = $props()

    const TRACK_HEIGHT = 30;
    const LABEL_WIDTH = 40;
    const TIMELINE_WIDTH = "100vw";
    const DOT_RADIUS = 6;

    const colorScale = scaleOrdinal(schemeSet2)

    interface TimelineEvent {
        symbol: string;      // The character/symbol (F, +, X, etc)
        time: number;        // Global sequential position
        derivation: number;  // Which generation/iteration this came from
        position: number;    // Position within its derivation
    }

    interface TrackInfo {
        symbol: string;
        events: TimelineEvent[];
    }

    interface TimelineData {
        tracks: TrackInfo[];
        totalTime: number;
        totalDerivations: number;
    }

    function createTimelineData(evaluation: LSystemEvaluation): TimelineData {
        // Create tracks for each unique symbol in the alphabet
        const tracks: TrackInfo[] = evaluation.alphabet.split('').map(symbol => ({
            symbol,
            events: [],
        }));

        // Create lookup map for quick symbol -> track index access
        const trackIndices = new Map(
            evaluation.alphabet.split('').map((symbol, index) => [symbol, index])
        );

        let globalTime = 0;

        // Process each derivation
        evaluation.derivations.forEach((derivation, derivationIndex) => {
            // Process each symbol in the current derivation
            derivation.split('').forEach((symbol, positionIndex) => {
                const trackIndex = trackIndices.get(symbol);

                const event: TimelineEvent = {
                    symbol,
                    time: globalTime,
                    derivation: derivationIndex,
                    position: positionIndex
                };

                tracks[trackIndex].events.push(event);
                globalTime++;
            });
        });

        return {
            tracks,
            totalTime: globalTime,
            totalDerivations: evaluation.derivations.length
        };
    }

    const timelineData = $derived(createTimelineData(lsystemEvaluation));

    $inspect(timelineData)
</script>

<div id="timeline-container">
    <svg viewBox={`0 0 800 200`} xmlns="http://www.w3.org/2000/svg">
        {#each timelineData.tracks as track, index}
            <g transform={`translate(0, ${20 * index + 8 * index})`}>
                <rect x="0" y="0" width="100vw" height={20} fill="rgba(0, 0, 0, .1)"></rect>
                <text x="8" y="16" fill={colorScale(track.symbol)}>{track.symbol}</text>
                {#each track.events as event}
                    <circle cx="{40 + event.position * 8}" cy="12" r="4" fill={colorScale(track.symbol)}></circle>
                {/each}
            </g>
        {/each}
    </svg>
</div>

<style>
    #timeline-container {
        width: 100vw;
        margin: 0;
    }
</style>