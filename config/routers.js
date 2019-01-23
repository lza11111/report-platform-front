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
        name: 'report',
        icon: 'smile',
        
        routes: [
          { 
            path: '/report', 
            redirect: '/report/list'
          },
          {
            path: '/report/list',
            name: 'reportlist',
            component: './report/container/ReportListContainer',
          },
          {
            path: '/report/add',
            name: 'reporttemplatelist',
            component: './report/container/ReportTemplateListContainer',
          },
          {
            path: '/report/add/:id',
            name: 'reportnew',
            hideInMenu: true,
            component: './report/container/NewReportContainer',
          },
          {
            path: '/report/:id',
            name: 'reportdetail',
            hideInMenu: true,
            component: './report/container/ReportDetailContainer',
          },
          
        ]
      },
    ],
  },
];
