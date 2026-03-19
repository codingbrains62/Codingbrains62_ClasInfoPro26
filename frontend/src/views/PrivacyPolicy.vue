<template>
  <div class="privacy-wrapper">
    <div class="privacy-container">
      <h2 class="page-title">Privacy Policy</h2>

      <Card class="content-card">
        <template #content>

          <h5 class="effective-date">Effective June 24, 2014</h5>

          <p>
            Your privacy is important to us. This Privacy Policy explains our
            online information gathering, usage, storage and disclosure practices.
            This policy applies only to data collected through our website.
          </p>

          <Divider />

          <h4>Personally Identifiable Data We Collect and How We Use It</h4>

          <p>
            Our Website is not designed to automatically collect personally
            identifiable data from each visitor. In certain areas, we may ask
            you to provide information such as your name, company name, email
            address, postal address, and phone number.
          </p>

          <p>
            You may unsubscribe from newsletters anytime by emailing
            <a href="mailto:connect@clasinfo.com">
              connect@clasinfo.com
            </a>.
          </p>

          <Divider />

          <h4>How We Protect Your Personally Identifiable Data</h4>

          <p>
            We maintain reasonable physical and procedural safeguards to
            protect your data from misuse, unauthorized access, alteration,
            or destruction.
          </p>

          <p>
            However, no transmission method over the Internet is 100% secure.
            Unencrypted email communication may be intercepted.
          </p>

          <Divider />

          <h4>Who Has Access to Your Personally Identifiable Data?</h4>

          <h5>Initial Uses</h5>
          <p>
            We use your data to enhance your site visit, provide customer
            support, and notify you about products and services.
          </p>

          <h5>Protective Uses</h5>
          <p>
            We may disclose data if required by law or to protect our legal
            rights and business interests.
          </p>

          <h5>Disclosure in Corporate Transactions</h5>
          <p>
            In case of merger, acquisition, or asset sale, your data may be
            transferred subject to this Privacy Policy.
          </p>

          <h5>Disclosure to Agents</h5>
          <p>
            We may share data with trusted service providers who assist in
            business operations under strict confidentiality agreements.
          </p>

          <Divider />

          <h4>Privacy Policy Changes</h4>
          <p>
            We may update this Privacy Policy from time to time.
            Changes become effective immediately upon posting.
          </p>

          <Divider />

          <h4>How to Contact Us</h4>
          <p>
            For questions about our privacy practices, contact us at:
            <a href="mailto:connect@clasinfo.com">
              connect@clasinfo.com
            </a>
          </p>

        </template>
      </Card>
    </div>
  </div>
</template>

<script setup>
// No script logic needed for static page
</script>

<style scoped>
.privacy-wrapper {
  padding: 60px 20px;
  background: #f8f9fa;
  min-height: 100vh;
}

.privacy-container {
  max-width: 1100px;
  margin: auto;
}

.page-title {
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 30px;
}

.effective-date {
  font-weight: 600;
  margin-bottom: 15px;
}

.content-card {
  padding: 10px;
}

h4 {
  margin-top: 25px;
  font-weight: 600;
}

h5 {
  margin-top: 15px;
  font-weight: 600;
}

p {
  line-height: 1.6;
  margin-bottom: 12px;
}

a {
  color: #3b82f6;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}
</style>