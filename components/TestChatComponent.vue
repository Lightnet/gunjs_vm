<template>
    <div id="chatpanel">
        <h2 class="text-center">Chat Room</h2>
        <input v-model="chatmessage" v-on:keyup.enter="onEnterChat" placeholder="Reply here"/>
        <button v-on:click="btnchat"> Chat </button>
        <button v-on:click="btnguntest"> Gun </button>

    </div>
</template>
<script>
export default {
    name:"chatpanel",
    data() {
        return {
            chatmessage:"",
        }
    },
    methods: {
        onEnterChat: function() {
            //this.msg = 'on enter event';
            console.log("enter");
            console.log(this.chatmessage);
        },
        btnchat:function(){
            console.log(this.chatmessage);
        },
        btnguntest:function(){
            console.log(this.$gun);
        }
    }
}
</script>