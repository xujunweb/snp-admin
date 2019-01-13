<template>
  <div class="josnconfig">
    <Form ref="formInline" :model="formInline" :rules="ruleInline" inline>
      <FormItem prop="sysName">
        <span>类型：</span>
        <Select v-model="formInline.type" style="width:100px" @on-change="getAppJson">
          <Option v-for="item in typeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </FormItem>
    </Form>
    <Input v-model="jsontext" type="textarea" :rows="35" placeholder="Enter something..." style="width: 100%" />
    <div class="button" style="margin-top: 15px;">
      <Button type="primary" @click="saveAppJson">保存</Button>
    </div>

  </div>
</template>

<script>
import {getAppJson,saveAppJson} from '@/api/home'
export default {
  name: "Jsonconfig",
  data(){
    return{
      formInline:{
        type:'md'
      },
      ruleInline: {
        type: [
          // { required: true, message: 'Please fill in the password.', trigger: 'blur' },
        ]
      },
      typeList:[
        {value:'md',label:'门店'},
        {value:'pt',label:'平台'},
      ],
      jsontext:''
    }
  },
  created(){
    this.getAppJson(this.formInline.type)
  },
  methods:{
    getAppJson(type){
      getAppJson({type:type}).then((res)=>{
        if(res.data.code === '0'){
          this.jsontext = res.data.data
        }
      })
    },
    //保存配置
    saveAppJson(){
      saveAppJson({type:this.formInline.type,appJson:this.jsontext}).then((res)=>{
        if(res.data.code === '0'){
          this.$Message.success('操作成功!')
          // this.jsontext = res.data.data
        }else {
          this.$Message.error(res.data.msg)
        }
      }).catch(()=>{
        this.$Message.error('服务异常')
      })
    }
  }
}
</script>

<style scoped lang="less">
.josnconfig{
  padding: 20px;
}
</style>
