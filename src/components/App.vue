<template>
  <div id="app">
    <AuthRegistration v-if="currentPath === '#/auth'" />
    
    <template v-else>
      <Home v-if="currentPath === '#/' || currentPath === ''" />
      
      <VoterRegistration v-else-if="currentPath === '#/voter-registration' || currentPath === '#/registration'" />
      
      <Vote v-else-if="currentPath === '#/vote'" />
      
      <Results v-else-if="currentPath === '#/results'" />
      
      <ValidatorTool v-else-if="currentPath === '#/validator-tool' || currentPath === '#/validator'" />
      
      <div v-else class="text-center mt-5">
        <div class="container">
          <h1 class="display-1">404</h1>
          <h4>Page Not Found</h4>
          <p>Requested path: {{ currentPath }}</p>
          <a href="#/" class="btn btn-primary">Return to Home</a>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import AuthRegistration from "./AuthRegistration.vue"; 
import Home from "./Home.vue";
import VoterRegistration from "./VoterRegistration.vue";
import Vote from "./Vote.vue";
import Results from "./Results.vue";
import ValidatorTool from "./ValidatorTool.vue";

// Initialize current path
const currentPath = ref(window.location.hash || '#/auth');

const checkRoute = () => {
  const hash = window.location.hash;
  const hasCommitment = localStorage.getItem("zktree-vote-commitment");

  // 1. Security Intercept: If no authentication data and not on the auth page, force redirect to auth page
  if (!hasCommitment && hash !== '#/auth') {
    window.location.hash = '#/auth';
    currentPath.value = '#/auth';
    return;
  }

  // 2. Update path state
  currentPath.value = hash || '#/';
};

onMounted(() => {
  // First entry: If no hash or no authentication, force redirect to auth
  const hasCommitment = localStorage.getItem("zktree-vote-commitment");
  if (!window.location.hash || !hasCommitment) {
    window.location.hash = '#/auth';
  }
  
  // Listen for Hash changes
  window.addEventListener("hashchange", checkRoute);
  // Execute initialization check
  checkRoute();
});

onUnmounted(() => {
  // Fix: Use the correct function name to remove the listener
  window.removeEventListener("hashchange", checkRoute);
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
