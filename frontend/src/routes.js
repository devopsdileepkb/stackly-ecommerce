import Home from './pages/Home';
import Orders from './pages/Orders';
import Success from './pages/Success';

const routes = [
  {
    path: '/',
    component: Home,
    name: 'Home'
  },
  {
    path: '/orders',
    component: Orders,
    name: 'Orders'
  },
  {
    path: '/success',
    component: Success,
    name: 'Success'
  }
];

export default routes;
