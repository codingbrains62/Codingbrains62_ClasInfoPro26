<template>
  <div class="terms-wrapper">
    <div class="terms-container">
      <h2 class="page-title">Terms of Service</h2>

      <Card class="content-card">
        <template #content>

          <p>
            CLAS Information Services (“CLAS”) welcomes you to its website:
            cip.clasinfo.com (the “Website”). By use of the Website, you agree
            to the following Terms and Conditions of Use.
          </p>

          <Divider />

          <h4>Privacy Policy</h4>
          <p>
            You acknowledge that CLAS has established a Privacy Policy...
          </p>

          <ul>
            <li>CLAS may collect personally identifiable data about you.</li>
            <li>You may opt-out of notifications.</li>
            <li>CLAS may change the Privacy Policy anytime.</li>
          </ul>

          <Divider />

          <h4>Distribution of Personally Identifiable Data</h4>
          <p>
            Circumstances may arise where we are required to disclose...
          </p>

          <Divider />

          <h4>Disclaimer of Warranties</h4>
          <p class="uppercase-text">
            THE WEBSITE IS PROVIDED “AS IS”, WITHOUT ANY WARRANTY...
          </p>

          <Divider />

          <h4>Limitation of Liability</h4>
          <p class="uppercase-text">
            CLAS WILL NOT BE LIABLE FOR LOSS, COST, DAMAGE OR EXPENSE...
          </p>

          <Divider />

          <h4>Termination</h4>
          <p>
            CLAS may cancel or terminate your right to use the Website at any time.
          </p>

        </template>
      </Card>
    </div>
  </div>
</template>

<script setup>
// No axios needed here unless content comes from API
</script>

<style scoped>
.terms-wrapper {
  padding: 60px 20px;
  background: #f8f9fa;
  min-height: 100vh;
}

.terms-container {
  max-width: 1100px;
  margin: auto;
}

.page-title {
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 30px;
}

.content-card {
  padding: 10px;
}

h4 {
  margin-top: 25px;
  font-weight: 600;
}

p {
  line-height: 1.6;
  margin-bottom: 12px;
}

ul {
  padding-left: 20px;
  margin-bottom: 15px;
}

.uppercase-text {
  font-weight: 600;
}
</style>