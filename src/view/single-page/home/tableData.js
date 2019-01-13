import DateUtil from '@/libs/DateUtil'
export default (that)=>{
  return [
    {type: 'selection', width: 60, align: 'center'},
    {title: 'ID',width:50, key: 'id'},
    {title: '发布时间',width:150, key: 'id',render:(h,params)=>{
        return h('span',DateUtil.dateToStr('yyyy-MM-dd HH:mm:ss',new Date(params.row.insert_time)))
      }
    },
    {title: '用户昵称', key: 'nickName',minWidth:100,render:(h,params)=>{
        return h('span',params.row.user.nickname)
    }},
    {title: '用户头像', key: 'headImg',width:100,
      render: (h, params) => {
        return h('Poptip', {props:{placement:'bottom'}},
          [
            h('img',{
              attrs:{src:params.row.user.avatar},
              style:{width:'30px',cursor:'pointer'},
            }),
            h('img',{ slot: 'content', attrs:{ src: params.row.user.avatar }, style:{ maxWidth:'200px'} })
          ]);
      }
    },
    {title: '用户身份', key: 'nickName',minWidth:70,render:(h,params)=>{
        return h('span',params.row.user.type)
      }
    },
    {title: '文章类型', key: 'article_types',minWidth:70,render:(h,params)=>{
        return h('span',params.row.article_type)
    }},
    {title: '文章分类', key: 'nickName',minWidth:70,render:(h,params)=>{
        return h('span',params.row.category)
    }},
    {title: '文章标题', key: 'title',minWidth:70,render: (h, params) => {
        return h('Tooltip', {
          props: { placement: 'bottom' }
        }, [
          '查看',
          h('span', { slot: 'content', style: { whiteSpace: 'normal', wordBreak: 'break-all' } },params.row.title)
        ])
    }},
    // {title: '文章内容', width:65, key: 'content',
    //   render: (h, params) => {
    //     return h('Tooltip', {
    //       props: { placement: 'bottom' }
    //     }, [
    //       '查看',
    //       h('span', { slot: 'content', style: { whiteSpace: 'normal', wordBreak: 'break-all' } },params.row.content)
    //     ])
    //   }
    // },
    // {title: '文章所附文件', key: 'img_urls',minWidth:100, render: (h, params) => {
    //   if(params.row.type == '0'){
    //     var harry = []
    //     for (let i =0 ,img;img=params.row.img_urls.split(',')[i];i++){
    //       harry.push(h('Poptip', {props:{placement:'bottom'}},
    //         [
    //           h('img',{
    //             attrs:{src:img},
    //             style:{width:'30px',cursor:'pointer'},
    //           }),
    //           h('img',{ slot: 'content', attrs:{ src: img }, style:{ maxWidth:'200px'} })
    //         ]))
    //     }
    //     return h('div',[...harry])
    //   }else if(params.row.type == '1'){
    //     return h("span",params.row.img_urls);
    //   }
    // }},
    {title: '审核状态', key: 'sysName', width:100,
      render:(h,params) =>{
        return h("span",params.row.status);
      }
    },
    {title: '操作', key: 'action',
      width: 100,
      align: 'center',
      render: (h, params) => {
        return h('div',[
          h('Button', {
            props: {type: 'primary', size: 'small'},
            style:{marginRight:'5px'},
            on: {
              click: () => {
                that.showEdit = true
                that.itemData = {...params.row}
                that.itemIndex = params.index
              }
            }
          }, '编辑审核状态'),
          h('Button', {
            props: {type: 'primary', size: 'small'},
            style:{marginRight:'5px'},
            on: {
              click: () => {
                that.goDetial(params.row.id)
              }
            }
          }, '查看详情')
        ])

      }
    }
  ]
}

