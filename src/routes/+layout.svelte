<script lang="ts">
	import SupabaseAuth from '$lib/supabase/SupabaseAuth.svelte';
	import UserCheck from '$lib/UserCheck.svelte';
	import '../app.css';

	let { children } = $props();
</script>

<svelte:head>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<SupabaseAuth>
	<UserCheck>
		<div class="app">
			<main>
				{@render children()}
			</main>
		</div>
	</UserCheck>
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
