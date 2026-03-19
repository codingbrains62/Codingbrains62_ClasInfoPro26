<template>
  <div class="contact-wrapper">
   <h2 class="contact-heading">Contact us</h2>
    <Card class="contact-card">
      <template #title>
         <div class="title-blocks text-center">
            <p class="title-text">
              Have a question for us? Maybe some feedback? We love talking to users about CLASInfo PRO.
            </p>
            <p class="title-text">
              Send us a note and we'll get back to you as soon as possible.
            </p>
            <p class="title-text"><span class="required-note">
              * </span>Indicates required field
            </p>
         </div>
      </template>

      <template #content>
        <form @submit.prevent="handleSubmit" class="p-fluid form-center">

          <!-- Row 1: Name + Email -->
      <div class="row-two">
          <div class="field-half">
            <label>Name <span class="required-note">*</span></label>
            <InputText
              v-model="form.fullname"
              placeholder="Enter Name"
              :class="{ 'p-invalid': errors.fullname }"
              class="w-full"
            />
            <small v-if="errors.fullname" class="p-error">{{ errors.fullname }}</small>
          </div>

          <div class="field-half">
            <label>Email <span class="required-note">*</span></label>
            <InputText
              v-model="form.email"
              placeholder="Enter Email"
              :class="{ 'p-invalid': errors.email }"
              class="w-full"
            />
            <small v-if="errors.email" class="p-error">{{ errors.email }}</small>
          </div>
      </div>

          <!-- Comments -->
          <div class="grid justify-content-center mb-3">
            <div class="col-12 md:col-10">
              <label>Comments <span class="required-note">*</span></label>
              <Textarea
                v-model="form.comments"
                rows="6"
                autoResize
                placeholder="Tell us what you think..."
                :class="{ 'p-invalid': errors.comments }"
                class="w-full"
              />
              <small v-if="errors.comments" class="p-error">{{ errors.comments }}</small>
            </div>
          </div>

          <!-- Submit -->
          <div class="grid justify-content-center">
            <div class="col-12 md:col-10">
              <Button
                type="submit"
                label="Submit"
                class="w-full submit-contact"
                :loading="loading"
              />
            </div>
          </div>
        </form>
      </template>
    </Card>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from "vue";
import { useToast } from "primevue/usetoast";
import InputText from "primevue/inputtext";
import Textarea from "primevue/textarea";
import Button from "primevue/button";
import Card from "primevue/card";
import { contactApi, getUserDetailsApi } from "@/services/contact.service";

const toast = useToast();
const loading = ref(false);

const form = reactive({
  fullname: "",
  email: "",
  comments: ""
});

const errors = reactive({
  fullname: null,
  email: null,
  comments: null
});

function validate() {
  errors.fullname = !form.fullname ? "Please enter name" : null;

  if (!form.email) {
    errors.email = "Please enter email address";
  } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
    errors.email = "Please enter valid email address";
  } else {
    errors.email = null;
  }

  errors.comments = !form.comments ? "Please enter comments" : null;

  return !errors.fullname && !errors.email && !errors.comments;
}

async function handleSubmit() {
  if (!validate()) return;

  try {
    loading.value = true;

    const { data, error } = await contactApi({
      name: form.fullname,
      email: form.email,
      comments: form.comments
    });

    if (error) throw new Error(error.message || "Server error");

    if (data.status_code === 200) {
      toast.add({ severity: "success", summary: "Success", detail: data.message, life: 3000 });

      form.fullname = "";
      form.email = "";
      form.comments = "";
    } else {
      toast.add({ severity: "error", summary: "Error", detail: data.message || "Something went wrong", life: 3000 });
    }
  } catch (err) {
    toast.add({ severity: "error", summary: "Error", detail: err.message || "Server error", life: 3000 });
  } finally {
    loading.value = false;
  }
}

onMounted(async () => {
  const userid = localStorage.getItem("userid");
  if (!userid) return;

  try {
    const { data, error } = await getUserDetailsApi({ id: userid });
    if (!error && data.record?.status_code === 200) {
      const user = data.record.message;
      form.fullname = user.fullName;
      form.email = user.emailAddress;
    }
  } catch (err) {
    console.log(err);
  }
});
</script>

<style scoped>
.contact-wrapper {
  max-width: 100%;
  margin: auto;
  padding: 0 10px;
  box-sizing: border-box;
}
.contact-heading {
  text-align: center;
  color: #003e77;
  font-size: 2rem;
  font-weight: 500;
  margin-bottom: 7px;
  margin-top: 5px;
}
.contact-card {
  width: 100%;
  max-width: 1200px;
  min-width: 320px;
  margin: 0 auto;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.25s ease;
  background-color: #fff;
}

.contact-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.15);
}
.text-center {
  text-align: center;
}
.title-blocks {
  text-align: center;
  margin-bottom: 10px;
  color: #717171;
  font-weight: 400;
}

.title-text {
  margin: 5px 0;
  font-size: 18px;
  /* line-height: 1.5; */
}
/* Red color for required note */
.required-note {
  color: red;
  font-weight: 400;
}
.form-center {
  max-width: 900px;
  margin: 0 auto;
}
label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
}
.row-two {
  display: flex;
  gap: 20px;
  margin-bottom: 10px;
}

.field-half {
  flex: 1;
}


.submit-contact {
  background: #80c342 !important;
}

.submit-contact:hover {
  background: #003e77 !important;
}
/* Mobile responsive */
@media (max-width: 768px) {
  .row-two {
    flex-direction: column;
  }
}
</style>