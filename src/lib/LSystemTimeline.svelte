<script lang="ts">
    import type {LSystemEvaluation} from "../types/LSystems";
    import type {Action} from 'svelte/action';
    import {scaleOrdinal, scaleLinear} from "d3-scale";
    import {schemeSet2} from "d3-scale-chromatic";
    import {zoom, zoomIdentity} from "d3-zoom";
    import {select} from "d3-selection";

    const {lsystemDefinition, lsystemEvaluation} = $props();

    const TRACK_HEIGHT = 28;
    const MARGIN = { left: 50, right: 20 };

    let width = $state(0);
    let height = $state(0);
    let transform = $state(zoomIdentity);

    const colorScale = scaleOrdinal(schemeSet2);

    // Your existing interfaces...
    interface TimelineEvent {
        symbol: string;
        time: number;
        derivation: number;
        position: number;
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

    const xScale = $derived(
        scaleLinear()
            .domain([0, timelineData.totalTime])
            .range([MARGIN.left, width - MARGIN.right])
    );

    const setupZoom: Action<SVGSVGElement> = (node) => {
        $effect(() => {
            const svg = select(node);

            const zoomed = (event) => {
                transform = event.transform;
            };

            const zoomBehavior = zoom()
                .scaleExtent([0.1, 10])
                .translateExtent([[0, 0], [width, height]])
                .on("zoom", zoomed);

            svg.call(zoomBehavior);

            // Initial zoom to fit
            const initialScale = width / (timelineData.totalTime * 8);
            svg.call(
                zoomBehavior.transform,
                zoomIdentity
                    .translate(MARGIN.left, 0)
                    .scale(initialScale)
            );

            return () => {
                // Cleanup if needed
                svg.on(".zoom", null);
            };
        });
    };
</script>

<svelte:window bind:innerWidth={width}/>

<div id="timeline-container">
    <svg
            use:setupZoom
            viewBox={`0 0 ${width} ${timelineData.tracks.length * TRACK_HEIGHT}`}
            width="100vw"
            height={timelineData.tracks.length * TRACK_HEIGHT}
    >
        <defs>
            <pattern id="grid" width="8" height={TRACK_HEIGHT} patternUnits="userSpaceOnUse">
                <path d="M 8 0 L 0 0 0 ${TRACK_HEIGHT}"
                      fill="none"
                      stroke="rgba(255,255,255,0.1)"
                      stroke-width="0.5"/>
            </pattern>
        </defs>

        <rect width="100%" height="100%" fill="url(#grid)" />

        <g style:transform={transform.toString()}>
            {#each timelineData.tracks as track, index}
                <g class="track" data-track-symbol={track.symbol} style={`transform: translate(0, ${TRACK_HEIGHT * index}px)`}>
                    <rect
                            x="0"
                            y="0"
                            width="100%"
                            height={TRACK_HEIGHT - 2}
                            fill="rgba(0, 0, 0, .1)"
                    />

                    <text
                            x={MARGIN.left - 10}
                            y={TRACK_HEIGHT/2}
                            fill={colorScale(track.symbol)}
                            text-anchor="end"
                            dominant-baseline="middle"
                            style:font-weight="bold"
                    >
                        {track.symbol}
                    </text>

                    {#each track.events as event}
                        <circle
                                cx={xScale(event.time)}
                                cy={TRACK_HEIGHT/2}
                                r="4"
                                fill={colorScale(track.symbol)}
                        />
                    {/each}
                </g>
            {/each}
        </g>
    </svg>
</div>

<style>
    #timeline-container {
        width: 100vw;
    }

    text {
        font-size: 12px;
        pointer-events: none;
    }

    circle {
        transition: r 0.1s ease-out;
    }

    /*circle:hover {*/
    /*    r: 6;*/
    /*}*/
</style>