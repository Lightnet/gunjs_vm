<template>
    <div id="chatpanel">
        <!--<h2 class="text-center">Chat Room</h2>-->
        <div id="chatmessages">
            <div v-for="item in chatmessages" :key="item.id">
                {{ item.message }}
            </div>
        </div>
        <div id="chatbox">
            <input v-model="chatmessage" v-on:keyup.enter="onEnterChat" placeholder="Reply here"/>
            <button v-on:click="btnchat"> Chat </button>  <label> Simple Chat </label>
        </div>
    </div>
</template>
<script>
export default {
    name:"chatpanel",
    data() {
        return {
            chatmessage:"",
            elcontent:null,
            elchatarea:null,
            elchatbox:null,
            chatmessages:[],
            userid:Gun.text.random(16),
            gunchat:null,
        }
    },
    created: function () {
        console.log("init chat...");
    },
    mounted:function(){
        this.initChat();
        this.elcontent = document.getElementById("chatpanel");
        this.elchatarea = document.getElementById("chatmessages");
        this.elchatbox = document.getElementById("chatbox");
        window.addEventListener("resize", this.resize.bind(this));
        window.dispatchEvent(new Event('resize'));
    },
    beforeDestroy() {
        this.gunchat.off();
        this.gunchat = null;
        window.removeEventListener("resize", this.resize.bind(this));
    },
    methods: {
        initChat:function(){
            let self = this;
            function qcallback(data,key){
                //console.log('incoming messages...');
                //console.log("key:",key);
                //console.log("data >> ",data);
                if(data == null)return;
                if(data.message != null){
                    let dec = data.message;
                    if(dec!=null){
                        self.chatmessages.push({id:key, message: data.alias + ": " + dec });
                        //chatmessages.push({id:key, text: data.alias + ": " + dec });
                        //chatmessages=chatmessages;
                        setTimeout(()=>{
                            self.scrollbottom();
                        },100);
                    }
                }
            }

            let currentDate = new Date();
            let year = currentDate.getFullYear();
            let month = ("0" + (currentDate.getMonth() + 1 ) ).slice(-2);
            let date = ("0" +currentDate.getDate()).slice(-2);
            let timestring = year + "/" + month + "/" + date + ":";
            //console.log(timestring);
            if(this.gunchat !=null){
                this.gunchat.off();
            }
            this.gunchat = this.$gun.get('simplechat');
            this.gunchat.get({'.': {'*': timestring},'%': 50000}).map().once(qcallback);
        },
        onEnterChat: function() {
            console.log("enter");
            console.log(this.chatmessage);
            this.sendmessage(this.chatmessage);
        },
        btnchat:function(){
            console.log(this.chatmessage);
            this.sendmessage(this.chatmessage);
        },
        sendmessage:function(_value){
            let msg = (_value || "").trim();
            if(!msg){
                console.log("EMPTY");
                return;
            }
            let gen = Gun.text.random(16);
            console.log(gen);

            this.gunchat.get(this.timestamp()).put({
                alias:this.userid,
                message:msg
            });

            //this.$gun.get('simplechat').get(this.timestamp()).put({
                //alias:this.userid,
                //message:enc
                //message:msg
            //});

            /*
            this.chatmessages.push({
                id:gen,
                alias:this.userid,
                message:msg
            });
            setTimeout(()=>{
                this.scrollbottom();
            },300);
            */
            
        },
        resize:function(){
            //console.log("...",this.elchatarea);
            let parent = this.elcontent.parentNode;
            if(parent !=null){
                this.elcontent.style.height = (parent.clientHeight)  + 'px';

                //console.log(parent.clientHeight);
                this.elchatarea.style.height = (parent.clientHeight - 2*24) + 'px';
                this.elchatarea.style.width = parent.clientWidth + 'px';

                this.elchatbox.style.height = 24 + 'px';
                this.elchatbox.style.width = parent.clientWidth + 'px';
            }
        },
        scrollbottom:function(){
            let element = document.getElementById("chatmessages");
            element.scrollTop = element.scrollHeight + 32;
        },
        timestamp: function(){
            let currentDate = new Date();
            //console.log(currentDate);
            let year = currentDate.getFullYear();
            let month = ("0" + (currentDate.getMonth() + 1 ) ).slice(-2);
            let date = ("0" +currentDate.getDate()).slice(-2);
            let hour = ("0" +currentDate.getHours()).slice(-2);
            let minute = ("0" +currentDate.getMinutes()).slice(-2);
            let second = ("0" +currentDate.getSeconds()).slice(-2);
            let millisecond = currentDate.getMilliseconds();
            return year + "/" + (month) + "/" + date + ":" + hour+ ":" + minute+ ":" + second+ ":" + millisecond;        
        }
    }
}
</script>
<style>
    #chatpanel{
        height: 100%;
        width: 100%;
    }

    #chatmessages{
        overflow-y: scroll;
    }

</style>