<script lang="ts">
	import type { AuthSession } from "@supabase/supabase-js";
	import { supabase } from "./supabaseClient";
	import { onMount, type Snippet } from "svelte";
	import { Turnstile } from "svelte-turnstile";

    const VITE_TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY

    let checked: boolean = $state(false)
    let session: AuthSession | null = $state(null)

    const { children }: {
        children: Snippet
    } = $props()

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
                    checked = true
                    return reject(new Error("captcha token is missing"));
                }
                const result = await supabase.auth.signInAnonymously({
                    options: {
                        captchaToken
                    }
                })
                if(result.error){
                    console.error(result.error)
                }

                checked = true
                controller?.signal.removeEventListener("abort", abortHandler);
                resolve(response.data);
            }).catch((error) => {
                checked = true
                controller?.signal.removeEventListener("abort", abortHandler);
                reject(error);
            });
            controller?.signal.addEventListener("abort", abortHandler);
        });
    }

    onMount(() => {
        const controller = new AbortController()

        const listener = supabase.auth.onAuthStateChange((_event, _session) => {
            session = _session
        })
        getCurrentSession(undefined, controller)

        return () => {
            controller.abort()
            listener.data.subscription.unsubscribe()
        }
    })

    const tokenGetter = (e:CustomEvent<{ token: string; preClearanceObtained: boolean; }>) => {
        getCurrentSession(e.detail.token)
    }
</script>

{#if !session && checked}
    <div class="cover">
        <div class="popup">
            <h2>Sorry about this!</h2>
            <h4>Just making sure you're not a bot</h4>
            <small>You know how it is these days :(</small>
            <Turnstile siteKey={VITE_TURNSTILE_SITE_KEY} on:callback={tokenGetter}/>
        </div>
    </div>
{/if}
{@render children()}


<style>
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
    p{
        font-size: 1rem;
        font-weight: 400;
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
