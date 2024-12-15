<script lang="ts">
    import type {LSystemEvaluation} from "../types/LSystems";
    import type {Action} from 'svelte/action';
    import {scaleOrdinal, scaleLinear, type ScaleLinear} from "d3-scale";

    import {schemeSet2} from "d3-scale-chromatic";
    import {zoom, zoomIdentity, ZoomTransform} from "d3-zoom";
    import {select, pointer} from "d3-selection";
    import {drag} from "d3-drag";
    import {inspectorState} from "../lsystemState.svelte.js";

    let {lsystemEvaluation, dragHandlePosition} = $props();

    const TRACK_HEIGHT = 28;
    const MARGIN = { left: 50, right: 20 };

    // Basic state
    let width = $state(0);
    let height = $state(0);
    let transform = $state(zoomIdentity);
    let baseScale: ScaleLinear<number, number> = $state(null);
    let zoomedScale: ScaleLinear<number, number> = $state(null);

    const colorScale = scaleOrdinal(schemeSet2);
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

        const lastDerivation = evaluation.derivations[evaluation.derivations.length - 1]

        // Process each symbol in the current derivation
        lastDerivation.split('').forEach((symbol, positionIndex) => {
            const trackIndex = trackIndices.get(symbol);

            const event: TimelineEvent = {
                symbol,
                time: globalTime,
                position: positionIndex
            };

            tracks[trackIndex].events.push(event);
            globalTime++;
        });

        return {
            tracks,
            totalTime: globalTime,
            totalDerivations: evaluation.derivations.length
        };
    }    const timelineData = $derived(createTimelineData(lsystemEvaluation));

    // Initialize base scale when we have real dimensions
    $effect(() => {
        if (width > 0) {
            baseScale = scaleLinear()
                .domain([0, timelineData.totalTime])
                .range([MARGIN.left, width - MARGIN.right]);
        }
    });

    // Keep zoomed scale in sync with transform
    $effect(() => {
        if (baseScale) {
            zoomedScale = transform.rescaleX(baseScale);
        }
    });

    // Helper function to get current x position for an event
    function getEventX(time: number): number {
        return zoomedScale ? zoomedScale(time) : baseScale ? baseScale(time) : 0;
    }

    function updatePointerPosition(screenX: number) {
        if (!zoomedScale) return;

        const time = Math.round(zoomedScale.invert(screenX));
        inspectorState.evaluationIndex = Math.max(0, Math.min(timelineData.totalTime, time));
    }

    const setupInteractions: Action<SVGSVGElement> = (node) => {
        $effect(() => {
            if (!baseScale) return;

            const svg = select(node);

            const zoomed = (event) => {
                transform = event.transform;
            };

            const zoomBehavior = zoom()
                .scaleExtent([0.1, 10])
                .translateExtent([[0, 0], [width, height]])
                .on("zoom", zoomed);

            // Drag behavior for the pointer
            const dragBehavior = drag()
                .on("drag", (event) => {
                    updatePointerPosition(event.x);
                });

            select(node.querySelector(".timeline-pointer")).call(dragBehavior);

            // Click anywhere to move pointer
            svg.on("click", (event) => {
                if (event.target.tagName === "svg") {
                    const [x] = pointer(event);
                    updatePointerPosition(x);
                }
            });

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
                svg.on(".zoom", null).on("click", null);
            };
        });
    };
</script>

<svelte:window bind:innerWidth={width}/>

<div id="timeline-container">
    <svg
            use:setupInteractions
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
                <g class="track"
                   data-track-symbol={track.symbol}
                   style={`transform: translate(0, ${TRACK_HEIGHT * index}px)`}
                >
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
                                cx={getEventX(event.time)}
                                cy={TRACK_HEIGHT/2}
                                r="4"
                                fill={colorScale(track.symbol)}
                                style:opacity={event.time <= dragHandlePosition ? "1" : "0.3"}
                        />
                    {/each}
                </g>
            {/each}

            {#if zoomedScale}
                <g class="timeline-pointer" style:transform={`translateX(${getEventX(dragHandlePosition)}px)`}>
                    <line
                            x1="0"
                            y1="0"
                            x2="0"
                            y2={timelineData.tracks.length * TRACK_HEIGHT}
                            stroke="red"
                            stroke-width="2"
                    />
                    <path
                            d="M -6 0 L 6 0 L 0 8 Z"
                            fill="red"
                            cursor="ew-resize"
                    />
                </g>
            {/if}
        </g>
    </svg>
    {dragHandlePosition} / {timelineData.totalTime}
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
        transition: opacity 0.2s ease-out;
    }

    .timeline-pointer {
        cursor: ew-resize;
    }
</style>