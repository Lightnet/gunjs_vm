<template>
    <div>
        <table>
            <tr>
                <td>
                    <label> Alias: </label>
                </td>
                <td>
                    <input v-model="alias" /> 
                </td>
            </tr>
            <tr>
                <td>
                    <label> Question #1: </label>
                </td>
                <td>
                    <input v-model="question1" /> 
                </td>
            </tr>
            <tr>
                <td>
                    <label> Question #2: </label>
                </td>
                <td>
                    <input v-model="question2" /> 
                </td>
            </tr>
            <tr>
                <td>
                    <label> Hint:</label>
                </td>
                <td>
                    <input v-model="hint"/>
                </td>
            </tr>
            <tr>
                <td colspan="2">
                    <center>
                    <button v-on:click="clickSubmit">Get Hint</button>
                    <button v-on:click="clickCancel">Cancel</button>
                    </center>
                </td>
            </tr>
        </table>
    </div>
</template>
<script>
export default {
    data() {
        return {
            alias:"",
            question1:"",
            question2:"",
            hint:'',
        }
    },
    methods: {
        clickCancel:function(){
            this.$parent.$emit('action','accesslogin');
        },
        async clickSubmit(){
            console.log("login...");
            console.log(this.alias);
            console.log(this.$gun);
            let gun = this.$gun;
            
            let alias = (this.alias || '').trim(); //get alias input
            let q1 =  (this.question1 || '').trim(); //get q1 input
            let q2 = (this.question2 || '').trim(); //get q2 input
            //console.log('get forgot hint');
            if(!alias){
                console.log('Empty!');
                return;
            }
            if((!q1)||(!q2)){
                console.log('Q Empty!');
                return;
            }
            console.log("alias >>> ");
            console.log(alias);
            let who = await gun.get('~@'+alias).then() || {};//get alias data
            console.log("who >>> ");
            console.log(who);
            if(!who){
                console.log("Error!");
                return;
            }
            //if(!who._){
                //console.log(who);
                //console.log('Not Alias!');
                //return;
            //}
            let hint = await gun.get('~@'+alias).map().get('hint').then();//get hash hint string
            console.log(hint);
            let dec = await Gun.SEA.work(q1,q2);//get q1 and q2 string to key hash
            hint = await Gun.SEA.decrypt(hint,dec);//get hint and key decrypt message
            if(hint){//check if hint is string or null
                //$('#hint').val(hint);//get hint and set input value
                this.hint = hint;
            }else{
                //$('#hint').val('Fail Decrypt!');//if null set input to message user.
                this.hint = 'Fail Decrypt!';
            }
            
            console.log("end checked...");
        },
    }
}
</script>