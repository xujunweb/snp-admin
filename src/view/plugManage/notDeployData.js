import Cumdpdnmu from '../components/Cumdpdnmu.vue'
export default (that)=>{
  return [
    {type: 'selection', width: 60, align: 'center'},
    { title: '插件AppId', width: 160, key: 'appid'},
    { title: '插件头像', key: 'headimgurl',
      render:(h,params)=>{
        return h('img',  {
          attrs: { src: params.row.headimgurl },
          style: { width: '30px', cursor: 'pointer' },
        })
      }
    },
    { title: '插件昵称', key: 'nickname'},
    {
      title: '插件状态', key: 'status',
      render:(h, params)=>{
        return h('span', that.statusMap[params.row.status])
      }
    },
    {
      title: '操作',
      render: (h, params) => {
        return h('div', [
          h('Button', {
            props: { type: 'primary', size: 'small' },
            style: { marginRight: '5px' },
            on: {
              click: () => {
                that.updateButton(params.row.appid);
              }
            }
          }, '更新'),
          h('Button', {
            props: { type: 'primary', size: 'small' },
            style: { marginRight: '5px' },
            on: {
              click: () => {
                that.$Modal.confirm({
                  title: '删除',
                  content: '是否确定执行此操作？',
                  loading: true,
                  onOk: () => {
                    that.deleteButton('deletePlugin', {
                      appId: that.appId,
                      pluginAppid: params.row.appid
                    }, params)
                  }
                })
              }
            }
          }, '删除')
        ])
      }
    },
  ]
}

