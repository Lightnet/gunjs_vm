<template>
    <div>
        Contacts
        <select v-model="selectcontact" v-on:change="onselectuser">
            <option value="" selected="selected" > - Select Alias Key - </option>
            <option v-for="item in contacts" :key="item.value" > {{item.text}} </option>
        </select>

        <input v-model="publickey" v-on:keydown="onchangepubkey" />

        <button v-on:click="btnadduser">+</button>
        <button v-on:click="btnremoveuser">-</button>
        <label>Who: {{currentstatus}}</label>
    </div>
</template>
<script>

export default {
    data() {
        return {
            contacts:[],
            selectcontact:"",
            publickey:"", //public key
            currentstatus:"?",
        }
    },
    watch: {
        publickey:function(val, oldVal) {
            console.log("change...");
            this.onchangepubkey();
        }
    },
    mounted:function(){
        this.updateContacts();
    },
    methods: {
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
            //console.log("...");
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
                this.chatmessages=[];
            }
            //console.log(who);
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
        onselectuser:function(){
            console.log("selected",this.selectcontact);
            for(let i = 0; i < this.contacts.length;i++){
                if(this.contacts[i].text == this.selectcontact){
                    this.publickey = this.contacts[i].value;
                    console.log(this.publickey);
                    break;
                }
            }
        },
    }
}
</script>