import DateUtil from '@/libs/DateUtil'
export default (that)=>{
  return [
    {title: '模板ID', key: 'templateId'},
    {title: '版本号', key: 'userVersion'},
    {title: '描述', key: 'userDesc'},
    {title: '添加时间', key: 'addTime',
      render:(h, params)=>{
        return h('div',DateUtil.dateToStr('yyyy-MM-dd HH:mm:ss',new Date(params.row.addTime)))
      }
    },
    {title: '是否默认', key: 'isDefault',
      render:(h, params)=>{
        return h('div',params.row.isDefault===1?'默认':'-')
      }
    },
    {title: '操作',
      render: (h, params) => {
        if(params.row.isDefault===2){
          return h('div',[
            h('Button', {
              props: {type: 'primary', size: 'small'},
              style:{marginRight:'5px'},
              on: {
                click: () => {
                  that.$Modal.confirm({
                    title:'设置默认',
                    content:'是否确定执行此操作？',
                    loading:true,
                    onOk:()=>{
                      that.executeButton('setDefault',{
                        templateId:params.row.templateId,
                        type:params.row.type,
                      },params)
                    }
                  })
                }
              }
            }, '设置默认'),
            h('Button', {
              props: {type: 'primary', size: 'small'},
              on: {
                click: () => {
                  that.$Modal.confirm({
                    title:'删除',
                    content:'是否确定执行此操作？',
                    loading:true,
                    onOk:()=>{
                      that.executeButton('deleteLocalTemplate',{
                        templateId:params.row.templateId
                      },params)
                    }
                  })
                }
              }
            }, '删除'),
          ])
        }else {
         return h()
        }
      }
    },
  ]
}

