<template>
    <div>
        <select v-model="selectuser" v-on:change="onselectuser">
            <option value="" selected="selected" disabled > - Select Alias (test purpose) - </option>
            <option v-for="item in aliascontacts" :key="item.name">{{item.name}}</option>
        </select>
        <table>
            <tr>
                <td>User:</td>
                <td><input v-model="username"></td>
            </tr>
            <tr>
                <td>Password:</td>
                <td><input v-model="passphrase"></td>
            </tr><tr>
                <td style="text-align: center;" colspan="2">
                    <button v-on:click="clickRegister">Register</button>
                    <button v-on:click="clickLogin">Login</button>
                    <button v-on:click="clickForgot">Forgot</button>
                </td>
            </tr>
        </table>
    </div>
</template>
<script>
export default {
    data() {
        return {
            username:"test",
            passphrase:"test",
            selectuser:"",
            aliascontacts:[],
        }
    },
    mounted:function(){
        this.aliascontacts.push({name:"beta",passphrase:"test"});
        this.aliascontacts.push({name:"alpha",passphrase:"test"});
        this.aliascontacts.push({name:"test",passphrase:"test"});
    },
    methods: {
        clickLogin(){
            console.log("login...");
            //console.log(this.username);
            console.log(this.$gun);
            var user = this.$gun.user();
            var self = this;

            user.auth(this.username, this.passphrase,(ack)=>{
                //console.log(ack);
                if(ack.err){
                    console.log("fail!");
                    //self.$toast.open({
                        //message: 'Auth attempt failed!',
                        //type: 'is-danger'
                    //});
                }else{
                    console.log("Authorized!");
                    //self.$parent.$emit('view','index');
                    self.$parent.$emit('action','loginpass');
                    //self.$toast.open({
                        //message: 'Authorized!',
                        //type: 'is-success'
                    //});
                    //bus.$emit('login');
                    //bus.$emit('action','hidelogin');
                }
            });
        },
        clickRegister(){
            //this.$parent.$emit('view','register');
            //console.log("register");
            var user = this.$gun.user();
            user.create(this.username, this.passphrase, function(ack){
                //console.log(ack);
                if(ack.err){
                    console.log("fail!");
                    //self.$toast.open({
                        //message:ack.err ,
                        //type: 'is-danger'
                    //});
                }
                if(ack.pub){
                    console.log("created!", ack.pub);
                    //self.$toast.open({
                        //message: 'Alias Created: ' + params.username +'!',
                        //type: 'is-success'
                    //});
                }
            });
        },
        clickForgot(){
            this.$parent.$emit('action','accessforgot');
        },
        onselectuser:function(){
            console.log(this.selectuser);
            for(let i = 0;i < this.aliascontacts.length;i++){
                if(this.aliascontacts[i].name == this.selectuser){
                    this.username = this.aliascontacts[i].name;
                    this.passphrase = this.aliascontacts[i].passphrase;
                }
            }
        }
    }
}
</script>