<script lang="ts">
	import Topbar from "$lib/visuals/Topbar.svelte";
	import { onMount } from "svelte";
	import type { LayoutProps } from "../$types";
	import { fade } from "svelte/transition";

    let { children }: LayoutProps = $props()

    
    let ready = $state(false);
    onMount(() => ready = true);
</script>

<Topbar/>
{#if ready}
<div class="topbar-space" in:fade>
    {@render children()}
</div>
{/if}
<!-- <Footer/> -->

<style>
    .topbar-space {
        margin-top: var(--topbar-mobile-height)
    }

    @media (min-width: 720px) {
        .topbar-space {
            margin-top: var(--topbar-height);
        }
    }
</style>