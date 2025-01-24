<script lang="ts">
	import { getContext, onDestroy, onMount, setContext, type Snippet } from "svelte";
	import { apiSDK } from "./apiSDK";
	import type { IUser } from "./types";
	import { socket } from "./socket/socket";

    const { children }: {
        children: Snippet
    } = $props()

    let eventId = $state<string>()
    let user = $state<IUser>()

    const controller = new AbortController()

    onMount(async () => {
        console.log('testing')
        try{
            const socketId = getContext<string | undefined>('socketId')
            const result = await apiSDK.getMyUser({
                controller,
                eventId,
                socketId
            })

            user = result.data.user
            console.log('test', user)
            setContext('user', user)

            eventId = result.data.socketEvent.id
        } catch (e: any) {
            if (e.name !== 'CanceledError') {
                console.info(e)
            }
        }
    })

    onDestroy(() => {
        controller.abort()
        socket.off(eventId)
    })

    $effect(() => {
        if(eventId){
            socket.on(eventId, (data) => {
                console.log(data)
                user = data
            })
        }
        
        return () => {
            socket.off(eventId)
        }
    })



</script>


{@render children()}