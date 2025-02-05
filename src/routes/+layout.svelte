<script lang="ts">
	import SupabaseLayout from "$lib/supabase/SupabaseLayout.svelte";
	import type { LayoutProps } from "./$types";
	import '../app.css';
	// import { page } from "$app/state";

	const appName = "Shareiety";
	// const { url } = page

	// const title = $derived([appName, ...url.pathname.split("/").slice(1)].filter(Boolean).join(" - "))

    let { children, ...restOfProps }: LayoutProps = $props()
</script>

<svelte:head>
	<title>{appName}</title>
	<meta name="description" content="The Shareiety Web App" />
</svelte:head>

<SupabaseLayout {...restOfProps}>
	{@render children()}
</SupabaseLayout>