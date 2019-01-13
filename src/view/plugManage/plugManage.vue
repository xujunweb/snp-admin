<template>
  <div class="plugManage" v-if="artInfo">
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
      <div class="right">{{artInfo.user.type}}</div>
    </div>
    <div class="item">
      <div class="left">审核状态</div>
      <div class="right">{{artInfo.status}}</div>
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
          <img :src="img" style="maxWidth:'400px'" slot="content"/>
        </Poptip>
      </div>
      <div class="right" v-if="artInfo.type=='1'">
        {{artInfo.img_urls}}
      </div>
    </div>
    <!--审核结果编辑-->
    <Modal v-model="showEdit"
           title="编辑审核结果"
           width="300"
           :loading="loading"
           @on-ok="syncToLocalTemplate">
      <div class="modal-content">
        <Form ref="statusLine" :model="statusLine">
          <FormItem prop="sysName">
            <span class="label">编辑状态：</span>
            <Select v-model="statusLine.status" style="width:200px">
              <Option v-for="item in statusList" :value="item.value" :key="item.value">{{ item.label}}</Option>
            </Select>
          </FormItem>
        </Form>
      </div>
    </Modal>
  </div>
</template>

<script>
  import columns from './notDeployData'
  import {getByArticleId,updateArticle} from '@/api/home'
  import { Modal,Message,Notice } from 'iview'
  import {mapGetters} from 'vuex'
  import pluginDialog from '../components/operation/pluginDialog.vue'
  export default {
    data(){
      return{
        showEdit:false,
        appId:'',    //小程序appID
        statusLine:{
          status:'',  //审核状态
        },
        loading:false,
        statusMap:{   //插件审核状态
          '1':'申请中',
          '2':'申请通过',
          '3':'已拒绝',
          '4':'已超时',
        },
        statusList:[
          {value:'0',label:'待审核'},
          {value:'1',label:'审核通过'},
          {value:'2',label:'审核不通过'},
        ],
        itemData: {title: '添加插件', type : 1 },  //type 1 添加插件  2 更新插件
        artInfo:null, //文章信息
      }
    },
    components: {
      pluginDialog
    },
    computed: {
      ...mapGetters({
        'pluginDialog':'getpluginDialog',
      })
    },
    created(){
      this.appId = this.$route.params.id;
      this.getByArticleId();
    },
    methods:{
      //插件列表
      getByArticleId(){
        return new Promise((resolve, reject)=>{
          getByArticleId({id: this.appId}).then(res => {
            if(res.data.code === 100){
              this.artInfo = res.data.data
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
      //编辑状态
      syncToLocalTemplate(){
        var data = {
          "id": this.appId,
          "status": this.statusLine.status,
        }
        updateArticle(data).then((res)=>{
          if(res.data.code === 100){
            this.showEdit = false
            this.getByArticleId().then((res)=>{
              this.$Message.success('操作成功!')
            }).catch(err => {
              this.$Message.error('操作失败!')
            })
          }else {
            this.$Message.error(res.data.msg)
          }
        })
      },
      //刷新列表
      refreshPlugList(data){
        if(data){
          this.getPlugList();
        }
      }
    }
  }
</script>

<style scoped lang="less">
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
