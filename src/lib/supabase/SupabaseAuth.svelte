<script lang="ts">
	import type { AuthSession } from "@supabase/supabase-js";
	import { supabase } from "./supabaseClient";
	import { onMount, type Snippet } from "svelte";
	import { Turnstile } from "svelte-turnstile";

    const VITE_TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY

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

                controller?.signal.removeEventListener("abort", abortHandler);
                resolve(response.data);
            }).catch((error) => {
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

{#if !session}
    <div class="cover">
        <div class="popup">
            <Turnstile siteKey={VITE_TURNSTILE_SITE_KEY} on:callback={tokenGetter}/>
        </div>
    </div>
{/if}
{@render children()}


<style>
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
