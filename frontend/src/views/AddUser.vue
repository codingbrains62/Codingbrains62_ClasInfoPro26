<template>
    <div class="wrapper">
        <div class="panel">
            <div class="heading">
                {{ headingText }}
            </div>
            <div class="form-container">
                <div class="row" v-for="f in computedFields" :key="f.key">
                  <div class="label">{{ f.label }}</div>
                    <div class="control">
                        <component :is="f.type" v-model="form[f.key]" :disabled="f.disabled" class="full-input" :options="f.options"
                            optionLabel="label" optionValue="value" :rows="f.rows" :feedback="false" toggleMask />
                        <small class="err" v-if="submitted && f.required && !form[f.key]">
                            {{ f.label }} is required
                        </small>
                    </div>
                </div>
                <div class="btn-row">
                    <button class="btn cancel" @click="reset">Cancel</button>
                    <button class="btn save" :disabled="loading" @click="submit">
                        <span v-if="loading" class="spinner"></span>
                        {{ loading ? 'Saving...' : 'Save' }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, watch, ref, computed } from 'vue'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Textarea from 'primevue/textarea'
import Dropdown from 'primevue/dropdown'
import { addUserApi, updateUserApi, getUserByIdApi } from '@/services/userService'
import { useToast } from 'primevue/usetoast'
import { useRoute } from 'vue-router'
import { useStorage } from '@vueuse/core'
const toast = useToast()

const props = defineProps({
    editData: Object,
    default: null
})
/* ------------------------------------------
   STATE
------------------------------------------ */
const loading = ref(false)
const submitted = ref(false)
const route = useRoute()
const userStorage = useStorage('user', {})
const isEdit = computed(() => !!route.params.id)
const headingText = computed(() =>
  isEdit.value ? 'Edit User' : 'Add User'
)
/* ------------------------------------------
   FORM DEFAULT
------------------------------------------ */
function getDefaultForm() {
  return {
    username: '',
    fullname: '',
    company: '',
    email: '',
    altemail: '',
    phone: '',
    cell: '',
    password: '',
    address: '',
    role: null
  }
}

const form = ref(getDefaultForm())
const roles = [
    { label: 'Admin', value: 'Admin' },
    { label: 'User', value: 'User' }
]

const baseFields = [
  { label: 'User Name', key: 'username', type: InputText, required: true },
  { label: 'Full Name', key: 'fullname', type: InputText, required: true },
  { label: 'Company', key: 'company', type: InputText, required: true },
  { label: 'Email', key: 'email', type: InputText, required: true },
  { label: 'Alternate Email', key: 'altemail', type: InputText },
  { label: 'Phone', key: 'phone', type: InputText, required: true },
  { label: 'Cell Phone', key: 'cell', type: InputText },
  { label: 'Password', key: 'password', type: Password, required: true },
  { label: 'Address', key: 'address', type: Textarea, rows: 3 },
  {
    label: 'Security Role',
    key: 'role',
    type: Dropdown,
    required: true,
    options: roles
  }
]

const computedFields = computed(() => {
  return baseFields.map(f => {
    if (isEdit.value) {

      // disable restricted fields
      if (['username', 'company', 'email', 'address'].includes(f.key)) {
        return { ...f, disabled: true }
      }

      // password optional
      if (f.key === 'password') {
        return { ...f, required: false }
      }
    }
    return f
  })
})
/* ------------------------------------------
   FILL FORM (EDIT MODE)
------------------------------------------ */
function fillForm(data) {
  form.value = {
    username: data.username || '',
    fullname: data.fullName || '',
    company: data.company_name || '',
    email: data.emailAddress || '',
    altemail: data.alternateEmailAddress || '',
    phone: data.phone || '',
    cell: data.cellPhone || '',
    password: '',
    address: data.address || '',
    role: data.SecurityLevel || null
  }
}
onMounted(() => {
  // if (isEdit.value) { fillForm(userStorage.value) }
   if (isEdit.value) { fetchUser() }
})
watch(
  () => props.editData,
  val => {
    if (val) fillForm(val)
  }
)
async function fetchUser() {
  loading.value = true
  try {
    const res = await getUserByIdApi(route.params.id)

    if (res.status >= 400) {
      showError(res.data)
      return
    }

    if (res.data?.message) {
      fillForm(res.data.message)
    }

  } catch {
    showNetworkError()
  } finally {
    loading.value = false
  }
}
/* ------------------------------------------
   RESET
------------------------------------------ */
function reset() {
  submitted.value = false
  form.value = getDefaultForm()
}
/* ------------------------------------------
   BUILD PAYLOAD
------------------------------------------ */
function buildPayload() {
  const payload = {
    id: route.params.id,
    username: form.value.username,
    fullName: form.value.fullname,
    email: form.value.email,
    altemail: form.value.altemail,
    phone: form.value.phone,
    cellphone: form.value.cell,
    security_Level: form.value.role,
    billingaddressPart1: form.value.address,
    company_name: form.value.company,
  }
  if (!isEdit.value || form.value.password) {
    payload.password = form.value.password
  }
  return payload
}
/* ------------------------------------------
   VALIDATION
------------------------------------------ */
function validate() {
  return computedFields.value.some(f => {
    return f.required && !form.value[f.key]
  })
}
/* ------------------------------------------
   SUBMIT
------------------------------------------ */
function submit() {
  submitted.value = true
  if (validate()) return

  if (isEdit.value) updateUser()
  else createUser()
}
/* ------------------------------------------
   CREATE USER
------------------------------------------ */
async function createUser() {
  loading.value = true
  try {
    const res = await addUserApi(buildPayload())
    if (res.status >= 400) {
      showError(res.data)
      return
    }
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: res.data?.message || 'User added successfully',
      life: 3000
    })
    reset()
  } catch {
    showNetworkError()
  } finally {
    loading.value = false
  }
}
/* ------------------------------------------
   UPDATE USER
------------------------------------------ */
async function updateUser() {
  loading.value = true
  try {
    const res = await updateUserApi(
      route.params.id,
      buildPayload()
    )
    if (res.status >= 400) {
      showError(res.data)
      return
    }
    toast.add({
      severity: 'success',
      summary: 'Updated',
      detail: res.data?.message || 'User updated successfully',
      life: 3000
    })
  } catch {
    showNetworkError()
  } finally {
    loading.value = false
  }
}
/* ------------------------------------------
   ERROR HANDLING
------------------------------------------ */
function showError(res) {
  toast.add({
    severity: 'error',
    summary: 'Error',
    detail: res?.message || 'Something went wrong',
    life: 4000
  })
}
function showNetworkError() {
  toast.add({
    severity: 'error',
    summary: 'Network Error',
    detail: 'Unable to connect server',
    life: 4000
  })
}
</script>

<style scoped>
.wrapper { display: flex; justify-content: center; }
.panel { width: 100%; max-width: 520px; }
.heading { font-size: 22px; color: #0b4a82; margin-bottom: 10px; }
.form-container { border: 1px solid #cfd4dc; padding: 18px 20px; background: #fff; }
.row { display: grid; grid-template-columns: 150px 1fr; align-items: center; margin-bottom: 14px; }
.label { text-align: left; font-size: 14px; color: #4b5f73; }
.full-input { width: 100%; height: 34px; }
.p-inputtextarea { min-height: 70px; }
.err { display: block; color: #d93025; font-size: 12px; margin-top: 4px; }
.btn-row { display: flex; justify-content: flex-end; gap: 10px; margin-top: 18px; }
.btn {
    border: none;
    padding: 7px 16px;
    color: #fff;
    cursor: pointer;
    border-radius: 3px;
    font-size: 14px;
}
.cancel { background: #5a6268; }
.save { background: #4caf50; }

/* Tablet */
@media (max-width: 900px) {
    .wrapper { padding: 20px; }
    .panel { max-width: 100%; }
}
/* Mobile */
@media (max-width: 600px) {
    .wrapper { display: block; }
    .row { grid-template-columns: 1fr; gap: 6px; margin-bottom: 18px; }
    .label { font-weight: 500; font-size: 13px; }
    .full-input { height: 38px; }
    .p-inputtextarea { min-height: 90px; }
    .btn-row { justify-content: space-between; }
    .btn { flex: 1; }
}
.p-inputtext,
.p-password,
.p-dropdown,
.p-inputtextarea { width: 100%; box-sizing: border-box; }
.spinner {
    width: 14px;
    height: 14px;
    border: 2px solid white;
    border-top: 2px solid transparent;
    border-radius: 50%;
    display: inline-block;
    margin-right: 6px;
    animation: spin 0.6s linear infinite;
}
@keyframes spin {
    to { transform: rotate(360deg); }
}
.btn:disabled { opacity: .7; cursor: not-allowed; }
</style>
