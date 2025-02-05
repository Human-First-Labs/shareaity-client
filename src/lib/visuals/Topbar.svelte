<script lang='ts'>
	import { onMount } from "svelte";
	import { fly } from "svelte/transition";

    let ready = $state(false);
    onMount(() => ready = true);

    const topbarItems: {
        title: string,
        url: string
    }[] = [
        {
            title: 'About us',
            url: '/about-us'
        },
        {
            title: 'So far',
            url: '/so-far'
        },
        {
            title: 'Human First Labs',
            url: '/human-first-labs'
        }
    ]

</script>

{#if ready}
<header in:fly="{{
    y: -60
}}">
    <div class="header-items">
        <div class="left-items">
            <a href="/">
                <h3>Shareiety</h3>
            </a>
            <div class="nav-items">
                {#each topbarItems as item}
                    <a href={item.url}>
                        <small>{item.title}</small>
                    </a>
                {/each}
            </div>

        </div>
        <div class="right-items">
            <a href="/app">
                <button>
                    Get Started
                </button>
            </a>
        </div>
    </div>
</header>
{/if}


<style>
    button{
        background-color: var(--primary);
        color: white;
        border-radius: 5px;
        padding: 10px;
        border: none;
        cursor: pointer;
    }

    header {
        display: flex;
        top: 0;
        position: absolute;
        background-color: white;
        height: var(--topbar-mobile-height);
        width: 100%;
        align-items: center;
    }

    .header-items{
        display:flex;
        justify-content: space-between;
        width: 100%;
        padding: 0 2rem;
    }

    .left-items{
        display: flex;
        align-items: center;
    }

    h3{
        font-weight: bold;
    }

    small{
        font-weight: bold;
        color: var(--color-text)
    }

    .nav-items {
        display: flex;
        padding: 0 30px;
        gap: 25px;
    }

    @media (min-width: 720px) {
        header {
            height: var(--topbar-height);
        }
    }
</style>