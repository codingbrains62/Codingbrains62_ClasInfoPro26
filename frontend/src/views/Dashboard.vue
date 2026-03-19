<template>
 <!-- <Button v-if="user" label="Enable Passkey for login" @click="registerPasskey" /> -->
  <div class="dashboard-wrapper">
    <div>
      <h1 class="heading">Welcome back, {{ username }}!</h1>
      <p class="subtext">
        CLAS offers free training for all of our online solutions. If you would like to schedule a training session
        either individually or for a group at your organization, please contact us at
        <b>(800) 952-5696</b> or by email at
        <a href="mailto:connect@clasinfo.com">connect@clasinfo.com</a>.
      </p>
    </div>
 
    <div class="grid">
      <CardItem title="Place an Order" :img="logo" link="/placeorder"
        description="Access our straightforward online ordering form to initiate a new service request with CLAS. You will receive email confirmation after submitting your order. A Service Representative will contact you if any additional information is needed to proceed." />
 
      <CardItem title="Access Your CLAS Infobox" :img="logo" link="/cipinfobox"
        description="Order management made easy. Your CLAS InfoBox is a self-service client portal that allows you to conveniently track service requests, retrieve completed orders and filing evidence, view historical invoices and more. Available online 24 hours a day." />
 
      <CardItem title="Perform a UCC Search" :img="diysearch"
        link="http://searching.clasinfo.com/passthru?vtech=null&vtget=null" external
        description="Through the DIY Search™ system, enjoy anytime, anywhere access to perform UCC and lien searches using the most accurate and current state data available. Flexible search logic enables you to identify name variations and uncover difficult to locate liens." />
 
      <CardItem title="Access UCCeZFILE® PRO" :img="uccfile"
        link="http://www.uccezfile.com/passthru?vtech=null&vtget=null" external
        description="Prepare UCC Financing Statements, Amendments and Fixture Filings and submit them electronically in hundreds of state and county jurisdictions nationwide. Our industry leading continuation management tools ensure you never miss another continuation." />
 
      <CardItem title="Access EntityTrak" :img="entitytrak"
        link="http://entitytrak.clasinfo.com/passthru?vtech=null&vtget=null" external
        description="Seamlessly manage the lifecycle of your business entities from inception to termination. Stay organized and up to date with 24/7 access to detailed entity profiles, organizational charts, calendars, filed documents, officer and director information and more." />
 
      <CardItem title="Pay an Invoice" :img="logo" link="https://clasinfopro.clasinfo.com/paymentcenter" external
        description="Quickly and easily pay your CLAS invoices from a single secure website. Have your invoices handy; you will need your CLAS account number and invoice number in order to pay online. To make a partial payment, contact the CLAS Accounting Department." />
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, computed } from 'vue'
import { useToast } from 'primevue/usetoast'
import { startRegistration } from '@simplewebauthn/browser'
import { getPasskeyOptions, verifyPasskey } from '@/services/passkey.service'
import { useAuth } from '@/composables/useAuth'
import Button from 'primevue/button'

import CardItem from '../components/CardItem.vue'
import logo from '@/assets/images/clas-logo.jpg'
import diysearch from '@/assets/images/diysearch.png'
import uccfile from '@/assets/images/ucc-file.png'
import entitytrak from '@/assets/images/entitytrak.png'

const toast = useToast()
const { user } = useAuth()
const username = computed(() => user.value.username || user.value?.emailAddress || 'User')

onMounted(() => {
  const toastData = JSON.parse(localStorage.getItem('toast') || 'null')
  if (toastData) {
    toast.add(toastData)
    localStorage.removeItem('toast')
  }
})
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

</script>
<style scoped>
.dashboard-wrapper { padding: 20px 25px; }
.header { text-align: center; margin-bottom: 30px;}
.heading { text-align: center; font-size: 34px; font-weight: 700; margin-bottom: 10px; }
.subtext { text-align: center; margin: 10px auto; line-height: 1.6; color: #444; }
.grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; }
 
@media (max-width: 900px) {
  .grid {grid-template-columns: 1fr;}
}
</style>