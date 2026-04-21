<template>
  <main role="main" class="container">
    <div style="padding-top: 7rem" class="d-none d-lg-block"></div>
    <div class="row justify-content-md-center">
      <div class="col-lg-5">
        <div class="card shadow-sm">
          <div class="card-body p-5">
            <div class="text-center mb-4">
              <h1 class="h3 mb-3 fw-normal">Voter Authentication</h1>
              <p class="text-muted">Phase 1: Blockchain Registration</p>
            </div>

            <form @submit.prevent="handleSubmit">
              <div class="visually-hidden" aria-hidden="true">
                <input type="text" v-model="formData.hp_field" tabindex="-1" autocomplete="off" />
              </div>

              <div class="form-floating mb-3">
                <input type="text" class="form-control" id="name" placeholder="Full Name" 
                       v-model="formData.name" required>
                <label for="name">Full Name</label>
              </div>

              <div class="form-floating mb-3">
                <input type="date" class="form-control" id="dob" placeholder="Date of Birth" 
                       v-model="formData.dob" required>
                <label for="dob">Date of Birth</label>
              </div>

              <div class="form-floating mb-4">
                <input type="text" class="form-control" id="nationalId" placeholder="National ID" 
                       v-model="formData.nationalId" required>
                <label for="nationalId">National ID / ID Number</label>
              </div>

              <button class="w-100 btn btn-lg btn-primary" type="submit" :disabled="isLoading">
                <span v-if="isLoading" class="spinner-border spinner-border-sm" role="status"></span>
                {{ isLoading ? 'Processing...' : 'Verify & Register' }}
              </button>

              <div v-if="errorMessage" class="alert alert-danger mt-3 text-center mb-0" role="alert">
                {{ errorMessage }}
              </div>

              <div v-if="remainingAttempts !== null" class="text-center mt-2">
                <small :class="remainingAttempts <= 2 ? 'text-danger fw-bold' : 'text-muted'">
                  {{ remainingAttempts > 0 
                     ? `Remaining attempts: ${remainingAttempts}` 
                     : 'Account locked. Please wait 15 minutes.' }}
                </small>
              </div>
            </form>
          </div>
        </div>
        <p class="mt-5 mb-3 text-muted text-center">Ethereum ZK Voting System</p>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { generateCommitment } from "zk-merkle-tree"; 
import { mockBackendAuthenticationAndRegister } from "../services/authService";

const formData = ref({
  name: '',
  dob: '',
  nationalId: '',
  hp_field: '' 
});

const isLoading = ref(false);
const errorMessage = ref('');
const remainingAttempts = ref<number | null>(null);
let pageLoadTime = 0;

onMounted(() => {
  pageLoadTime = Date.now();
});

/**
 * XSS Protection: Strip potentially dangerous characters
 */
const sanitizeInput = (input: string) => {
  return input.replace(/[<>&"'`]/g, '');
};

const handleSubmit = async () => {
  errorMessage.value = '';
  remainingAttempts.value = null;

  // 1. Bot Defense: Honeypot check
  if (formData.value.hp_field !== '') {
    errorMessage.value = "Abnormal activity detected.";
    return;
  }

  // 2. Bot Defense: Speed check (minimum 2 seconds on page)
  if (Date.now() - pageLoadTime < 2000) {
    errorMessage.value = "Please slow down and try again.";
    return;
  }

  isLoading.value = true;

  try {
    const cleanData = {
      name: sanitizeInput(formData.value.name),
      dob: sanitizeInput(formData.value.dob),
      nationalId: sanitizeInput(formData.value.nationalId)
    };

    // Step 1: Generate ZK Identity Commitment
    const zkIdentity = await generateCommitment();

    // Step 2: Send credentials and commitment to backend
    const payload = {
      ...cleanData,
      commitment: zkIdentity.commitment
    };

    const response = await mockBackendAuthenticationAndRegister(payload);

    if (response.success) {
      // Save credentials locally for phase 2 (Voting)
      localStorage.setItem("zktree-vote-commitment", JSON.stringify(zkIdentity));
      alert("Success! Your eligibility is now registered on the blockchain.");
      
      // Navigate to Home
      window.location.hash = '#/'; 
    }
  } catch (error: any) {
    // Handle structured error from backend
    if (error.remaining !== undefined) {
        remainingAttempts.value = error.remaining;
        errorMessage.value = error.message;
    } else {
        errorMessage.value = error.message || "An unexpected error occurred.";
    }
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.container { max-width: 960px; }
.card { border: none; border-radius: 15px; }
.form-floating > .form-control:focus { z-index: 2; }
</style>