 <!-- 
  * AppHeader.vue
 * This component renders the application header, including the title, menu toggle button, and user profile dropdown.
 * It also handles user authentication status and provides options for profile management and passkey registration.
  -->

<template>
  <div class="header">
    <!-- LEFT DARK STRIP (SAME AS SIDEBAR WIDTH) -->
    <div class="header-left-strip"></div>
        <!-- CONTENT -->
        <div class="header-content">
        <!-- LEFT -->
            <div class="left">
                <i class="pi pi-bars menu" @click="$emit('toggle')" />
                 <span class="divider"></span>
                <span class="title clickable" @click="goHome">CLASInfo PRO</span>
            </div>

            <!-- RIGHT PROFILE -->
            <div class="right" v-if="isLoggedIn">
            <Menu ref="menu" :model="profileItems" popup />
                <Button class="profile-btn" text @click="toggleMenu" >
                <i class="pi pi-user"></i>
                {{ username }}
                <i class="pi pi-chevron-down"></i>
            </Button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useStorage } from '@vueuse/core'
import { useRouter } from 'vue-router'

// PrimeVue
import Button from 'primevue/button'
import Menu from 'primevue/menu'
import { useAuth } from '@/composables/useAuth'
// Passkey login
import { startRegistration } from '@simplewebauthn/browser'
import { getPasskeyOptions, verifyPasskey } from '@/services/passkey.service'
import { useToast } from 'primevue/usetoast'

// Router
const router = useRouter()
const toast = useToast()

const { user, isLoggedIn, logout } = useAuth()
const token = computed(() => user.value.token || '')
//console.log('USER DATA 👉', user.value)
const username = computed(() => user.value.username || '')
const fullname = computed(() => user.value.fullName || '')
const email = computed(() => user.value.emailAddress || '')
const phone = computed(() => user.value.celPhone || '')

// Menu ref
const menu = ref()
const toggleMenu = (event) => {
  menu.value.toggle(event)
}

const signOut = logout
// Profile dropdown items
const profileItems = computed(() => [
  {
    label: fullname.value || username.value || 'User',
    items: [
      { label: email.value || 'No email available', icon: 'pi pi-envelope', disabled: true },
      { separator: true },
      { label: phone.value || 'No phone available', icon: 'pi pi-phone', disabled: true },
      { separator: true },
      { label: 'My Orders', icon: 'pi pi-inbox', command: () => router.push('/cipinfobox')},
      { label: 'My Profile', icon: 'pi pi-user', command: () => router.push('/Userprofile') },
      { separator: true },
      { label: 'Enable Passkey for Login', icon: 'pi pi-key', command: registerPasskey },
      { separator: true },
      { label: 'Sign Out', icon: 'pi pi-sign-out', command: signOut }
    ]
  }
])
// Register passkey logic
const registerPasskey = async () => {
  if (!user.value) {
    toast.add({
      severity: 'warn',
      summary: 'User not ready',
      detail: 'Please wait...',
      life: 2000
    })
    return
  }
  try {
    const { data, error, statusCode } = await getPasskeyOptions(user.value.emailAddress)

console.log('STATUS 👉', statusCode.value)
console.log('ERROR 👉', error.value)
console.log('DATA 👉', data.value)
console.log('OPTIONS 👉', data.value)

    const options = JSON.parse(JSON.stringify(data.value))
    if (!options?.challenge) {
      throw new Error('Invalid passkey options from server')
    }

    const attestation = await startRegistration(options)

    await verifyPasskey({
      email: user.value.emailAddress,
      response: attestation,
      deviceName: navigator.userAgent
    })

    toast.add({
      severity: 'success',
      summary: 'Passkey Enabled',
      detail: 'You can now login without password',
      life: 3000
    })
  } catch (err) {
    console.error(err)
    toast.add({
      severity: 'error',
      summary: 'Passkey Failed',
      detail: err.message || 'Unable to register passkey',
      life: 4000
    })
  }
}

const goHome = () => {
  if (isLoggedIn.value) {
    router.push('/dashboard')
  } else {
    router.push('/')
  }
}
</script>
<style scoped>
.title.clickable {
  cursor: pointer;
  font-weight: 600;
}
</style>
