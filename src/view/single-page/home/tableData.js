import DateUtil from '@/libs/DateUtil'
import Cumdpdnmu from '../../components/Cumdpdnmu.vue'
import { getTestQrcode } from '@/api/home'
let itemList = [
  {type:1,value:'reviseConfig',label:'修改域名配置'},
  {type:1,value:'submitCode',label:'提交代码'},
  {type:1,value:'submitAudit',label:'提交审核'},
  {type:3,value:'findiAudit',label:'审核结果'},
  {type:2,value:'formalRelease',label:'正式发布'},
  {type:1,value:'expUser',label:'体验用户'},
  {type:2,value:'refreshInfo',label:'刷新信息'},
  {type:4, value:'plugManage', label: '插件管理' },
  // {type:1,value:'modifyComp',label:'修改最低兼容版本'},
]
export default (that)=>{
  return [
    {title: 'ID',width:50, key: 'id'},
    {title: '授权方昵称', key: 'nickName',minWidth:100},
    {title: '授权方头像', key: 'headImg',width:75,
      render: (h, params) => {

        return h('Poptip',
          {props:{placement:'bottom'}},
          [
            h('img',{
              attrs:{src:params.row.headImg},
              style:{width:'30px',cursor:'pointer'},
            }),
            h('img',{ slot: 'content', attrs:{ src: params.row.headImg }, style:{ maxWidth:'200px'} })
          ]);

        // return h('img',{
        //   attrs:{src:params.row.headImg},
        //   style:{width:'30px',cursor:'pointer'},
        //   on:{
        //     click:()=>{
        //       that.showImg('授权方头像',params.row.headImg)
        //     }
        //   }
        // })
      }
    },
    {title: '账号介绍', width:65, key: 'signature',
      render: (h, params) => {
        return h('Tooltip', {
          props: { placement: 'bottom' }
        }, [
          '查看',
          h('span', { slot: 'content', style: { whiteSpace: 'normal', wordBreak: 'break-all' } },params.row.signature)
        ])
      }
    },
    {title: '小程序的主体名称', key: 'principalName',minWidth:100},
    {title: '所属', key: 'sysName', width:100,
      render:(h,params) =>{
        return h("span",that.typeList.find((element) => (element.value === params.row.sysName)).label);
      }
    },
    {title: '体验版', key: 'qrcodeUrl', width:75,
      render: (h, params) => {

        return h('Poptip',
          {props:{placement:'bottom'},
            sytle:{width:240},
            on:{
              'on-popper-show':()=>{
                getTestQrcode(params.row.authorizerAppId).then(res => {
                  if(res.data.code === '0'){
                    that.testQrcodeUrl = res.data.data
                  }
                  console.log(that.testQrcodeUrl);
                });
                console.log('popperShow');
              },
              'on-popper-hide':()=>{
                that.testQrcodeUrl="";
              }
            }

        },
          [
            '查看',

              h('img',{ slot: 'content',attrs:{src:that.testQrcodeUrl}, style:{ maxWidth:'200px'}})

          ]);

        // return h('Button',{
        //   props: {type: 'primary', size: 'small'},
        //   on:{
        //     click:()=>{
        //       that.showImg('体验版',params.row,1)
        //     }
        //   }
        // },'查看')
      }
    },
    {title: '正式版', key: 'qrcodeUrl',width:75,
      render: (h, params) => {
        return h('Poptip',
          {props:{placement:'bottom'}},
          [
            h('img',{
              attrs:{src:params.row.qrcodeUrl},
              style:{width:'30px',cursor:'pointer'},
            }),
            h('img',{ slot: 'content', attrs:{ src: params.row.qrcodeUrl }, style:{ maxWidth:'200px'} })
          ]);
        // return h('img',{
        //   attrs:{src:params.row.qrcodeUrl},
        //   style:{width:'30px',cursor:'pointer'},
        //   on:{
        //     click:()=>{
        //       that.showImg('正式版',params.row.qrcodeUrl)
        //     }
        //   }
        // })
      }
    },
    {title: '体验版本', key: 'commitTemplateId',width:100,
      render:(h,params)=>{
        return h('span',(params.row.commitVersion||"-")+'/'+(params.row.commitTemplateId||"-"));
      }
    },
    {title: '审核版本', key: 'auditTemplateId',width:100,
      render:(h,params)=>{
        return h('span',(params.row.auditVersion||"-")+'/'+(params.row.auditTemplateId||"-"));
      }
    },
    {title: '审核ID', key: 'auditId',minWidth:100},
    {title: '审核状态',width:90, key: 'auditStatus',
      render:(h, params)=>{
        if(params.row.auditStatus===1){
          return h('Tooltip', {
                    props: {placement: 'bottom'}
                  }, [
                    that.statusMap[params.row.auditStatus],
                    h('span', {
                      slot: 'content',
                      style: {whiteSpace: 'normal', wordBreak: 'break-all'}
                    }, params.row.auditFailReason.replace(/<br>/ig,"\n\r"))
                  ]);
        }else{
          return h('span',that.statusMap[params.row.auditStatus])
        }

      }
    },
    // {title: '审核失败原因', key: 'auditFailReason'    },
    {title: '正式版本', key: 'releaseTemplateId',width:100,
      render:(h,params)=>{
        return h('span',(params.row.releaseVersion||"-")+'/'+(params.row.releaseTemplateId||"-"));
      }
    },
    {title: '姓名', key: 'clientName',width:80},
    {title: '会员ID', key: 'clientUserId',width:75},
    {title: '电话', key: 'clientPhone',width:115},
    {title: '订单号', key: 'mpOrderNo',width:120},
    {title: '购买时间', width:100,
      key: 'clientPaidTime',
      render:(h, params)=>{
        if(params.row.clientPaidTime>999999999999){
          return h('div',DateUtil.dateToStr('yyyy-MM-dd HH:mm:ss',new Date(params.row.clientPaidTime)))
        }else if(params.row.clientPaidTime>999999999){
          return h('div',DateUtil.dateToStr('yyyy-MM-dd HH:mm:ss',new Date(params.row.clientPaidTime*1000)))
        }else{
          return h("div","");
        }

      }
    },
    {title: '操作', key: 'action',
      width: 100,
      align: 'center',
      render: (h, params) => {
        return h(Cumdpdnmu, {
          props: {item:params.row,itemList:itemList}
        })
      }
    }
  ]
}

