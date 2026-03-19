<template>
  <div class="login_form forgotpsswrd">
    <div class="innerwrp">
      <h1 class="heading">LETS LOG YOU IN</h1>
      <p>Tell us your email &amp; we'll do the rest</p>

      <div class="error show" v-if="error"> {{ error }} </div>
      <div class="success show" v-if="success"> {{ success }} </div>

      <form @submit.prevent="submit">
        <input type="email" placeholder="Email" v-model="email" required />
        <button type="submit" class="loginbtn" :disabled="loading">
          {{ loading ? 'Please wait...' : 'Continue' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { forgotPasswordApi } from '@/services/auth.service'
import { useToast } from 'primevue/usetoast'

const email = ref('')
const loading = ref(false)
const error = ref('')
const success = ref('')
const toast = useToast()

const submit = () => {
  error.value = ''
  success.value = ''
  loading.value = true

  const { data, error: apiError } = forgotPasswordApi(email.value)

  watch(data, (res) => {
    if (!res) return
    loading.value = false

    // ✅ CORRECT RESPONSE HANDLING
    if (res.status === 'success') {
      success.value = res.message
      toast.add({
        severity: 'success',
        summary: 'Email Sent',
        detail: res.message,
        life: 3000
      })
    } else {
      error.value = res.message || 'Something went wrong'
    }
  })

  watch(apiError, () => {
    loading.value = false
    error.value = 'Server error. Try again.'
  })
}
</script>

<style scoped>
/* ===== AUTH / LOGIN / FORGOT PASSWORD ===== */
.login_form {
    display: flex;
    max-width: 350px;
    width: 100%;
    margin: auto;
    align-items: center;
}

.login_form .innerwrp {
    width: 100%;
    padding: 40px 30px;
    border-radius: 8px;
    border: 1px solid #a8a8a8;
    background: #fff;
}

.login_form .innerwrp .heading {
    font-size: 22px;
    text-align: center;
    color: #a8a8a8;
    font-weight: normal;
    text-transform: uppercase;
    margin-bottom: 20px;
}

.login_form .innerwrp p {
    text-align: center;
    font-size: 16px;
    color: #717171;
    margin-bottom: 20px;
}

/* INPUT */
.login_form input {
    width: 100%;
    height: 50px;
    border: 1px solid #a8a8a8;
    border-radius: 4px;
    padding: 0 15px;
    font-size: 15px;
    margin-bottom: 20px;
}

.login_form input::placeholder {
    color: #a8a8a8;
}

.login_form input:focus {
    outline: none;
    border-color: #2196f3;
}

/* BUTTON */
.login_form .loginbtn {
    width: 100%;
    height: 50px;
    background: #2196f3;
    border: 1px solid #2196f3;
    color: #fff;
    font-size: 16px;
    cursor: pointer;
    transition: 0.2s;
}

.login_form .loginbtn:hover {
    background: #003e77;
    border-color: #003e77;
}

.login_form .loginbtn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

/* ERROR / SUCCESS */
.error {
    color: #fff;
    text-align: center;
    background: #ff00007a;
    margin-bottom: 20px;
    text-transform: capitalize;
    font-weight: 400;
    padding: 6px;
    border-radius: 4px;
}

.success {
    color: #fff;
    text-align: center;
    background: #00943e;
    margin-bottom: 20px;
    text-transform: capitalize;
    padding: 6px;
    font-weight: 400;
    border-radius: 4px;
}

/* OPTIONAL */
.forgotpsswrd {
    margin-top: 20px;
}
</style>