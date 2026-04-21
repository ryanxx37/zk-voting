<template>
  <main role="main" class="container">
    <div style="padding-top: 7rem" class="d-none d-lg-block"></div>
    <div class="row justify-content-md-center">
      <div class="col-lg-4">
        <div class="text-center vstack gap-3">
          <h1>ZK voting system</h1>
          <p class="text-muted">Phase 2: Blockchain Voting</p>
          <a href="#/registration" class="btn btn-primary"
            >Registration to vote</a> 
          <a href="#/validator" class="btn btn-primary">Validator tool</a>
          <a href="#/vote" class="btn btn-primary">Vote</a>
          <a href="#/results" class="btn btn-primary">Results</a>
          
        </div>
      </div>
    </div>
  </main>
</template>

<script lang="ts">
import { Component, Vue } from "vue-facing-decorator";

@Component
export default class Home extends Vue {}
</script>
