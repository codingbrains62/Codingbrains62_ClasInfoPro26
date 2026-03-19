<template>
    <div class="col-12 md:col-7">
        <div class="card users-card">
            <div class="header-row">
            <h2 class="section-title"> ABC Company<br>users </h2>
                <div class="actions">
                    <a v-if="isAdmin" @click.prevent="$emit('addUser')" class="action" >
                        <i class="pi pi-plus"></i>
                        <span>Add user</span>
                    </a>
                    <a @click.prevent="$emit('editUser')" class="action" >
                        <i class="pi pi-pencil"></i>
                        <span>Edit user</span>
                    </a>
                    <a v-if="isAdmin" @click.prevent="$emit('toggleUser')" class="action" >
                        <i class="pi pi-user-minus"></i>
                        <span> {{ selectedUser?.isDisabled === 1 ? 'Disable user' : 'Enable user' }} </span>
                    </a>
                    <a v-if="isAdmin" class="action" >
                        <i class="pi pi-times"></i>
                        <span>Remove user</span>
                    </a>
                </div>
            </div>
            <div class="table-box">
                <InputText v-model="localSearch" placeholder="Search" class="search" />
                <div v-for="u in paginatedUsers" :key="u.id" class="user-row"
                    :class="{selected:selectedUser?.id===u.id}" @click="$emit('selectUser',u)" >
                    <span class="name">{{u.fullName}}</span>
                    <span class="status" :class="u.isDisabled===1?'active':'disabled'" >
                    {{u.isDisabled===1?'ACTIVE':'DISABLED'}}
                    </span>
                </div>
                <div v-if="filteredUsers.length > 5" class="pagination">
                    <button class="pg" @click="prevPage">‹</button>
                    <button  v-for="p in totalPages" :key="p" class="pg" :class="{ active: p === currentPage }" @click="currentPage = p">
                        {{ p }}
                    </button>
                    <button class="pg" @click="nextPage">›</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import InputText from 'primevue/inputtext'
const props = defineProps({
users:Array,
selectedUser:Object,
filteredUsers:Array,
search:String,
isAdmin:Boolean
})
const emit = defineEmits([
'selectUser',
'toggleUser',
'addUser',
'editUser',
'updateSearch'
])
const localSearch = ref(props.search)
watch(localSearch,(v)=>{
emit('updateSearch', v)
})

/* -------------------------
   PAGINATION LOGIC
-------------------------- */
const currentPage = ref(1)
const perPage = 5
const totalPages = computed(() =>
  Math.ceil(props.filteredUsers.length / perPage)
)
const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * perPage
  return props.filteredUsers.slice(start, start + perPage)
})
const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++
}
const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--
}
watch(() => props.filteredUsers, () => {
  currentPage.value = 1
})
</script>

<style scoped>
.card{background:#fff;border-radius:8px;padding:24px;box-shadow:0 2px 6px rgba(0,0,0,0.08)}
.section-title{color:#0b4a82;margin-bottom:18px;font-weight:600;line-height:1.2}
.table-box{border:1px solid #dcdfe6;padding:20px}
.users-card .header-row{display:flex;justify-content:space-between;align-items:center}
.actions{display:flex;gap:34px}
.action{color:#1a73e8;font-size:13px;cursor:pointer;display:flex;flex-direction:column;align-items:center}
.action i{font-size:18px;margin-bottom:3px}
.search{width:100%;height:36px;margin-bottom:22px}

.user-row{
display:flex;
justify-content:space-between;
align-items:center;
padding:12px 14px;
border-bottom:1px solid #e2e6ea;
cursor:pointer;
transition:.2s
}

.user-row:hover{background:#f3f6f9}
.user-row.selected{background:#d8ebe3}
.name{font-size:18px;color:#2c3e50}
.status{ font-size:18px; font-weight:600; padding:3px 8px; border-radius:10px }
.status.active{ background:#e6f7ec; color:#1e9e50 }
.status.disabled{ background:#eeeeee; color:#7a7a7a }
.pagination{ display:flex; justify-content:center; gap:6px }
.pg{ border:1px solid #cfd4dc; background:white; padding:6px 12px; cursor:pointer }
.pg.active{ background:#1a73e8; color:white; border-color:#1a73e8 }

@media(max-width:576px){
.card{padding:16px}
.table-box{padding:14px}
.actions{ flex-wrap:wrap; gap:16px; justify-content:flex-start }
.action{ flex-direction:row; gap:6px; font-size:12px }
.action i{margin-bottom:0}
.section-title{font-size:18px}
}
</style>