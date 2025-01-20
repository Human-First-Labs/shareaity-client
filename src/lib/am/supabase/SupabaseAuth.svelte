<script lang="ts">
	import type { AuthSession } from "@supabase/supabase-js";
	import { supabase } from "./supabaseClient";
	import { onMount, type Snippet } from "svelte";

    let session: AuthSession | null = $state(null)

    let loading = $state(false)
    const { children, interrupt, appName }: {
        children: Snippet,
        interrupt?: boolean,
        appName: string
    } = $props()

    const getCurrentSession = (controller: AbortController) => {

        if (controller.signal.aborted){
            return Promise.reject(new DOMException("Aborted", "AbortError"));
        }

        return new Promise((resolve, reject) => {
            const abortHandler = () => {
                reject(new DOMException("Aborted", "AbortError"));
            }

            supabase.auth.getSession().then(async (response) => {

                if(!interrupt){
                    const result = await supabase.auth.signInAnonymously({
                        options: {
                            captchaToken: "test"
                        }
                    })
                    if(result.error){
                        console.error(result.error)
                    }
                }

                controller.signal.removeEventListener("abort", abortHandler);
                resolve(response.data);
            }).catch((error) => {
                controller.signal.removeEventListener("abort", abortHandler);
                reject(error);
            });
            controller.signal.addEventListener("abort", abortHandler);
        });
    }

    onMount(() => {
        const controller = new AbortController()

        const listener = supabase.auth.onAuthStateChange((_event, _session) => {
            console.log('testing', _session)
            session = _session
        })
        getCurrentSession(controller)

        return () => {
            controller.abort()
            listener.data.subscription.unsubscribe()
        }
    })
</script>

{@render children()}
{#if !session && interrupt}
    <div class="app">
        <div class="content">
            <p>
                Hi! Seems like its your first time using {appName}, so we just wanted to let you know this system is built by Decorporate. If you want to know more about us, click <a href="https://anti-money.com">through</a>.
            </p>
            <p>
                Help us build a better, less restrictive future!
            </p>
            <button onclick={
                async () => {
                    if(!loading){
                        loading = true
                           const result = await supabase.auth.signInAnonymously()

                           if(result.error){
                               console.error(result.error)
                           }
                        
                        loading = false
                    }
                }
            } class="button" >
                {#if loading}
                    Loading...
                {:else}
                    Continue
                {/if}
            </button>
        </div>
    </div>
{/if}

<style>
	.app {
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

    .button {
        background-color: var(--color-theme-1);
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 8px;
        cursor: pointer;
    }

    .content{
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
