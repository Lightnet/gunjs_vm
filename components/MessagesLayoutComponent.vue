<template>
    <div id="chatpanel">
        <div id="chatmessages">
            <div v-for="item in chatmessages" :key="item.id">
                {{ item.text }}
            </div>
        </div>
        <div id="chatbox">
            <template v-if="bshowchat">
                <input v-model="chatmessage" v-on:keyup.enter="onEnterChat" placeholder="Reply here"/>
                <button v-on:click="btnchat"> Chat </button> <label> Message </label>
            </template>
            <button v-on:click="btntogglesearch"> {{displayiconsearch}} </button>
            <template v-if="bshowsearch">
                <!-- v-on:change="onselectuser" -->
                <select v-model="selectcontact" >
                    <option selected disabled> - Select Alias Key - </option>
                    <option v-for="item in contacts" :key="item.value"> {{item.text}} </option>
                </select>

                <input v-model="publickey" v-on:keydown="onchangepubkey" />

                <button v-on:click="btnadduser">+</button>
                <button v-on:click="btnremoveuser">-</button>
                <label>Who: {{currentstatus}}</label>

                <button v-on:click="btnshowchat">show chat</button>
            </template>

        </div>
    </div>
</template>
<script>
export default {
    name:"chatpanel",
    data() {
        return {
            bshowchat:true,
            bshowsearch:true,
            bgunsetmessage:false,
            displayiconsearch:"|",
            chatmessage:"",
            currentstatus:"?",
            elcontent:null,
            elchatarea:null,
            elchatbox:null,
            chatmessages:[],
            contacts:[],
            selectcontact:"",
            publickey:"", //public key
            UIdec:"", // decode key
            gunuser:null, //owner user
            gunto:null, //refer user
            
        }
    },
    created: function () {
    },
    mounted:function(){
        //this.initChat();
        this.elcontent = document.getElementById("chatpanel");
        this.elchatarea = document.getElementById("chatmessages");
        this.elchatbox = document.getElementById("chatbox");
        window.addEventListener("resize", this.resize.bind(this));
        window.dispatchEvent(new Event('resize'));
        this.updateContacts();
    },
    beforeDestroy() {
        window.removeEventListener("resize", this.resize.bind(this));
    },
    watch: {
        publickey:function(val, oldVal) {
            console.log("change...");
            this.onchangepubkey();
        }
    },
    methods: {
        onEnterChat: function() {
            console.log(this.chatmessage);
            this.sendmessage(this.chatmessage);
        },
        btnchat:function(){
            console.log(this.chatmessage);
            this.sendmessage(this.chatmessage);
        },
        sendmessage: async function(_value){
            let msg = (_value || "").trim();
            if(!msg){
                console.log("EMPTY");
                return;
            }
            let user = this.$gun.user();
            if(!user.is){ return }//check if user 
            
            //let msg = ($('#inputmessagechat').val() || '').trim();
            //let publickey = ($('#mpublickey').val() || '').trim();
            let publickey = (this.publickey || '').trim();
            //if(!msg){console.log("Message EMPTY!");return;}
            if(!publickey){console.log("Public Key EMPTY!");return;}
            //let user = this.$gun.user();
            let to = this.$gun.user(publickey);//get alias
            let who = await to.then() || {};//get alias data
            if(!who.alias){console.log("No Alias!");return;}
            let sec = await Gun.SEA.secret(who.epub, user._.sea); // Diffie-Hellman
            let enc = await Gun.SEA.encrypt(msg, sec); //encrypt message
            user.get('messages').get(publickey).set(enc);

            console.log("send message...");
            if(this.bgunsetmessage==false){
                this.viewprivatemessages();
                this.bgunsetmessage=true;
            }
            
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
        },
        btnshowchat:function(){
            this.bshowchat = !this.bshowchat;
        },
        btntogglesearch:function(){
            this.bshowsearch = !this.bshowsearch;
            if(this.bshowsearch){
                this.displayiconsearch = "|";
            }else{
                this.displayiconsearch = ">";
            }
        },
        btnadduser: async function(){
            console.log("ADD");
            console.log(this.publickey);
            //let publickey = ($('#mpublickey').val() || '').trim();
            let publickey = (this.publickey || '').trim();
            if(!publickey){console.log("Public Key EMPTY!");return;}
            let user = this.$gun.user();
            if(publickey==user.is.pub){
                console.log("SAME USER!");
                return;
            }
            let to = this.$gun.user(publickey);//get alias
            let who = await to.then() || {};//get alias data
            if(!who.alias){console.log("No Alias!");return;}
            user.get("contacts").get(publickey).put({alias:who.alias});
            this.updateContacts();
        },
        btnremoveuser: async function(){
            console.log("REMOVE");
            console.log(this.publickey);
            //let publickey = ($('#mpublickey').val() || '').trim();
            let publickey = (this.publickey || '').trim();
            if(!publickey){console.log("Public Key EMPTY!");return;}
            let user = this.$gun.user();
            let to = this.$gun.user(publickey);//get alias
            let who = await to.then() || {};//get alias data
            if(!who.alias){console.log("No Alias!");return;}
            user.get("contacts").get(publickey).put(null);
            this.updateContacts();
        },
        updateContacts: async function(){
            this.contacts=[];
            let user = this.$gun.user();
            let self = this;
            user.get("contacts").once().map().once(function(data,key){
                //console.log("data",data);
                //console.log("key",key);
                //if($("#" + key).length){
                //}else{
                    if(data !=null){
                        self.addusercontact(key, data);
                    }
                //}
            });
        },
        addusercontact(index, data) {
            //console.log("index",index);console.log("value",data);
            //console.log($("#" + index).length)
            let bfound=false;
            this.contacts.push({
                value: index,
                text : data.alias 
            });
        },
        onchangepubkey: async function(){
            console.log("...");
            if(!this.publickey){
                console.log("EMPTY");
                return;
            }
            let to = this.$gun.user(this.publickey);
            let who = await to.get('alias').then();
            if(who){
                this.currentstatus = who;
            }else{
                this.currentstatus = "?";
            }
            
            console.log(who);
        },
        onselectuser:function(){
            console.log("selected",this.selectcontact);
            for(let i = 0; i < this.contacts.length;i++){
                if(this.contacts[i].text == this.selectcontact){
                    this.publickey = this.contacts[i].value;
                    break;
                }
            }
        },
        viewprivatemessages: async function(){
            let user = this.$gun.user();
            if(!user.is){ return }//check if user exist
            //messages = [];
            //CleanMessages();
            this.chatmessages=[];
            let pub = (this.publickey || '').trim();
            if(!pub) return;//check if not id empty
            let to = this.$gun.user(pub);//get alias
            let who = await to.then() || {};//get alias data
            if(!who.alias){
                console.log("No Alias!");
                $('#mwho').text("who?");
                return;
            }
            //$('#mwho').text(who.alias);
            this.UIdec = await Gun.SEA.secret(who.epub, user._.sea); // Diffie-Hellman
            let self = this;
            user.get('messages').get(pub).map().once((data,id)=>{
                self.UI(data,id,user.is.alias)
            });
            to.get('messages').get(user._.sea.pub).map().once((data,id)=>{
                self.UI(data,id,who.alias)
            });
        },
        UI: async function (say, id, alias){
            say = await Gun.SEA.decrypt(say, this.UIdec);

            this.chatmessages.push({
                id: id,
                text : alias + ": " + say
            });

            /*
            //messages.push({id:id,alias:alias,message:say});
            if($("#" + id).length){
                //console.log("found!?");
            }else{
                $('#messagelist').append($('<div/>', { 
                    
                }));
            }
            let element = document.getElementById("messagelist");
            element.scrollTop = element.scrollHeight;
            */
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