import { createRouter, createWebHistory } from 'vue-router'
import { useStorage } from '@vueuse/core'

import MainLayout from '@/layouts/MainLayout.vue'
import Login from '@/views/auth/LoginView.vue'
import ForgotPassword from '@/views/auth/ForgotPassword.vue'
import ResetPassword from '@/views/auth/ResetPassword.vue'
import Contact from '@/views/ContactUs.vue'
import Dashboard from '@/views/Dashboard.vue'
import UserProfile from '@/views/UserProfile.vue'
import AddUser from '@/views/AddUser.vue'
import terms from '@/views/Terms.vue'
import PrivacyPolicy from '@/views/PrivacyPolicy.vue'
const routes = [
  {
    path: '/',
    component: MainLayout,
    meta: { centerContent: true },
    children: [
      { path: '', name: 'login', component: Login }
    ]
  },

   {
    path: '/forgotpassword',
    component: MainLayout,
    meta: { centerContent: true },
    children: [
      { path: '', name: 'ForgotPassword', component: ForgotPassword }
    ]
  },

  {
    path: '/forget_password_link/:token',
    component: MainLayout,
    meta: { centerContent: true },
    children: [
      { path: '', name: 'ResetPassword', component: ResetPassword }
    ]
  },


  {
    path: '/contact',
    component: MainLayout,
    meta: { centerContent: true },
    children: [
      { path: '', name: 'contact', component: Contact }
    ]
  },
  {
    path: '/dashboard',
    component: MainLayout,
    meta: { centerContent: false, requiresAuth: true },
    children: [
      { path: '', name: 'dashboard', component: Dashboard }
    ]
  },
 {
    path: "/userprofile",
    component: MainLayout,
    meta: { centerContent: false },
    children: [
      { path: "/userprofile", name: "userprofile", component: UserProfile },
    ],
  },
  {
    path: "/adduser",
    component: MainLayout,
    meta: { centerContent: false },
    children: [{ path: "", name: "adduser", component: AddUser }],
  },
  {
    path: "/edituser/:id",
    component: MainLayout,
    meta: { centerContent: false },
    children: [
      { path: "", name: "edituser", component: AddUser }
    ],
  },
  {
    path: '/terms',
    component: MainLayout,
    meta: { centerContent: true },
    children: [
      { path: '', name: 'terms', component:terms }
    ]
  },
  {
    path:'/privacypolicy',
    component: MainLayout,
    meta: { centerContent: true },
    children:[
      { path: '', name: 'privacy-policy', component: PrivacyPolicy }  
    ]
  }
]

// create router
const router = createRouter({
  history: createWebHistory(),
  routes
})

/**
  * Global Auth Guard
*/
router.beforeEach((to, from, next) => {
  const user = useStorage('user', {})
  const isLoggedIn = !!user.value.token
  //  Protected route
   if (to.meta.requiresAuth && !isLoggedIn) {
    return next({ name: 'login' })
  }
  // Logged-in user should not see login page
  if (to.meta.guestOnly && isLoggedIn) {
    return next({ name: 'dashboard' })
  }
  next()
})

export default router
