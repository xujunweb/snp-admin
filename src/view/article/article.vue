<template>
  <div class="userlist">
    <div class="search-div">
      <Form ref="formInline" :model="formInline" :rules="ruleInline" inline>
        <FormItem prop="nickName">
          <span class="title">昵称：</span>
          <Input v-model="formInline.nickName" placeholder="请输入昵称" clearable style="width: 200px" />
        </FormItem>
        <FormItem prop="status">
          <span class="title">审核状态：</span>
          <Select v-model="formInline.status" style="width:200px">
            <Option v-for="item in statusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem prop="type">
          <span class="title">文章类型：</span>
          <Select v-model="formInline.article_type" style="width:200px">
            <Option v-for="item in typeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="handleSubmit('formInline')">搜索</Button>
          <Button @click="handleReset('formInline')" style="margin-left: 8px">清除条件</Button>
          <Button type="primary" @click="deploy()">批量修改审核状态</Button>
        </FormItem>
      </Form>
    </div>
    <Table border :columns="columns" :data="tableData" stripe ref="userTable" @on-selection-change="seletcOpiton"></Table>
    <div class="page">
      <Page :total="total" show-total show-elevator :page-size="pageSize" :current="thisPage" @on-change="pageSwitch" />
    </div>
    <Modal v-model="showEdit"
           title="编辑审核结果"
           width="300"
           :loading="loading"
           @on-ok="syncToLocalTemplate">
      <div class="modal-content">
        <Form ref="statusLine" :model="statusLine" :rules="ruleInline">
          <FormItem prop="sysName">
            <span class="label">编辑状态：</span>
            <Select v-model="statusLine.status" style="width:200px">
              <Option v-for="item in statusListTwo" :value="item.value" :key="item.value">{{ item.label}}</Option>
            </Select>
          </FormItem>
        </Form>
      </div>
    </Modal>
    <Drawer
      title="文章详情"
      v-model="isShowLog"
      width="85%"
      :mask-closable="false"
    >
      <div v-if="artInfo" class="plugManage">
        <Button type="primary" @click="showEdit=true">编辑审核状态</Button>
        <div class="item">
          <div class="left">用户头像</div>
          <div class="right">
            <img :src="artInfo.user.avatar"/>
          </div>
        </div>
        <div class="item">
          <div class="left">用户昵称</div>
          <div class="right">{{artInfo.user.nickname}}</div>
        </div>
        <div class="item">
          <div class="left">用户身份</div>
          <div class="right">{{userMap[artInfo.user.type]}}</div>
        </div>
        <div class="item">
          <div class="left">审核状态</div>
          <div class="right">{{statusMap[artInfo.status]}}</div>
        </div>
        <div class="item">
          <div class="left">文章标题</div>
          <div class="right">{{artInfo.title}}</div>
        </div>
        <div class="item">
          <div class="left">文章内容</div>
          <div class="right">{{artInfo.content}}</div>
        </div>
        <div class="item">
          <div class="left">文章所附文件</div>
          <div class="right" v-if="artInfo.type=='0'">
            <Poptip placement="bottom" v-for="img in artInfo.img_urls.split(',')">
              <img :src="img" style="width: 150px;cursor: pointer;"/>
              <img :src="img" style="max-width:400px" slot="content"/>
            </Poptip>
          </div>
          <div class="right" v-if="artInfo.type=='1'">
            {{artInfo.img_urls}}
          </div>
        </div>
      </div>
      <div class="log-drawer-footer">
        <Button style="margin-right: 8px" @click="isShowLog = false">收起</Button>
      </div>
    </Drawer>
  </div>
</template>

<script>
  import { getXcxList,updateArticle } from '@/api/home'
  import * as mapType from './mapType'
  import {mapGetters} from 'vuex'
  //表单选项
  import tableData from './tableData'
  export default {
    name: 'article',
    components: {
    },
    data () {
      return {
        artInfo:null,
        isShowLog:false,
        total:0,
        formInline: {
          status:'',  //审核状态
          article_type:'',     //文章类型
          title:'',   //文章标题
          category:'',       //文章分类
        },
        statusLine:{
          status:'',  //审核状态
        },
        pageSize: 20,
        thisPage:1,   //当前页
        ruleInline: {
          title: [
          ]
        },
        statusList:[
          {value:'',label:'全部'},
          {value:'0',label:'待审核'},
          {value:'1',label:'审核通过'},
          {value:'2',label:'审核不通过'},
        ],
        statusListTwo:[
          {value:'0',label:'待审核'},
          {value:'1',label:'审核通过'},
          {value:'2',label:'审核不通过'},
        ],
        userMap:mapType.userMap,
        statusMap:mapType.statusMap,
        classMap:mapType.classMap,
        typeMap:mapType.typeMap,
        typeList:[
          {value:'',label:'全部'},
          {value:'0',label:'资讯'},
          {value:'1',label:'视频'},
          {value:'2',label:'朋友圈'},
          {value:'3',label:'解答'},
        ],
        columns: tableData(this),
        tableData: [],
        access:app.$store.state.user.access,
        loading:false,
        showEdit:false,
        isAll:false,  //批量审核状态
        appIds:null,  //批量id
      }
    },
    computed: {
    },
    created () {
      // if(this.access[0]===0){
      //   console.log("this.access",this.access);
      //   this.$router.push({
      //     name: 'login'
      //   })
      //   return;
      // }
      // 组件实例化生命周期
      this.getXcxList(1).catch((data)=>{
        this.$Message.error(data.msg)
      })
    },
    methods: {
      //选择选项
      seletcOpiton(e){
        this.appIds = e.map((item)=>{
          return item.id
        })
      },
      /**
       * 请求文章列表
       * @param {type} p 查询的页码(不传的时候搜索当前分页)
       * */
      getXcxList (p) {
        return new Promise((resolve, reject)=>{
          getXcxList({pageNum: p||this.thisPage, pageSize: this.pageSize, ...this.formInline}).then(res => {
            console.log('文章列表----',res)
            if(res.data.code === 100){
              this.tableData = res.data.data.list
              this.total = res.data.data.total
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
            this.thisPage=1;
            this.getXcxList(this.thisPage).then((res)=>{
              this.$Message.success('操作成功!')
            }).catch(err => {
              this.$Message.error('操作失败!')
            })
          } else {
            this.$Message.error('Fail!')
          }
        })
      },
      /**
       * 修改审核状态
       * @itemData {obj}  一键时需要的模板信息
       * @type  {num} 一键时需要的同步类型
       */
      syncToLocalTemplate(){
        var data = null
        if(this.isAll){
          if(!this.appIds || !this.appIds.length){
            this.$Message.error('请至少选择一篇文章修改')
            return
          }
          data = {
            'ids':this.appIds.join(','),
            "status": this.statusLine.status,
          }
        }else {
          data = {
            "id": this.artInfo.id,
            "status": this.statusLine.status,
          }
        }
        if(!this.statusLine.status){
          this.$Message.error('请选择类型')
          setTimeout(() => {
            this.loading = false
            this.$nextTick(() => {
              this.loading = true
            })
          }, 1000)
          return
        }
        return updateArticle(data).then((res)=>{
          if(res.data.code === 100){
            this.showEdit = false

            if(this.isAll){
              this.getXcxList(this.thisPage)
              this.isAll = false
              this.$Message.success('操作成功!')
              return
            }
            this.tableData[this.itemIndex].status = this.statusLine.status
            this.statusLine.status = ''
            if(this.artInfo){
              this.artInfo.status = this.statusLine.status
            }
            this.$Message.success('操作成功!')
          }else {
            this.$Message.error(res.data.msg)
          }
        })
      },
      //批量审核
      deploy(){
        this.isAll = true
        this.showEdit = true
      },
      //查看详情
      goDetial(id){
        this.isShowLog = true
        // app.$router.push({
        //   name: 'plugManage_page',
        //   params: { id:id}})
      },
      //重置搜索
      handleReset (name) {
        this.$refs[name].resetFields()
      },
      // 分页切换
      pageSwitch (page) {
        console.log(page)
        this.thisPage = page
        this.getXcxList(page)
      },
    },
    watch: {
    }
  }
</script>

<style scoped lang="less">
  .userlist{
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
  .plugManage{
    padding: 15px 15px 40px 15px;
    .item{
      padding-top: 10px;
      padding-bottom: 10px;border-bottom: 1px solid #ddd;
      display: flex;
      align-items: flex-start;font-size: 14px;

      line-height: 22px;
      .left{
        margin-right: 15px;color: #333;width: 100px;flex-basis: 100px;
      }
      .right{
        color: #999;font-size: 14px;flex: 1;
      }
    }
  }
</style>
