import DateUtil from '@/libs/DateUtil'
export default (that)=>{
  return [
    {title: '模板ID', key: 'template_id'},
    {title: '版本号', key: 'user_version'},
    {title: '描述', key: 'user_desc'},
    {title: '添加时间', key: 'create_time',
      render:(h, params)=>{
        return h('div',DateUtil.dateToStr('yyyy-MM-dd HH:mm:ss',new Date(params.row.create_time*1000)))
      }
    },
    {title: '操作',
      render: (h, params) => {
        //如果没有被默认
        if(!params.row.isDefault){
          return h('div',[
            !(params.row.isSync)&&h('Button', {
              props: {type: 'primary', size: 'small'},
              style:{marginRight:'5px'},
              on: {
                click: () => {
                  that.showEdit = true
                  that.itemData = {...params.row}
                  that.itemIndex = params.index
                }
              }
            }, '同步'),
            h('Button', {
              props: {type: 'primary', size: 'small'},
              on: {
                click: () => {
                  that.$Modal.confirm({
                    title:'删除',
                    content:'是否确定执行此操作？',
                    loading:true,
                    onOk:()=>{
                      that.executeButton('deleteTemplate',{
                        templateId:params.row.template_id
                      },params)
                    }
                  })
                }
              }
            }, '删除'),
          ])
        }
      }
    },
  ]
}

