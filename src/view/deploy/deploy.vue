<template>
  <div class="deploy">
    <div class="search-div">
      <Form ref="formInline" :model="formInline" :rules="ruleInline" inline>
        <FormItem prop="nickName">
          <span class="title">昵称：</span>
          <Input v-model="formInline.nickName" placeholder="请输入昵称" clearable style="width: 200px" />
        </FormItem>
        <FormItem prop="templateId">
          <span class="title">模板ID：</span>
          <Input v-model="formInline.templateId" placeholder="请输入模板ID" clearable style="width: 200px" />
        </FormItem>
        <FormItem prop="principalName">
          <span class="title">主体名称：</span>
          <Input v-model="formInline.principalName" placeholder="请输入主体名称" clearable style="width: 200px" />
        </FormItem>
        <FormItem prop="userVersion">
          <span class="title">版本：</span>
          <Select v-model="formInline.userVersion" style="width:200px">
            <Option v-for="item in versionList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem prop="enableAutoAudit">
          <span class="title">自动提审：</span>
          <Select v-model="formInline.enableAutoAudit" style="width:200px">
            <Option v-for="item in statusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem prop="sysName">
          <span class="title">系统名：</span>
          <Select v-model="formInline.sysName" style="width:200px">
            <Option v-for="item in typeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="handleSubmit('formInline')">搜索</Button>
          <Button @click="handleReset('formInline')" style="margin-left: 8px">清除条件</Button>
          <Button @click="deploy" type="primary" style="margin-left: 8px">部署选中项</Button>
          <Button @click="isShowLog = true" type="primary">打开日志</Button>
        </FormItem>
      </Form>
    </div>
    <div class="table">
      <div class="left">
        <Table border :columns="columns" :data="tableData" stripe ref="tableData" @on-selection-change="seletcOpiton"></Table>
      </div>
      <!--<div class="right">-->
        <!--<Table border :columns="logColumns" :data="logData" stripe ref="logData"></Table>-->
      <!--</div>-->
    </div>
    <div>
      <Drawer
        title="部署日志"
        v-model="isShowLog"
        width="75%"
        :mask-closable="false"
        :styles="styles"
      >
        <div>
          <Timeline>
            <TimelineItem v-for="log in logData" :color="log.deployStatus==1?'red':'green'">
              <p class="log-title">{{log.deployTime}}-{{log.deployType}}-{{log.appId}}-{{log.appName}}</p>
              <p class="log-content">{{log.deployInfo}}</p>
            </TimelineItem>
          </Timeline>
        </div>
        <div class="log-drawer-footer">
          <Button style="margin-right: 8px" @click="isShowLog = false">收起</Button>
        </div>
      </Drawer>
    </div>
    <!--<div class="page">-->
      <!--<Page :total="total" show-total show-elevator :page-size="pageSize" @on-change="pageSwitch" />-->
    <!--</div>-->
    <reviseConfig :xcxData="xcxInfo" v-if="reviseConfig.show" />
    <submitCode :xcxData="xcxInfo" v-if="submitCode.show" />
    <submitAudit :xcxData="xcxInfo" v-if="submitAudit.show" />
    <modifyComp :xcxData="xcxInfo" v-if="modifyComp.show" />
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import * as http from '@/api/deploy'
  import reviseConfig from '../components/operation/reviseConfig.vue'
  import submitCode from '../components/operation/submitCode.vue'
  import submitAudit from '../components/operation/submitAudit.vue'
  import modifyComp from '../components/operation/modifyComp.vue'
  //表单选项
  import columns from './notDeployData'
  import logColumns from './logData'
  export default {
    name: "deploy",
    components:{
      reviseConfig,submitCode,submitAudit,modifyComp
    },
    computed: {
      ...mapGetters({
        'xcxInfo':'getxcxInfo',
        'reviseConfig':'getreviseConfig',
        'submitCode':'getsubmitCode',
        'submitAudit':'getsubmitAudit',
        'modifyComp':'getmodifyComp',
      })
    },
    data(){
      return{
        formInline: {
          templateId:'',
          nickName:'',
          principalName:'',   //主体名称
          sysName:'',       //所属
          enableAutoAudit:'',   //审核状态
          userVersion:'',   //版本
        },
        ruleInline: {
          principalName: [
            // { required: true, message: 'Please fill in the password.', trigger: 'blur' },
          ]
        },
        versionList:[{value:'',label:'全部'}, {value:'1',label:'体验版'}, {value:'2',label:'审核版'}, {value:'3',label:'正式版'},],
        statusList:[{value:'',label:'全部'}, {value:'2',label:'开启'}, {value:'1',label:'关闭'},],
        statusMap:{'2':'开启', '1':'关闭',},
        auditStatusMap:{
          '-1':'未提审',
          '0':'审核成功',
          '1':'审核失败',
          '2':'审核中',
        },
        typeList:[{value:'',label:'全部'}, {value:'smp',label:'门店小程序'}, {value:'amp',label:'平台小程序'},],
        deployStatusMap:{'1':'部署失败', "2":'部署成功'},
        deployTypeMap:{'1':'类型1','2':'类型2'},
        columns:columns(this),
        logColumns:logColumns(this),
        tableData:[],
        logData:[],
        appIds:[],  //已选项的appids数组
        setInt:null,  //定时器储存对象
        isShowLog:false,
        styles: {
          height: 'calc(100% - 55px)',
          overflow: 'auto',
          paddingBottom: '53px',
          position: 'static'
        },
      }
    },
    created(){
      // this.getXcxList()
    },
    beforeDestroy(){
      if(this.setInt){
        clearInterval(this.setInt)
      }
      console.log('组件销毁----------')
    },
    methods:{
      //选择选项
      seletcOpiton(e){
        this.appIds = e.map((item)=>{
          return item.authorizerAppId
        })
      },
      /**
       * 请求小程序列表
       * */
      getXcxList () {
        return new Promise((resolve, reject)=>{
          http.selectBatDeployData({...this.formInline}).then(res => {
            console.log('小程序列表----',res)
            if(res.data.code === '0'){
              this.tableData = res.data.data
              // this.total = res.data.data.allRecord
              resolve(res.data)
            }else {
              reject(res.data)
            }
          }).catch(err => {
            console.log(err)
            reject(err)
          })
        })
      },
      // 发起搜索
      handleSubmit (name) {
        //表单校验
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.getXcxList(1).then((res)=>{
              this.$Message.success('操作成功!')
            }).catch(err => {
              this.$Message.error('操作失败!')
            })
          } else {
            this.$Message.error('Fail!')
          }
        })
      },
      //批量部署
      deploy(){
        if(!this.appIds || !this.appIds.length){
          this.$Message.error('请至少选择一个小程序部署')
          return
        }
        http.deploy({appIds:[...this.appIds]}).then((res)=>{
          this.isShowLog = true;
          console.log('部署结果-----',res)
          if(res.data.data){
            this.deployLog(res.data.data)
            this.setInt = setInterval(()=>{
              this.deployLog(res.data.data)
            },1000)
          }
        })
      },
      //部署日志
      deployLog(deployId){
        http.getDeployLog({deployId:deployId}).then((res)=>{
          console.log('部署日志---------',res)
          if(res.data.data && res.data.data.length){
            this.logData = [...this.logData,...res.data.data]
          }
        })
      },
      handleReset (name) {
        this.$refs[name].resetFields()
      },
    },
  }
</script>

<style scoped lang="less">
  .deploy{
    padding: 15px;
  }
  .page{
    text-align: right;
    margin-top: 40px;
  }
  .search-div{
    margin-top: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
    .ivu-form-item{
      margin-bottom: 10px;margin-right: 10px;
      span.title{
        display: inline-block;width: 65px;text-align: right;
      }
      .ivu-btn-primary{
        margin-left: 65px;
      }
    }
  }
  .table{
    display: flex;
    justify-content: space-between;
    .left{width: 100%;}
    .right{width: 48%;}
  }
  .log-drawer-footer{
    width: 100%;
    position: absolute;
    bottom: 0;
    left: 0;
    border-top: 1px solid #e8e8e8;
    padding: 10px 16px;
    text-align: right;
    background: #fff;
  }
  .log-title{
    font-size: 14px;
    font-weight: bold;
  }
  .log-content{
    padding-left: 5px;
  }
</style>
