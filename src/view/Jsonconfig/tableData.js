import DateUtil from '@/libs/DateUtil'
export default (that)=>{
  return [
    {type: 'selection', width: 60, align: 'center'},
    {title: 'ID',width:100, key: 'id'},
    {title: '发布时间',width:150, key: 'id',render:(h,params)=>{
        return h('span',DateUtil.dateToStr('yyyy-MM-dd HH:mm:ss',new Date(params.row.insert_time)))
      }
    },
    {title: '机构logo', key: 'cover_urls',width:100,
      render: (h, params) => {
        return h('Poptip', {props:{placement:'bottom'}},
          [
            h('img',{
              attrs:{src:params.row.cover_urls},
              style:{width:'30px',cursor:'pointer'},
            }),
            h('img',{ slot: 'content', attrs:{ src: params.row.cover_urls }, style:{ maxWidth:'200px'} })
          ]);
      }
    },
    {title: '机构名称', key: 'name',width:100,render:(h,params)=>{
        return h('span',params.row.name)
    }},
    {title: '主营业务', key: 'nickName',minWidth:80,render:(h,params)=>{
        return h('span',params.row.type)
      }
    },
    {title: '地址', key: 'article_types',minWidth:70,render:(h,params)=>{
        return h('span',params.row.address)
    }},
    // {title: '文章标题', key: 'title',width:70,render: (h, params) => {
    //     return h('Tooltip', {
    //       props: { placement: 'bottom' }
    //     }, [
    //       '查看',
    //       h('span', { slot: 'content', style: { whiteSpace: 'normal', wordBreak: 'break-all' } },params.row.title)
    //     ])
    // }},
    {title: '审核状态', key: 'sysName', width:100,
      render:(h,params) =>{
        return h("span",that.statusMap[params.row.status]);
      }
    },
    {title: '操作', key: 'action',
      minWidth: 150,
      align: 'center',
      render: (h, params) => {
        return h('div',[
          h('Button', {
            props: {type: 'primary', size: 'small'},
            style:{marginRight:'5px'},
            on: {
              click: () => {
                that.showEdit = true
                that.artInfo = {...params.row}
                that.itemIndex = params.index
              }
            }
          }, '编辑审核状态'),
          h('Button', {
            props: {type: 'primary', size: 'small'},
            style:{marginRight:'5px'},
            on: {
              click: () => {
                that.artInfo = {...params.row}
                that.itemIndex = params.index
                that.goDetial(params.row.id)
              }
            }
          }, '查看详情')
        ])

      }
    }
  ]
}

