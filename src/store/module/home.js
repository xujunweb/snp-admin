import { confirmHttp,getResult } from '@/api/home'
import { Modal,Message,Notice } from 'iview'

let configArry = ['reviseConfig', 'submitCode', 'submitAudit', 'expUser', 'modifyComp', 'pluginDialog']
function mapGet() {
  var map = {}
  for (let i=0,item;item=configArry[i];i++){
    map['get'+item] = (state)=>{
      return state[item]
    }
  }
  return map
}
export default {
  components: {
    Notice
  },
  state: {
    xcxInfo:null, //需要编辑的小程序信息
    reviseConfig:{show:false}, //修改域名配置弹窗显示
    submitCode:{show:false},  //提交代码弹窗显示
    submitAudit:{show:false}, //提交审核弹窗显示
    expUser:{show:false}, //体验用户弹窗显示
    modifyComp:{show:false},  //修改最低兼容配置弹窗显示
    pluginDialog: { show: false }, //插件弹窗显示
  },
  getters: {
    ...mapGet(),
    getxcxInfo(state){
      return state.xcxInfo
    },
  },
  mutations: {
    setPopupConfig (state,config) {
      state[config.name].show = config.res
    },
    updatexcxInfo(state,info){
      state.xcxInfo = {...info}
    },
  },
  actions: {
    // 更新
    updataPopup ({ state, commit },config) {
      commit('setPopupConfig',config)
    },
    //执行询问窗事件
    executeButton({ state, commit },{name,params}){
      confirmHttp[name](params).then((res)=>{
        Modal.remove()
        if(res.data.code==='0'){
          Message.success('操作成功!')
        }else {
          Message.error(res.data.msg)
        }
      })
    },
    //操作
    executeEvent({ state, commit,dispatch },{item,list}){
      switch (list.type) {
        case 1:
          commit('setPopupConfig',{name:list.value,res:true})
          break
        case 2:
          Modal.confirm({
            title:list.label,
            content:'是否确定执行此操作？',
            loading:true,
            onOk:()=>{
              dispatch('executeButton',{name:list.value,params:{
                authorizerAppId:item.authorizerAppId
              }})
            }
          })
          break
        case 3:
          //目前唯一特殊值，查看审核结果
          dispatch('lookResult',item)
          break
        case 4:
          app.$router.push({
            name: 'plugManage_page',
            params: { appid: item.authorizerAppId}})
          break
        default:
          break
      }
      commit('updatexcxInfo',item)
    },
    //查看审核结果
    lookResult({ state, commit },item){

      getResult({authorizerAppId:item.authorizerAppId}).then((res)=>{
        if(res.data.code === '0'){
          if(res.data.data.status===-1){
            Notice.info({
              title: "未提审"
            });
          }else if(res.data.data.status===0){
            Notice.success({
              title: "审核成功"
            });
          }else if(res.data.data.status===1){
            Notice.error({
              title: "审核失败",
              desc: res.data.data.reason
            });
          }else if(res.data.data.status===2){
            Notice.info({
              title: "审核中"
            });
          }

          // Modal.info({
          //   title:'审核结果',
          //   content:'',
          // })
        }
      })
    },
  }
}
