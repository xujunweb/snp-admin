<template>
  <div>
    <Modal
      v-model="showEdit.show"
      title="提交审核"
      width="806"
      :loading="loading"
      @on-ok="updateConfig"
      @on-cancel="cancel">
      <div class="modal-content">
        <!--<h3>服务器域名需经过ICP备案，新备案域名需24小时后才可配置。域名格式只支持英文大小写字母、数字及“- ”，不支持IP地址</h3>-->
        <Form ref="formInline" :model="formInline" :rules="ruleInline">
          <FormItem prop="sysName">
            <span>页面：</span>
            <Select v-model="formInline.templateId" style="width:500px">
              <Option v-for="(item,index) in typeList" :value="item" :key="index">{{ item }}</Option>
            </Select>
          </FormItem>
          <FormItem prop="title">
            <span>标题：</span>
            <Input v-model="formInline.title" placeholder="请输入标题" clearable style="width: 300px" />
          </FormItem>
          <FormItem prop="tag">
            <span>标签：</span>
            <Input v-model="formInline.tag" placeholder="请输入标签" clearable style="width: 300px" />
          </FormItem>
          <FormItem prop="category">
            <span>类目：</span>
            <Cascader :data="categoryList" v-model="formInline.category" style="width: 300px;float: left"></Cascader>
          </FormItem>
        </Form>
      </div>
    </Modal>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import {getXcxPages,submitAudit,getCategory} from '@/api/home'
export default {
  name: "submitAudit",
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
        tag:'',  //标签
        title:'',  //标题
        category:[],
      },
      ruleInline: {
        title: [
          // { required: true, message: 'Please fill in the password.', trigger: 'blur' },
        ]
      },
      typeList:[],
      loading:true,
      categoryList:[],
    }
  },
  computed:{
    ...mapGetters({
      'showEdit':'getsubmitAudit'
    })
  },
  created(){
    getXcxPages({authorizerAppId:this.xcxData.authorizerAppId}).then((res)=>{
      console.log('pages----',res)
      if(res.data.code === '0'){
        this.typeList = res.data.data
      }
    })
    getCategory({authorizerAppId:this.xcxData.authorizerAppId}).then((res)=>{
      console.log('类目----',res)
      if(res.data.code === '0'){
        this.categoryList = res.data.data
      }
    })
  },
  methods:{
    //提交修改
    updateConfig(){
      if(!this.formInline.templateId){
        this.$Message.error('请选择页面')
        setTimeout(() => {
          this.loading = false
          this.$nextTick(() => {
            this.loading = true
          })
        }, 1000)
        return
      }
      if(!this.formInline.title){
        this.$Message.error('请输入标题')
        setTimeout(() => {
          this.loading = false
          this.$nextTick(() => {
            this.loading = true
          })
        }, 1000)
        return
      }
      if(!this.formInline.tag){
        this.$Message.error('请输入标签')
        setTimeout(() => {
          this.loading = false
          this.$nextTick(() => {
            this.loading = true
          })
        }, 1000)
        return
      }
      if(this.formInline.category.length < 2){
        this.$Message.error('请选择类目')
        setTimeout(() => {
          this.loading = false
          this.$nextTick(() => {
            this.loading = true
          })
        }, 1000)
        return
      }
      var data = {
        address:this.formInline.templateId,
        authorizerAppId:this.xcxData.authorizerAppId,
        templateId:this.formInline.templateId,
        tag:this.formInline.tag,
        title:this.formInline.title,
        firstClass:this.formInline.category[0]||'',
        secondClass:this.formInline.category[1]||'',
        thirdClass:this.formInline.category[2]||'',
      }
      submitAudit(data).then((res)=>{
        console.log('提交审核信息--------',res)
        if(res.data.code === '0'){
          this.$Message.success('操作成功!')
          this.$store.dispatch('updataPopup',{name:'submitAudit',res:false})
        }else{
          this.$Message.error('操作失败!'+res.data.msg)
          this.$store.dispatch('updataPopup',{name:'submitAudit',res:false})
        }
      }).catch(err => {
        this.$store.dispatch('updataPopup',{name:'submitAudit',res:false})
        this.$Message.error('操作失败!')
      })
    },
    //关闭弹窗
    cancel(){
      console.log('关闭了')
      this.$store.dispatch('updataPopup',{name:'submitAudit',res:false})
    },
  }
}
</script>

<style scoped lang="less">
  .modal-content{
    padding-left: 20px;
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
