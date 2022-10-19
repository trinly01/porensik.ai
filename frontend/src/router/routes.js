require('jsdom-global')()
// window.localStorage = {
//   getItem () {},
//   setItem () {}
// }
const routes = [
  {
    path: '/',
    // component: () => import('pages/cli.vue'),
    component: () => import('layouts/MyLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') },
      { path: 'mydrive/:_id', component: () => import('pages/myDrive.vue') },
      { path: 'trash', component: () => import('pages/trash.vue') },
      { path: 'shared', component: () => import('pages/shared.vue') }
    ]
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
