<template>
    <div id="privatechatpanel">
        <div id="chatmessages">
            <div v-for="item in chatmessages" :key="item.id">
                {{ item.message }}
            </div>
        </div>
        <div id="chatbox">
            <template v-if="bshowchat">
                <input v-model="chatmessage" v-on:keyup.enter="onEnterChat" placeholder="Reply here"/>
                <button v-on:click="btnchat"> Chat </button>  <label> Private Chat </label>
                <button v-on:click="btnprivatechatleave">Leave</button>
            </template>
            <template v-else>
                <button v-on:click="btnprivatechatcreate">Create</button>
                <select v-model="selectprivatekey" v-on:change="onselectprivatekey">
                    <option value="" selected="selected"> - Select Private Key - </option>
                    <option  v-for="item in privaterooms" :key="item.value" v-bind:value="item.value">{{item.text}}</option>
                </select>
                <input v-model="privatekey" placeholder="Private Key"/>
                <button v-on:click="btnprivatechatjoin">Enter</button>
                <button v-on:click="btnprivatechatadd">+</button>
                <button v-on:click="btnprivatechatremove">-</button>
                <label> Status: {{displaystatusprivatekey}} </label>
            </template>
            <template v-if="bshowaccess">
                <input v-model="publickey" placeholder="Public Key"/>
                <button v-on:click="btnprivatechatgrant">+</button>
                <button v-on:click="btnprivatechatrevoke">-</button>
                <label> Who: {{displaystatuspublickey}} </label>
            </template>
        </div>
    </div>
</template>
<script>
export default {
    name:"privatechatpanel",
    data() {
        return {
            bshowchat:false,
            bshowaccess:false,
            chatmessage:"",
            elcontent:null,
            elchatarea:null,
            elchatbox:null,
            chatmessages:[],
            privatekey:"",
            displaystatusprivatekey:"?",
            publickey:"",
            displaystatuspublickey:"?",
            privaterooms:[],
            selectprivatekey:"",
            //userid:Gun.text.random(16),
            gunprivatechat:null,
            privatesharekey:"",
        }
    },
    created: function () {
        console.log("init private chat...");
    },
    mounted:function(){
        this.elcontent = document.getElementById("privatechatpanel");
        this.elchatarea = document.getElementById("chatmessages");
        this.elchatbox = document.getElementById("chatbox");
        window.addEventListener("resize", this.resize.bind(this));
        window.dispatchEvent(new Event('resize'));
        this.updateprivateroomlist();
    },
    beforeDestroy() {
        //this.gunchat.off();
        this.gunprivatechat = null;

        window.removeEventListener("resize", this.resize.bind(this));
    },
    methods: {
        initChat: async function(){
            //updateprivatechatlist();
            //CleanPrivateChatMessages();
            let privatekey = (this.privatekey || "").trim();
            if(!privatekey)return;
            this.bshowchat=true;
            console.log("init chat...");
            //Need to fail checks!
            console.log(privatekey);
            //privatechatkey = privatekey;
            let user = this.$gun.user();
            let pair = user._.sea;
            //GET ENC SHARE KEY
            let pub = await this.$gun.get(privatekey).get('info').get('pub').then();
            let title = await this.$gun.get(privatekey).get('info').get('name').then();
            if(pub == user.is.pub){
                this.bshowaccess=true;
                //$('#ppublickey').show();
                //$('#btnprivatechatgrant').show();
                //$('#btnprivatechatrevoke').show();
            }else{
                this.bshowaccess=false;
                //$('#ppublickey').hide();
                //$('#btnprivatechatgrant').hide();
                //$('#btnprivatechatrevoke').hide();
            }
            /*
            $('#btnprivatechatcreate').hide();
            $('#privatechatroom').hide();
            $('#privatechatkey').hide();
            $('#btnprivatechatjoin').hide();
            $('#btnprivatechatleave').show();
            $('#btnprivatechatadd').hide();
            $('#btnprivatechatremove').hide();
            $('#btnprivatechatname').text(title);
            */
            
            let to = this.$gun.user(pub);
            let epub = await to.get('epub').then();
            let encsharekey = await to.get('privatechatroom').get(privatekey).get('pub').get(pair.pub).then();
            console.log(encsharekey);
            //let dh = await SEA.secret(pair.epub, pair);
            let dh = await SEA.secret(epub, pair);
            let dec = await SEA.decrypt(encsharekey, dh);
            console.log(dec);
            if(dec==null){
                console.log("NULL SHARE KEY!");
                this.bshowchat=false;
                return;
            }
            this.privatesharekey = dec;
            console.log("SHARE KEY");
            console.log(this.privatesharekey);
            if(this.gunprivatechat !=null){
                //this.gunprivatechat.off();
            }
            this.gunprivatechat = this.$gun.get(privatekey);
            let currentDate = new Date();
            let year = currentDate.getFullYear();
            let month = ("0" + (currentDate.getMonth() + 1 ) ).slice(-2);
            let date = ("0" +currentDate.getDate()).slice(-2);
            let timestring = year + "/" + month + "/" + date + ":";
            let self=this;
            async function qcallback(data,key){
                console.log('incoming messages...');
                //console.log("key",key);
                //console.log("data",data);
                if(data == null)return;
                if(data.message != null){
                    let message = window.atob(data.message);
                    let decmsg = await SEA.decrypt(message,self.privatesharekey);
                    if(decmsg!=null){
                        self.chatmessages.push({
                            id: key,
                            message : data.alias + ": " + decmsg
                        });
                        self.scrollbottom();
                        /*
                        $('#privatechatlist').append($('<div/>', { 
                            id: key,
                            text : data.alias + ": " + decmsg
                        }));
                        scrollbottom();
                        */
                    }
                }
            }
            this.gunprivatechat.get('message').get({'.': {'*': timestring},'%': 50000}).map().once(qcallback);

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
        sendmessage: async function(_value){
            let msg = (_value || "").trim();
            if(!msg){
                console.log("EMPTY");
                return;
            }
            let user = this.$gun.user();
            if(!user.is){ return }//check if user exist
            //let msg = ($('#inputprivatechat').val() || '').trim();
            if(!msg) return;//check if not id empty
            let who = await user.get('alias').then();
            if(this.gunprivatechat !=null){
                let enc = await SEA.encrypt(msg, this.privatesharekey);
                enc = window.btoa(enc);//gun graph need to be string not SEA{} that will reject that is not soul of user
                this.gunprivatechat.get('message').get(this.timestamp()).put({
                    alias:who,
                    message:enc
                });
            }
            /*
            let gen = Gun.text.random(16);
            console.log(gen);
            this.gunchat.get(this.timestamp()).put({
                alias:this.userid,
                message:msg
            });
            */
            console.log("send private chat...");
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
        btnprivatechatcreate: async function(){
            console.log("btnprivatechatcreate");
            let user = this.$gun.user();// get user graph
            let pair = user._.sea;//user pair
            let genprivatechatid = Gun.text.random();//random string
            let gensharekey = Gun.text.random();//random string
            let pname = "private chat "+genprivatechatid;//id name
            let pdescription= "private chat";//id description
            let enc = await SEA.encrypt(gensharekey, pair);//encode key

            user.get('privatechatroom')
            .get(genprivatechatid).get('pri').put(enc);

            let dh = await SEA.secret(pair.epub, pair);
            enc = await SEA.encrypt(gensharekey, dh);

            user.get('privatechatroom')
            .get(genprivatechatid).get('pub').get(pair.pub).put(enc);

            user.get('privatechatroom')
            .get(genprivatechatid)
            .get('info')
            .put({
                pub:pair.pub,
                name:pname,
                description:pdescription,
                date:this.timestamp()
            });
            this.$gun.get(genprivatechatid)
                .get('info')
                .put({
                    pub:pair.pub,
                    name:pname,
                    description:pdescription,
                    date:this.timestamp()
                });
        },
        btnprivatechatjoin:function(){
            //this.bshowchat=true;
            this.initChat();
        },
        btnprivatechatleave:function(){
            console.log("leave");
            this.bshowchat=false;
            this.bshowaccess=false;
        },
        btnprivatechatadd: async function(){
            let user = this.$gun.user();
            if(!user.is)return;
            let privatekey = (this.privatekey || "").trim() ;
            if(!privatekey)return;
            let gkey = await this.$gun.get(privatekey).then();
            //console.log(gkey);
            if(gkey == undefined){
                console.log("NOT FOUND!");
                return;
            }
            let guninfo = this.$gun.get(privatekey).get('info');
            let pub = await guninfo.get('pub').then();
            let title = await guninfo.get('name').then();
            let description = await guninfo.get('description').then();
            let date = await guninfo.get('date').then();
            //console.log(pub);console.log(title);console.log(date);
            user.get('privatechatroom').get(privatekey).get('info').put({
                pub:pub,
                name: title,
                description:description,
                date:date
            });
        },
        btnprivatechatremove: async function(){
            console.log("btnprivatechatremove");
            let user = this.$gun.user();
            if(!user.is)return;
            let privatekey = (this.privatekey || "").trim();
            if(!privatekey)return;
            let gkey = await this.$gun.get(privatekey).then();
            if(gkey == undefined){
                console.log("NOT FOUND!");
                return;
            }
            user.get('privatechatroom').get(privatekey).put(null);  
        },
        updateprivateroomlist:function(){
            let user = this.$gun.user();
            let self = this;
            this.privaterooms=[];
            user.get('privatechatroom').once().map().once(function(data,key){
                if(data !=null){
                    self.addPrivateChat(key,data);
                }
            });
        },
        addPrivateChat: async function(index, data){
            let user = this.$gun.user();
            console.log("add chat room list");
            console.log(index);
            console.log(data);
            let name = await user.get('privatechatroom').get(index).get('info').get('name').then();
            this.privaterooms.push({
                value: index,
                text : name
            })
            /*
            $('#privatechatroom').append($('<option/>', { 
                //id: index,
                value: index,
                text : name
            }));
            */
        },
        btnprivatechatgrant: async function(){
            console.log("btnprivatechatgrant");
            let ppublickey = (this.publickey || "").trim();
            if(!ppublickey)return;
            let pkey = (this.privatesharekey || "").trim();
            let privatekey = (this.privatekey || "").trim();
            //check user pub key owner
            let pownid = await this.$gun.get(pkey).get('info').get('pub').then();
            //console.log(pownid);console.log(ppublickey);
            if(pownid == ppublickey){
                console.log("owner");
                return;
            }
            let user = this.$gun.user();
            let pair = user._.sea;
            let to = this.$gun.user(ppublickey);

            let who = await to.get('alias').then();
            if(!who)return;
            
            if(!pkey)return;
            //NEED TO FIX THIS
            console.log(pkey);

            let pub = await to.get('pub').then();
            let epub = await to.get('epub').then();
            let dh = await SEA.secret(epub, pair);
            let enc = await SEA.encrypt(pkey, dh);

            user.get('privatechatroom')
                .get(privatekey)
                .get('pub')
                .get(pub).put(enc);

            console.log(pkey);
            console.log("finish grant!");
        },
        btnprivatechatrevoke: async function(){
            console.log("btnprivatechatrevoke");
            let ppublickey = (this.publickey || "").trim();
            if(!ppublickey)return;
            let pkey = (this.privatekey || "").trim();
            //check user pub key owner
            let pownid = await this.$gun.get(pkey).get('info').get('pub').then();
            if(pownid == ppublickey){
                console.log("owner");
                return;
            }
            let user = this.$gun.user();
            let pair = user._.sea;
            let to = this.$gun.user(ppublickey);
            let who = await to.get('alias').then();
            if(!who)return;
            if(!pkey)return;
            //need to generate new share key
            //user.get('privatechatroom')
                //.get(pkey)
                //.get('pub').map().once(function(data,key){});

            let pub = await to.get('pub').then();
            user.get('privatechatroom')
                .get(pkey)
                .get('pub')
                .get(pub).put(null);
            console.log(pkey);
            console.log("finish revoke!");
        },
        onselectprivatekey:function(){
            console.log(this.selectprivatekey);
            this.privatekey = this.selectprivatekey;
        }

    }
}
</script>
<style>
    #privatechatpanel{
        height: 100%;
        width: 100%;
    }

    #chatmessages{
        overflow-y: scroll;
    }
</style>