<script lang="ts">
	import SupabaseLayout from "$lib/supabase/SupabaseLayout.svelte";
	import type { LayoutProps } from "./$types";
	import '../app.css';

    let { children, ...restOfProps }: LayoutProps = $props()

</script>

<SupabaseLayout {...restOfProps}>
	{@render children()}
</SupabaseLayout>