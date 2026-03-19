<template>
  <Card class="login-card">
    <template #title>LOGIN TO CLASINFO PRO</template>

    <template #content>
      <InputText placeholder="Username" class="full-width mb-3" v-model="email" />
      <Password placeholder="Password" :feedback="false" toggleMask class="full-width mb-3" inputClass="full-width" v-model="password" />
      
       <div v-if="btnDisable" class="security-alert">
        Too many failed attempts. Please wait 12 minutes before trying again.
      </div>

      <div class="remember">
        <Checkbox v-model="toggle" binary @change="rememberMe" />
        <label>Remember Me</label>
      </div>
      <Button label="Sign In" class="login-btn" :loading="loading" :disabled="btnDisable || loading" @click="login" />
      <div class="forgot">
        <RouterLink to="/forgotpassword">Forgot password?</RouterLink>
      </div>
         <p style="text-align: center;">OR</p>
      <Button label="Login with Passkey" class="loginPasskey-btn mt-2" :loading="passkeyLoading"
       :disabled="passkeyLoading"  @click="loginWithPasskey" />
    </template>
  </Card>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useStorage } from '@vueuse/core'
import { useToast } from 'primevue/usetoast'
import { useRouter, RouterLink } from 'vue-router'
import { loginApi } from '@/services/auth.service'
import { getPasskeyLoginOptions, verifyPasskeyLogin } from '@/services/passkey.service'
import { startAuthentication } from '@simplewebauthn/browser'

// PrimeVue components
import Card from 'primevue/card'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Checkbox from 'primevue/checkbox'
import Button from 'primevue/button'

const router = useRouter()
const toast = useToast()
const email = ref('')
const password = ref('')
const toggle = ref(false)
const loading = ref(false)
const passkeyLoading = ref(false)
const user = useStorage('user', {})

// Remember Me (VueUse storage)
const rememberedEmail = useStorage('remember_email', '')
// Security alert
const securityAlert = useStorage('securityalert', 0)
const btnDisable = computed(() => securityAlert.value >= 5)

onMounted(() => {
  if (rememberedEmail.value) {
    email.value = rememberedEmail.value
    toggle.value = true
  }
})

// Remember Me handler
const rememberMe = () => {
  if (toggle.value) {
    rememberedEmail.value = email.value
  } else {
    rememberedEmail.value = ''
  }
}

// Reset security
const resetSecurity = () => {
  securityAlert.value = 0
}

const login = async () => {
  if (btnDisable.value) return
    if (!email.value || !password.value) {
      toast.add({
        severity: 'warn',
        summary: 'Missing Fields',
        detail: 'Email and password are required',
        life: 3000
      })
      return
    }
  try {
    loading.value = true
    const { data } = await loginApi(email.value, password.value)
    const res = data.value?.record
    if (!res) {
      toast.add({
        severity: 'error',
        summary: 'Server Error',
        detail: 'Invalid server response',
        life: 3000
      })
      return
    }

    if (res.status_code === 200) {
      if (toggle.value) {
        rememberedEmail.value = email.value
      }
        user.value = {
          token: res.token,
          username: res.data.username,
          fullName: res.data.fullName,
          emailAddress: res.data.emailAddress,
          celPhone: res.data.phone,
          userid: res.data.id,
          securityLevel: res.data.SecurityLevel
        }
        localStorage.setItem('token', res.token)
        localStorage.setItem('toast', JSON.stringify({
          severity: 'success',
          summary: 'Login Successful',
          detail: res.message || 'You are successfully logged in',
          life: 3000
        }))
     resetSecurity()
     router.push('/dashboard')
    } else {
      securityAlert.value++
      toast.add({
        severity: 'error',
        summary: 'Login Failed',
        detail: res.message || 'Invalid credentials',
        life: 3000
      })
      if (securityAlert.value >= 5) {
        toast.add({
          severity: 'warn',
          summary: 'Account Locked',
          detail: 'Too many attempts. Try again after 12 minutes.',
          life: 4000
        })
        setTimeout(resetSecurity, 12 * 60 * 1000)
      }
    }
  } catch (err) {
    toast.add({
      severity: 'error',
      summary: 'Network Error',
      detail: 'Unable to reach server',
      life: 3000
    })
  } finally {
    loading.value = false
  }
}
const loginWithPasskey = async () => {
   if (passkeyLoading.value) return
      if (!email.value) {
        toast.add({
          severity: 'warn',
          summary: 'Email Required',
          detail: 'Enter your email before using passkey login',
          life: 3000
        })
        return
      }
  try {
    passkeyLoading.value = true
    const { data, error } = await getPasskeyLoginOptions(email.value)
    if (error.value) {
      throw new Error(error.value.message)
    }

    const options = data.value

     if (!options?.challenge) {
      throw new Error('Invalid authentication options')
    }
    const assertion = await startAuthentication(options)
    const { data: verifyData } = await verifyPasskeyLogin({
      email: email.value,
      response: assertion
    })

  const record = verifyData.value.record
  if (record.status_code !== 200) {
      throw new Error(record.message)
    }

user.value = {
  token: record.token,
  username: record.data.username,
  fullName: record.data.fullName,
  emailAddress: record.data.emailAddress,
  userid: record.data.id,
  securityLevel: record.data.SecurityLevel 
}
localStorage.setItem('token', record.token)

router.push('/dashboard')
  } catch (err) {
  if (err.name === 'NotAllowedError' || err.name === 'AbortError') {
    toast.add({
      severity: 'info',
      summary: 'Cancelled',
      detail: 'Passkey login was cancelled',
      life: 2000
    })
    return
  }

  toast.add({
    severity: 'error',
    summary: 'Passkey Login Failed',
    detail: err.message || 'Authentication failed',
    life: 3000
  })
}finally {
    passkeyLoading.value = false
  }
}
</script>