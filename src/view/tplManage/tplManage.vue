<template>
  <div class="tplManage">
    <div class="top">

    </div>
    <div class="table">
      <h3>草稿箱列表</h3>
      <Table border :columns="draftBoxList" :data="draftBoxListData" stripe ref="userTable"></Table>
    </div>
    <div class="table">
      <h3>微信模板库</h3>
      <Table border :columns="weChatTemplateLibrary" :data="weChatTemplateLibraryData" stripe ref="userTable"></Table>
    </div>
    <div class="table">
      <h3>本地模板库</h3>
      <Table border :columns="localTemplateLibrary" :data="localTemplateLibraryData" stripe ref="userTable"></Table>
    </div>
    <Modal v-model="showEdit"
           title="同步操作"
           width="300"
           :loading="loading"
           @on-ok="syncToLocalTemplate">
      <div class="modal-content">
        <Form ref="formInline" :model="formInline" :rules="ruleInline">
          <FormItem prop="sysName">
            <span class="label">模板类型：</span>
            <Select v-model="formInline.type" style="width:200px">
              <Option v-for="item in typeList" :value="item.value" :key="item.value">{{ item.label}}</Option>
            </Select>
          </FormItem>
        </Form>
      </div>
    </Modal>
  </div>
</template>

<script>
  import draftBoxList from './draftBoxList'
  import localTemplateLibrary from './localTemplateLibrary'
  import weChatTemplateLibrary from './weChatTemplateLibrary'
  import * as http from '@/api/tplManage'
  import * as deploy from '@/api/deploy'
  export default {
    name: "tplManage",
    data(){
      return{
        draftBoxList:draftBoxList(this),
        localTemplateLibrary:localTemplateLibrary(this),
        weChatTemplateLibrary:weChatTemplateLibrary(this),
        draftBoxListData:[],
        weChatTemplateLibraryData:[],
        localTemplateLibraryData:[],
        typeList:[
          {value:'2',label:'平台'},
          {value:'3',label:'门店'},
          {value:'4',label:'微电商'},
          {value:'5',label:'商城'},
        ],
        formInline:{
          type:'',
        },
        loading:true,
        ruleInline: {
          type: [
            // { required: true, message: 'Please fill in the password.', trigger: 'blur' },
          ]
        },
        showEdit:false, //同步操作弹窗
        itemData:null,  //同步操作时选中的列表项
        itemIndex:'',   //同步操作时选中的列表项索引
      }
    },
    created(){
      this.getDraftTemplateList()
      this.getWeixinTemplateList()
      this.getLocalTemplateList()
    },
    methods:{
      getDraftTemplateList(){
        http.getDraftTemplateList().then((res)=>{
          console.log('草稿箱-----',res)
          if(res.data.code === '0'){
            this.draftBoxListData = res.data.data
          }
        })
      },
      getWeixinTemplateList(){
        http.getWeixinTemplateList().then((res)=>{
          console.log('微信模板库-----',res)
          if(res.data.code === '0'){
            var arry = res.data.data.map((item)=>{
              item.isSync = item.isSync
              return item
            })
            this.weChatTemplateLibraryData = arry
          }
        })
      },
      getLocalTemplateList(){
        http.getLocalTemplateList().then((res)=>{
          console.log('本地模板库-----',res)
          if(res.data.code === '0'){
            this.localTemplateLibraryData = res.data.data
          }
        })
      },
      /**
       * 执行按钮操作(除同步操作)
       * @name {string} 事件名
       * @param {obj}   请求的传参
       * @item  {obj}   选中项的信息
       * @refresh {boolean} 是否要刷新对应列表(一键功能时不刷新)
       * */
      executeButton(name,params,item,refresh){
        return http[name](params).then((res)=>{
          if(res.data.code==='0' || res.data.code==='ok'){
            this.$Modal.remove()
            switch (name) {
              case 'addToTemplate':
                //添加模板库
                !refresh&&this.getWeixinTemplateList()
                break
              case 'deleteTemplate':
                //删除正式模板
                this.weChatTemplateLibraryData.splice(item.index,1)
                break
              case 'setDefault':
                //设置默认成功，将对于索引的元素的默认值更改为2
                if(!refresh){
                  this.localTemplateLibraryData[item.index].isDefault = 2
                  this.getLocalTemplateList()
                  this.getWeixinTemplateList()
                }
                break
              case 'deleteLocalTemplate':
                //删除本地模板
                this.localTemplateLibraryData.splice(item.index,1)
                break
              default:
            }
          }else {
            this.$Message.error(res.data.msg)
          }
        })
      },
      /**
       * 同步
       * @itemData {obj}  一键时需要的模板信息
       * @type  {num} 一键时需要的同步类型
       */
      syncToLocalTemplate(itemData,type){
        var postData = null
        if(itemData){
          postData = {...itemData}
        }else {
          postData = {...this.itemData}
        }
        if(!this.formInline.type){
          this.$Message.error('请选择类型')
          setTimeout(() => {
            this.loading = false
            this.$nextTick(() => {
              this.loading = true
            })
          }, 1000)
          return
        }
        var data = {
          "developerUsername": postData.developer,
          // "images": this.itemData.developer,
          // "isDefault": this.itemData.developer,
          "sourceAppId": postData.source_miniprogram_appid,
          "sourceName": postData.source_miniprogram,
          "templateId": postData.template_id,
          "type":type||this.formInline.type,
          "userDesc": postData.user_desc,
          "userVersion": postData.user_version
        }
        return http.syncToLocalTemplate(data).then((res)=>{
          if(res.data.code === '0'){
            if(!type){   //一键时不需要刷新数据
              this.showEdit = false
              this.weChatTemplateLibraryData[this.itemIndex].isSync = true
              this.getLocalTemplateList()
            }
          }else {
            this.$Message.error(res.data.msg)
          }
        })
      },
      //一键平台
      onePt(name,params,item){
        this.$Spin.show()
        //添加模板
        this.executeButton(name,params,item,true).then((res)=>{
          //同步
          this.syncToLocalTemplate(res.data.data,2).then((res)=>{
            //设置默认
            this.executeButton('setDefault',{
              templateId:res.data.data.id,
              type:res.data.data.type,
            },item,true).then((res)=>{
              if(res.data.code === '0'){
                //刷新其他两个列表
                this.getLocalTemplateList()
                this.getWeixinTemplateList()
                this.$Spin.hide()
              }
            })
          })
        })
      },
      //一键部署
      oneDeploy(type){
        //请求部署列表
        deploy.selectBatDeployData({sysName:type}).then(res => {
          console.log('小程序列表----',res)
          if(res.data.code === '0'){
            var appIds = res.data.data.map((item)=>{
              return item.id
            })
            deploy.deploy({appIds:[...appIds]}).then((res)=>{
              console.log('部署结果-----',res)
              if(res.data.data){

              }
            })
          }
        }).catch(err => {
          console.log(err)
        })
      },
    }
  }
</script>

<style scoped lang="less">
  .tplManage{
    padding: 0px 15px 40px 15px;
    .table{
      h3{font-size: 16px;font-weight: bold;line-height: 40px;border-bottom: 1px solid #ccc;margin-bottom: 20px;margin-top: 20px;}
    }
    .top{
      display: flex;justify-content: space-between;
      .table{
        width: 48%;
      }
    }
  }
</style>
