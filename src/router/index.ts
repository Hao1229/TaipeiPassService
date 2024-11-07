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
import DisasterReportView from '@/views/DisasterReportView.vue';
import DisasterReportFormView from '@/views/DisasterReportFormView.vue';
import LibraryServiceView from '@/views/LibraryServiceView.vue';
import LibraryNoticeListView from '@/views/LibraryNoticeListView.vue';
import LibraryNoticeDetailView from '@/views/LibraryNoticeDetailView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior() {
    return { top: 0 };
  },
  routes: [
    {
      path: '/',
      name: 'home',
      meta: {
        title: '申辦服務'
      },
      component: HomeView
    },
    {
      path: '/form/:id',
      name: 'form',
      meta: {
        title: '申辦服務'
      },
      component: FormView
    },
    {
      path: '/surrounding-service',
      name: 'surrounding-service',
      meta: {
        title: '周邊服務'
      },
      component: SurroundingServiceView
    },
    {
      path: '/qna',
      name: 'top-qna-list',
      meta: {
        title: '功能教學 • 城市通'
      },
      component: TopQnAListView
    },
    {
      path: '/qna/categories',
      name: 'qna-list',
      meta: {
        title: '常見問題 • 城市通'
      },
      component: QnAListView
    },
    {
      path: '/coupon',
      meta: {
        title: '優惠'
      },
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
      meta: {
        title: '票夾'
      },
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
      meta: {
        title: '臨櫃叫號'
      },
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
      meta: {
        title: '有話要說'
      },
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
      meta: {
        title: '訂閱'
      },
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
    },
    {
      path: '/disaster-report',
      meta: {
        title: '災防通報'
      },
      children: [
        {
          path: '',
          name: 'disaster-report',
          component: DisasterReportView
        },
        {
          path: 'form/:id',
          name: 'disaster-report-form',
          component: DisasterReportFormView
        }
      ]
    },
    {
      path: '/library-service',
      children: [
        {
          path: '',
          name: 'library-service',
          component: LibraryServiceView,
          meta: {
            title: '圖書館服務'
          }
        },
        {
          path: 'notice-list',
          name: 'library-notice-list',
          component: LibraryNoticeListView,
          meta: {
            title: '重要訊息'
          }
        },
        {
          path: 'notice-detail/:id',
          name: 'library-notice-detail',
          component: LibraryNoticeDetailView,
          meta: {
            title: '重要訊息'
          }
        }
      ]
    }
  ]
});

// 導航守衛，用來動態修改標題
router.beforeEach((to, from, next) => {
  const defaultTitle = '城市通'; // 預設標題
  document.title = (to.meta.title as string) || defaultTitle;
  next();
});

export default router;
