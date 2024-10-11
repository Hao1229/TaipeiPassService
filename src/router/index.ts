import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import FormView from '../views/FormView.vue';
import SurroundingServiceView from '../views/SurroundingServiceView.vue';
import TopQnAListView from '../views/TopQnAListView.vue';
import QnAListView from '../views/QnAListView.vue';
import CounterCallingView from '../views/CounterCallingView.vue';
import CounterCallingDetailView from '../views/CounterCallingDetailView.vue';
import CouponView from '../views/CouponView.vue';
import CouponListView from '../views/CouponListView.vue';
import HotSpotView from '../views/HotSpotView.vue';
import TicketDetail from '../views/TicketDetail.vue';
import CouponDetail from '../views/CouponDetail.vue';
import TicketWallet from '@/views/TicketWallet.vue';
import TicketExchange from '@/views/TicketExchange.vue';
import CitizenReportView from '@/views/CitizenReportView.vue';
import CitizenReportListView from '@/views/CitizenReportListView.vue';
import CitizenReportFormView from '@/views/CitizenReportFormView.vue';
import CitizenReportSearchView from '@/views/CitizenReportSearchView.vue';
import CitizenReportSearchDetailView from '@/views/CitizenReportSearchDetailView.vue';
import SubscriptionView from '@/views/SubscriptionView.vue';
import SubscriptionItemListView from '@/views/SubscriptionItemListView.vue';
import SubscriptionItemDetailView from '@/views/SubscriptionItemDetailView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior() {
    return { top: 0 };
  },
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/form/:id',
      name: 'form',
      component: FormView
    },
    {
      path: '/surrounding-service',
      name: 'surrounding-service',
      component: SurroundingServiceView
    },
    {
      path: '/qna',
      name: 'top-qna-list',
      component: TopQnAListView
    },
    {
      path: '/qna/categories',
      name: 'qna-list',
      component: QnAListView
    },
    {
      path: '/coupon',
      children: [
        {
          path: '',
          name: 'coupon',
          component: CouponView
        },
        {
          path: 'list',
          name: 'coupon-list',
          component: CouponListView
        },
        {
          path: 'hotspot/:id',
          name: 'hotspot',
          component: HotSpotView
        },
        {
          path: 'ticket-detail/:id',
          name: 'ticket-detail',
          component: TicketDetail
        },
        {
          path: 'coupon-detail/:id',
          name: 'coupon-detail',
          component: CouponDetail
        }
      ]
    },
    {
      path: '/ticket-wallet',
      children: [
        {
          path: '',
          name: 'ticket-wallet',
          component: TicketWallet
        },
        {
          path: 'exchange/:id',
          name: 'ticket-exchange',
          component: TicketExchange
        }
      ]
    },
    {
      path: '/counter-calling',
      children: [
        {
          path: '',
          name: 'counter-calling',
          component: CounterCallingView
        },
        {
          path: ':id',
          name: 'counter-calling-detail',
          component: CounterCallingDetailView
        }
      ]
    },
    {
      path: '/citizen-report',
      children: [
        {
          path: '',
          name: 'citizen-report',
          component: CitizenReportView
        },
        {
          path: 'list',
          name: 'citizen-report-list',
          component: CitizenReportListView
        },
        {
          path: 'form/:id',
          name: 'citizen-report-form',
          component: CitizenReportFormView
        },
        {
          path: 'search',
          name: 'citizen-report-search',
          component: CitizenReportSearchView
        },
        {
          path: 'search-detail/:id',
          name: 'citizen-report-search-detail',
          component: CitizenReportSearchDetailView
        }
      ]
    },
    {
      path: '/subscription',
      children: [
        {
          path: '',
          name: 'subscription',
          component: SubscriptionView
        },
        {
          path: 'item-list',
          name: 'item-list',
          component: SubscriptionItemListView
        },
        {
          path: 'item-detail/:id',
          name: 'item-detail',
          component: SubscriptionItemDetailView
        }
      ]
    }
  ]
});

export default router;
