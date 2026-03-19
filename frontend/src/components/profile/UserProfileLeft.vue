<template>
    <div class="col-12 md:col-5">
        <div class="card profile-card">
        <h2 class="section-title">User Profile</h2>
            <div class="form-box">
                <div class="field" v-for="f in fields" :key="f.key" >
                    <label>{{ f.label }}</label>
                    <InputText :value="selectedUser?.[f.key] || ''" disabled class="full" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import InputText from 'primevue/inputtext'

defineProps({
selectedUser:Object,
fields:Array
})
</script>

<style scoped>
.card{background:#fff;border-radius:8px;padding:24px;box-shadow:0 2px 6px rgba(0,0,0,0.08)}
.section-title{color:#0b4a82;margin-bottom:18px;font-weight:600;line-height:1.2}
.form-box{border:1px solid #dcdfe6;padding:20px}
.field{display:grid;grid-template-columns:150px 1fr;align-items:center;margin-bottom:16px}
label{margin:0;padding-right:14px;text-align:right;color:#5f7286;font-size:14px}
.full .p-inputtext,
.p-inputtext.full{width:100%;height:36px}

@media(max-width:992px){
.field{grid-template-columns:1fr}
label{text-align:left;margin-bottom:6px;padding-right:0}
}

@media(max-width:576px){
.card{padding:16px}
.form-box{padding:14px}
}
</style>