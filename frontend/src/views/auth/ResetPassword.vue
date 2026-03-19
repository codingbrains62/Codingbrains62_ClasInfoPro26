<template>
  <div class="login_form forgotpsswrd">
    <div class="innerwrp">
      <h1 class="heading">RESET YOUR PASSWORD</h1>
      <p>Enter your new password</p>

      <!-- LOADING -->
      <div v-if="loading" class="info">
        Checking token...
      </div>

      <!-- ERROR -->
      <div v-if="error" class="error">
        {{ error }}
      </div>

      <!-- FORM -->
      <form v-if="validToken && !loading" @submit.prevent="reset">
        <div class="password-field">
          <input :type="showPassword ? 'text' : 'password'" v-model="password"
            placeholder="New Password" required />
          <span class="toggle" @click="showPassword = !showPassword"> {{ showPassword ? 'Hide' : 'Show' }} </span>
        </div>
        <div class="password-field">
          <input :type="showConfirm ? 'text' : 'password'" v-model="confirmPassword"
            placeholder="Confirm Password" required />
          <span class="toggle" @click="showConfirm = !showConfirm"> {{ showConfirm ? 'Hide' : 'Show' }} </span>
        </div>
        <button class="loginbtn" type="submit"> Save </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch  } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { resetPasswordApi, verifyForgotTokenApi } from '@/services/auth.service'
import { useToast } from 'primevue/usetoast'

const route = useRoute()
const router = useRouter()
const token = route.params.token

const toast = useToast()

const password = ref('')
const confirmPassword = ref('')
const error = ref('')
const loading = ref(true)
const validToken = ref(false)
const showPassword = ref(false)
const showConfirm = ref(false)

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/

onMounted(async () => {
  try {
    const { data, error: apiError } = verifyForgotTokenApi(token)
    watch(data, (res) => {
      if (!res) return
      if (res.record?.status === 'success') {
        validToken.value = true
      } else {
        error.value = res.record?.message || 'Invalid or expired link'
      }
      loading.value = false
    })
    watch(apiError, () => {
      error.value = 'Invalid or expired link'
      loading.value = false
    })
  } catch (e) {
    error.value = 'Invalid or expired link'
    loading.value = false
  }
})
const reset = async () => {
  error.value = ''
  if (password.value !== confirmPassword.value) {
    error.value = 'Password and confirm password do not match'
    return
  }
  if (!passwordRegex.test(password.value)) {
    error.value =
      'Minimum 8 chars, uppercase, lowercase, number & special character required'
    return
  }
  const { data } = resetPasswordApi(token, password.value)
  watch(data, (res) => {
    if (!res) return
    if (res.record?.status === 'success') {
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Password reset successful',
        life: 3000
      })
      setTimeout(() => {
        router.push('/')
      }, 1500)
    } else {
      error.value = res.record?.message || 'Reset failed'
    }
  })
}
</script>

<style scoped>
  .login_form {
      display: flex;
      max-width: 350px;
      width: 100%;
      margin: auto;
      align-items: center;
  }
  .innerwrp {
      width: 100%;
      padding: 40px 30px;
      border-radius: 8px;
      border: 1px solid #a8a8a8;
      background: #fff;
  }
  .heading {
      font-size: 22px;
      text-align: center;
      color: #a8a8a8;
      font-weight: normal;
      text-transform: uppercase;
      margin-bottom: 15px;
  }
  p {
      text-align: center;
      font-size: 16px;
      color: #717171;
      margin-bottom: 20px;
  }
  input {
      width: 100%;
      height: 50px;
      border: 1px solid #a8a8a8;
      border-radius: 4px;
      padding: 0 15px;
      font-size: 15px;
      margin-bottom: 20px;
  }
  input:focus {
      outline: none;
      border-color: #2196f3;
  }
  .loginbtn {
      width: 100%;
      height: 50px;
      background: #2196f3;
      border: 1px solid #2196f3;
      color: #fff;
      font-size: 16px;
      cursor: pointer;
  }
  .loginbtn:hover {
      background: #003e77;
      border-color: #007763;
  }
  .error {
      color: #fff;
      text-align: center;
      background: #ff00007a;
      margin-bottom: 20px;
      padding: 6px;
      border-radius: 4px;
  }
  .info {
      text-align: center;
      color: #717171;
      margin-bottom: 20px;
  }
  .password-field {
    position: relative;
  }
  .password-field input {
    padding-right: 60px;
  }
  .toggle {
    position: absolute;
    right: 15px;
    top: 15px;
    cursor: pointer;
    font-size: 13px;
    color: #2196f3;
  }
</style>