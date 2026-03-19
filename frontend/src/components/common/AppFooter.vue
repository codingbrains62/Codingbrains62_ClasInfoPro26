<template>
  <footer class="page-footer">

    <div class="footer-left">
      <small class="copy"> Copyright © {{ currentYear }}
          <a href="https://clasinfo.com" target="_blank" class="brand"> CLAS Information Services </a>.
          All rights reserved.
      </small>
    </div>

    <div class="footer-nav">
      <RouterLink to="/contact" class="footer-link">
        Contact <span class="hide-sm">us</span>
      </RouterLink>

      <RouterLink to="/terms" class="footer-link">
        Terms <span class="hide-sm">of use</span>
      </RouterLink>

      <RouterLink to="/privacypolicy" class="footer-link">
        Privacy <span class="hide-sm">policy</span>
      </RouterLink>
    </div>

  </footer>
</template>
<script setup>
  const currentYear = new Date().getFullYear()
</script>
<style scoped>
.page-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  font-size: 13px;
  background: #f8f9fa;
  border-top: 1px solid #e5e7eb;
}
.footer-left {
  display: flex;
  align-items: center;
}
.footer-nav {
  display: flex;
  gap: 20px;
  align-items: center;
}
.footer-link {
  color: #0d6efd;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease, transform 0.2s ease;
}
.footer-link:hover {
  color: #084298;
  transform: translateY(-1px);
}
.copy {
  color: #6c757d;
  font-size: 13px !important;
}
.brand {
  color: #0d6efd;
  text-decoration: none;
  font-weight: 500;
}
.brand:hover {
  text-decoration: underline;
}

@media (max-width: 768px) {
  .page-footer {
    flex-direction: column-reverse;
    gap: 10px;
    text-align: center;
  }
  .footer-nav {
    flex-wrap: wrap;
    justify-content: center;
    gap: 12px;
  }
}
@media (max-width: 576px) {
  .hide-sm {
    display: none;
  }
}
</style>