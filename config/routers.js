export default [
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      {
        path: '/user',
        component: './Welcome',
      },
    ],
  },
  {
    path: '/',
    component: '../layouts/BasicLayout',
    routes: [
      {
        path: '/',
        redirect: '/welcome',
      },
      // dashboard
      {
        path: '/welcome',
        name: '欢迎光临',
        icon: 'smile',
        component: './Welcome',
      },
      {
        path: '/report',
        name: '报告模块',
        icon: 'smile',
        
        routes: [
          { 
            path: '/report', 
            redirect: '/report/list'
          },
          {
            path: '/report/list',
            name: '所有报告',
            component: './report/container/ReportListContainer',
          },
          {
            path: '/report/add',
            name: '新建报告',
            component: './report/container/NewReportContainer',
          },
          {
            path: '/report/:id',
            component: './report/container/ReportDetailContainer',
          },
          
        ]
      },
    ],
  },
];
