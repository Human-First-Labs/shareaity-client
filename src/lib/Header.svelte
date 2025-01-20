<script lang="ts">
	import { page } from '$app/state';
</script>

<header>
	<a href="/">
		<div class="corner">
			<!-- <a href="https://svelte.dev/docs/kit">
				<img src={logo} alt="SvelteKit" />
			</a> -->
			<p style="margin: 0">
				Logo
			</p>
		</div>
	</a>

	<nav>
		<ul>
			<li aria-current={page.url.pathname === '/the-experiment' ? 'page' : undefined}>
				<a href="/the-experiment">The Experiment</a>
			</li>
			<li aria-current={page.url.pathname.startsWith('/who-we-are') ? 'page' : undefined}>
				<a href="/who-we-are">Who We Are</a>
			</li>
			<li aria-current={page.url.pathname.startsWith('/what-we\'ve-done') ? 'page' : undefined}>
				<a href="/what-we\'ve-done">What We've Done</a>
			</li>
			<li aria-current={page.url.pathname.startsWith('/the-looking-glass') ? 'page' : undefined}>
				<a href="/the-looking-glass">The Looking Glass</a>
			</li>
			<li aria-current={page.url.pathname.startsWith('/what-you-can-do') ? 'page' : undefined}>
				<a href="/what-you-can-do">What you can do</a>
			</li>
		</ul>
	</nav>
</header>

<style>
	header {
		display: flex;
		background-color: rgba(255, 255, 255, 0.7);
		border-bottom-left-radius: 20px;
		border-bottom-right-radius: 20px;
		position: sticky;
		top: 0;
	}

	.corner {
		padding: 10px;
	}

	nav {
		display: flex;
		justify-content: center;
		/* --background: rgba(255, 255, 255, 0.7); */
	}

	ul {
		position: relative;
		padding: 0;
		margin: 0;
		height: 3em;
		display: flex;
		justify-content: center;
		align-items: center;
		list-style: none;
		background: var(--background);
		background-size: contain;
	}

	li {
		position: relative;
		height: 100%;
	}

	li[aria-current='page']::before {
		--size: 6px;
		content: '';
		width: 0;
		height: 0;
		position: absolute;
		top: 0;
		left: calc(50% - var(--size));
		border: var(--size) solid transparent;
		border-top: var(--size) solid var(--color-theme-1);
	}

	nav a {
		display: flex;
		height: 100%;
		align-items: center;
		padding: 0 0.5rem;
		color: var(--color-text);
		font-weight: 700;
		font-size: 0.8rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		text-decoration: none;
		transition: color 0.2s linear;
	}

	a:hover {
		color: var(--color-theme-1);
	}
</style>
