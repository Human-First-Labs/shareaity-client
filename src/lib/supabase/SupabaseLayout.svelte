<script lang="ts">
	import { onMount } from 'svelte';
	import { invalidate } from '$app/navigation';
	import {Turnstile} from 'svelte-turnstile';
	import type { LayoutProps } from '../../routes/$types';
	
    let { data, children }: LayoutProps = $props()
    let { session, supabase } = $derived(data)

    const VITE_TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY

	const getCurrentSession = (captchaToken: string | undefined, controller?: AbortController) => {

		if (controller?.signal.aborted){
			return Promise.reject(new DOMException("Aborted", "AbortError"));
		}

		return new Promise((resolve, reject) => {
			const abortHandler = () => {
				reject(new DOMException("Aborted", "AbortError"));
			}
		
			supabase.auth.getSession().then(async (response) => {
				if(!captchaToken){
					return reject(new Error("captcha token is missing"));
				}
				const result = await supabase.auth.signInAnonymously({
					options: {
						captchaToken
					}
				})
				controller?.signal.removeEventListener("abort", abortHandler);
				if(result.error){
					console.error(result.data)
					reject(result.error);
				}else{
					resolve(response.data);
				}

			}).catch((error) => {
				controller?.signal.removeEventListener("abort", abortHandler);
				reject(error);
			});
			controller?.signal.addEventListener("abort", abortHandler);
		});
	}
	
    onMount(() => {
        const { data } = supabase.auth.onAuthStateChange((_, newSession) => {
			if (newSession?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth')
			}
		})

        return () => data.subscription.unsubscribe()
    })

    const tokenGetter = (e:CustomEvent<{ token: string; preClearanceObtained: boolean; }>) => {
        getCurrentSession(e.detail.token)
    }
</script>

<svelte:head>
	<meta name="description" content="A Web Application for Shareiety" />
</svelte:head>

{#if !session}
    <div class="cover">
        <div class="popup">
            <h2>Sorry about this!</h2>
            <h4>Just making sure you're not a bot</h4>
            <small>You know how it is these days :(</small>
            <Turnstile siteKey={VITE_TURNSTILE_SITE_KEY} on:callback={tokenGetter}/>
        </div>
    </div>
{:else}
	<div class="app">
		<main>
			{@render children()}
		</main>
	</div>
{/if}

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
		width: 100%;
		max-width: 64rem;
		margin: 0;
		box-sizing: border-box;
	}


    h2 {
        font-size: 1.5rem;
        font-weight: 600;
        margin: 0
    }
    h4 {
        font-size: 1.25rem;
        font-weight: 500;
        margin: 0
    }
	.cover {
		display: flex;
		flex-direction: column;
		height: 100vh;
        width: 100vw;
        justify-content: center;
        align-items: center;
        position: absolute;
        z-index: 5;
        top: 0;
        left: 0;
        background-color: rgba(0, 0, 0, 0.5);
	}
    .popup{
        display: flex;
        background-color: white;
        align-items: center;
		flex-direction: column;
        border-radius: 16px;
        max-width: 60%;
        padding: 20px;
        box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
        text-align: center;
        gap: 20px
    }
</style>


