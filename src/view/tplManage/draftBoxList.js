import DateUtil from '@/libs/DateUtil'
export default (that)=>{
  return [
    {title: '草稿ID', key: 'draft_id'},
    {title: '版本号', key: 'user_version'},
    {title: '描述', key: 'user_desc'},
    {title: '最近提交时间', key: 'create_time',
      render:(h, params)=>{
        return h('div',DateUtil.dateToStr('yyyy-MM-dd HH:mm:ss',new Date(params.row.create_time*1000)))
      }
    },
    {title: '操作',
      render: (h, params) => {
        return h('div',[
          h('Button', {
            props: {type: 'primary', size: 'small'},
            style:{marginRight:'5px'},
            on: {
              click: () => {
                that.$Modal.confirm({
                  title:'添加到模板库',
                  content:'是否确定执行此操作？',
                  loading:true,
                  onOk:()=>{
                    that.executeButton('addToTemplate',{
                      draftId:params.row.draft_id
                    },params)
                  }
                })
              }
            }
          }, '添加到模板库'),
          h('Button', {
            props: {type: 'primary', size: 'small'},
            style:{marginRight:'5px'},
            on: {
              click: () => {
                that.$Modal.confirm({
                  title:'一键同步平台本地',
                  content:'是否确定执行此操作？',
                  loading:true,
                  onOk:()=>{
                    that.onePt('addToTemplate',{
                      draftId:params.row.draft_id
                    },params)
                  }
                })
              }
            }
          }, '一键平台'),
          h('Button', {
            props: {type: 'primary', size: 'small'},
            style:{marginRight:'5px'},
            on: {
              click: () => {
                that.$Modal.confirm({
                  title:'一键同步门店本地',
                  content:'是否确定执行此操作？',
                  loading:true,
                  onOk:()=>{
                    that.onePt('addToTemplate',{
                      draftId:params.row.draft_id
                    },params)
                  }
                })
              }
            }
          }, '一键门店'),
        ])
      }
    },
  ]
}

