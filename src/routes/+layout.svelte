<script lang="ts">
	import SupabaseAuth from '$lib/am/supabase/SupabaseAuth.svelte';
	import Footer from '$lib/Footer.svelte';
import Header from '$lib/Header.svelte';
	import '../app.css';

	let { children } = $props();
</script>

<svelte:head>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<SupabaseAuth appName="MyTime">
	<div class="app">
		<Header />
	
		<main>
			{@render children()}
		</main>

		<Footer/>
	</div>
</SupabaseAuth>

<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: 1rem;
		width: 100%;
		max-width: 64rem;
		margin: 0 auto;
		box-sizing: border-box;
	}
</style>
