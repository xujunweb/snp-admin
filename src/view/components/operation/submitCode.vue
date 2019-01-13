<template>
  <div>
    <Modal
      v-model="showEdit.show"
      title="提交代码"
      width="1000"
      :loading="loading"
      @on-ok="updateConfig"
      @on-cancel="cancel">
      <div class="modal-content">
        <!--<h3>服务器域名需经过ICP备案，新备案域名需24小时后才可配置。域名格式只支持英文大小写字母、数字及“- ”，不支持IP地址</h3>-->
        <Form ref="formInline" :model="formInline" :rules="ruleInline">
          <FormItem prop="sysName">
            <span>操作：</span>
            <Select v-model="formInline.templateId" style="width:500px" placeholder="一般情况下选中默认值" @on-change="selectTemplate(formInline.templateId)">
              <Option v-for="item in typeList" :value="item.templateId" :key="item.templateId">{{ item.id+' / '+item.userVersion+' / '+item.userDesc+' / ' }}{{item.isDefault|isDefault}}</Option>
            </Select>
          </FormItem>
          <FormItem prop="userVersion">
            <span>版本号：</span>
            <Input v-model="formInline.userVersion" placeholder="请输入版本号" clearable style="width: 200px" />
          </FormItem>
          <FormItem prop="userDesc">
            <span>描述：</span>
            <Input v-model="formInline.userDesc" placeholder="请输入描述" clearable style="width: 200px" />
          </FormItem>
          <FormItem prop="extJson" v-if="access[0] === 1">
            <span>定制参数：</span>
            <Input v-model="formInline.extJson" type="textarea" :rows="24" placeholder="请输入ext配置" style="width: 860px" />
          </FormItem>
        </Form>
      </div>
    </Modal>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import {commitCode,getExtJson,getTemplateListByType} from '@/api/home'
import { Notice } from 'iview'
export default {
  name: "submitCode",
  props:{
    xcxData:{
      type:Object,
      default () {return {}}
    }
  },
  data(){
    return{
      formInline:{
        extJson:'',       //ext配置
        templateId:'',    //模板ID
        userDesc:'',  //描述
        userVersion:''  //版本号
      },
      ruleInline: {
        userDesc: [
          // { required: true, message: 'Please fill in the password.', trigger: 'blur' },
        ]
      },
      typeList:[],
      loading:true,
      access:app.$store.state.user.access
    }
  },
  computed:{
    ...mapGetters({
      'showEdit':'getsubmitCode'
    })
  },
  created(){
    getExtJson({authorizerAppId:this.xcxData.authorizerAppId}).then((res)=>{
      console.log('ext----',res)
      if(res.data.code === '0'){
        this.formInline.extJson = res.data.data.extJson
      }
    })
    getTemplateListByType({type:this.xcxData.templateType}).then((res)=>{
      console.log('ext----',res)
      if(res.data.code === '0'){
        this.typeList = res.data.data
      }
    })
  },
  methods:{
    //提交修改
    updateConfig(){
      if(!this.formInline.templateId){
        this.$Message.error('请选择模板')
        setTimeout(() => {
          this.loading = false
          this.$nextTick(() => {
            this.loading = true
          })
        }, 1000)
        return
      }
      var data = {
        extJson:this.formInline.extJson,
        authorizerAppId:this.xcxData.authorizerAppId,
        templateId:this.formInline.templateId,
        userDesc:this.formInline.userDesc,
        userVersion:this.formInline.userVersion,
      }
      commitCode(data).then((res)=>{
        console.log('编辑域名信息--------',res)
        if(res.data.code === '0'){
          this.$Message.success('操作成功!')
          this.$store.dispatch('updataPopup',{name:'submitCode',res:false})
        }else {
          Notice.error({
            title:'操作失败',
            desc: res.data.msg
          });
          this.loading = false
        }
      }).catch(err => {
        this.$store.dispatch('updataPopup',{name:'submitCode',res:false})
        this.$Message.error('操作失败!')
      })
    },
    //关闭弹窗
    cancel(){
      console.log('关闭了')
      this.$store.dispatch('updataPopup',{name:'submitCode',res:false})
    },
    selectTemplate(templateId){
      this.formInline.userVersion = this.typeList.find((item)=>(item.templateId===templateId)).userVersion;
      this.formInline.userDesc = this.typeList.find((item)=>(item.templateId===templateId)).userDesc;
    },
  }
}
</script>

<style scoped lang="less">
  .modal-content{

    overflow-y: auto;padding-left: 20px;
    h3{font-weight: normal;color: #999;margin-bottom: 20px;padding-right: 20px;}
    .ivu-form-item{
      margin-bottom: 15px;
    }
    .ivu-form-item-content{
      span{display: inline-block;width: 65px;float: left;}
    }
  }
  /*滚动条样式*/
  .modal-content::-webkit-scrollbar {/*滚动条整体样式*/
    width: 4px;     /*高宽分别对应横竖滚动条的尺寸*/
    height: 4px;
  }
  .modal-content::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
    border-radius: 5px;
    -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
    background: rgba(0,0,0,0.2);
  }
  .modal-content::-webkit-scrollbar-track {/*滚动条里面轨道*/
    -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
    border-radius: 0;
    background: rgba(0,0,0,0.1);
  }
</style>
