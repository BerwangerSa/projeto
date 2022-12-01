import { createRouter, createWebHashHistory } from 'vue-router'
import LoginPage from '../views/LoginPage'
import { isLogged } from '../services/global.js'
import CadastrarPage from '../views/CadastrarPage'
import TodasVendas from '../views/TodasVendas'
import NovaVenda from '../views/NovaVenda'
import VendaQRCodePage from '../views/VendaQRCodePage'
import MinhasCompras from '../views/MinhasCompras'
import PainelAdministrativo from '../views/PainelAdministrativo'


const routes = [
  {
    path: '/',
    name: 'login',
    component: LoginPage,
    meta: { title: 'Login' }
  },
  {
    path: '/login',
    name: 'login',
    component: LoginPage,
    meta: { title: 'Login' }
  },
  {
    path: '/cadastrar',
    name: 'cadastrar',
    component: CadastrarPage,
    meta: { title: 'CadastrarPage' }
  },
  {
    path: '/todasvendas',
    name: 'todasvendas',
    component: TodasVendas,
    meta: { title: 'TodasVendas' }
  },
  {
    path: '/novavenda',
    name: 'novavenda',
    component: NovaVenda,
    meta: { title: 'NovaVenda' },
    
  },
  {
    path: '/minhascompras',
    name: 'minhascompras',
    component: MinhasCompras,
    meta: { title: 'MinhasCompras' },
    
  },
  {
    path: '/venda/:idVenda',
    name: 'vendaqrcode',
    component: VendaQRCodePage,
    meta: { title: 'VendaQRCodePage' },
    props: (route) => ({ code: route.query.code })
    
  },
  {
    path: '/paineladministrativo',
    name: 'paineladministrativo',
    component: PainelAdministrativo,
    meta: { title: 'PainelAdministrativo' },
    
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})


router.beforeEach((to, from, next) => {
  if (to.name !== 'login' && to.name !== 'cadastrar' && !isLogged()) {
    next({ name: 'login' })
    document.title = 'Login' ;
  }
  else
  {
    document.title = to.meta.title ;
    next();
  }
})


export default router