<template>
    <div>
        <h2 class="text-center">Hello From Component</h2>
        <ChatPanel></ChatPanel>
    </div>
</template>
<script>
import ChatPanel from './components/TestChatComponent';

export default {
    components:{
        ChatPanel,
    }
}
</script>