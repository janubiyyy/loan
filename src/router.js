import Vue from 'vue';
import Router from 'vue-router';
import LoanList from './components/LoanList.vue';
import LoanDetails from './components/LoanDetails.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',  // Use 'hash' if you prefer hash mode
  routes: [
    {
      path: '/',
      name: 'LoanList',
      component: LoanList
    },
    {
      path: '/loan/:id',
      name: 'LoanDetails',
      component: LoanDetails
    }
  ]
});
