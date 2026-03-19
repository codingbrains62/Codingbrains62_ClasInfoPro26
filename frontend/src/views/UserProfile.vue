<template>
    <div class="page">
        <div class="pageone">

            <ProfileLeft 
              :selectedUser="selectedUser" 
              :fields="fields" 
            />

            <ProfileRight
              :users="users"
              :selectedUser="selectedUser"
              :filteredUsers="filteredUsers"
              :search="search"
              :isAdmin="isAdmin"
              @selectUser="selectUser"
              @toggleUser="toggleUser"
              @addUser="goToAddUser"
              @editUser="goToEditUser"
              @updateSearch="search = $event"
            />

        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useStorage } from '@vueuse/core'
import ProfileLeft from "@/components/profile/UserProfileLeft.vue"
import ProfileRight from "@/components/profile/UserProfileRight.vue"
import { getUsersApi, userStatusApi, showProfileApi } from "@/services/userService";
import { useToast } from "primevue/usetoast"
import Toast from "primevue/toast"

const user = useStorage('user', {})
const router = useRouter()
const route = useRoute()
const toast = useToast()
const users = ref([])
const selectedUser = ref(null)
const search = ref("")
const isAdmin = computed(() =>
  user.value?.securityLevel === "Admin"
)

watch(
  () => route.fullPath,
  async () => {
    await loadUsers()

    if (users.value.length) {
      selectUser(users.value[0])
    }
  }
)

/* -------------------------
   LOAD USERS FROM DB
-------------------------- */
const loadUsers = async () => {
  try {
    const res = await getUsersApi()
    if (res?.data?.data) {
      users.value = res.data.data.map(u => ({
        ...u,
        isDisabled: Number(u.isDisabled)
      }))
    } else {
      users.value = []
    }
  } catch {
    users.value = []
  }
}

onMounted(async () => {
  await loadUsers()

  if (users.value.length) {
    selectUser(users.value[0])
  }
})

const selectUser = async (u) => {

  try {
    const res = await showProfileApi(u.id)
    if (res.status === 200 && res.data?.message) {
      selectedUser.value = res.data.message
    }
  } catch {}
}
const filteredUsers = computed(() => {
  if (!search.value) return users.value
  return users.value.filter(u =>
    u.fullName.toLowerCase().includes(search.value.toLowerCase())
  )
})
const goToAddUser = () => {
  router.push({ name: 'adduser' })
}
const goToEditUser = () => {
  if (!selectedUser.value?.id) return
  router.push({
    name: 'edituser',
    params: { id: selectedUser.value.id }
  })
}
const toggleUser = async () => {
  if (!selectedUser.value?.id) return
  try {
    const res = await userStatusApi(selectedUser.value.id)
    if (res.status === 200 && res.data?.data) {
      const newValue = Number(res.data.data.isDisabled)
      const index = users.value.findIndex(
        u => u.id === selectedUser.value.id
      )
      if (index !== -1) {
        users.value[index].isDisabled = newValue
        selectedUser.value.isDisabled = newValue
      }
      toast.add({
        severity: "success",
        summary: "Success",
        detail: newValue === 1
          ? "User enabled successfully"
          : "User disabled successfully",
        life: 3000
      })
      await loadUsers()
    }
  } catch {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Something went wrong",
      life: 3000
    })
  }

}
const fields = [
  { label: "User Name", key: "username" },
  { label: "Full Name", key: "fullName" },
  { label: "Company", key: "company_name" },
  { label: "Email", key: "emailAddress" },
  { label: "Alternate Email", key: "alternateEmailAddress" },
  { label: "Phone", key: "phone" },
  { label: "Cell Phone", key: "cellPhone" },
  { label: "Address", key: "address" },
  { label: "Security Role", key: "SecurityLevel" }
]
</script>

<style scoped>
.page { padding: 30px; background: #f3f5f7; min-height: 100vh; }
.pageone { display: flex; align-items: flex-start; gap: 28px; }
.pageone>div:first-child { width: 520px; flex-shrink: 0; }
.pageone>div:last-child { flex: 1; }
@media (max-width:1200px){
.pageone>div:first-child{width:420px}
}

@media (max-width:992px){
.pageone{flex-direction:column;gap:22px}
.pageone>div:first-child,
.pageone>div:last-child{width:100%}
}

@media (max-width:576px){
.page{padding:16px}
}
</style>