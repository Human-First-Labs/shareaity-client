<script lang="ts">
	import { onDestroy, onMount, setContext, type Snippet } from "svelte";
	import { socket } from "./socket";

    onMount(() => {
        if (!socket.connected) {
            socket.connect()
        }

        socket.off('connect')
        socket.off('disconnect')
        socket.on('connect', () => {
            console.info('Connected!')
            setContext<string | undefined>('socketId', socket.id)
            // if (socket.id) {
            //     updateEvents(socket.id)
            // }
        })
        socket.on('disconnect', () => {
            console.info('Disconnected!')
        })   
    })

    onDestroy(() => {
        socket.off('connect')
        socket.off('disconnect')
        if (socket.connected) {
            socket.disconnect()
        }

    })
    

    const { children }: {
        children: Snippet
    } = $props()

</script>

{@render children()}


