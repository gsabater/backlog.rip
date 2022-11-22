<template>
  <section>
    <h1>DEV - Pinia</h1>
    <p>This page will be displayed at the /about route.</p>

    <p>
      Message: {{ testStore.message }}<br>
      upper: {{ testStore.upper }}

      <button @click="testStore.setMessage('hryy')">change</button>
    </p>
    <pre>
    <!-- {{ testStore }} -->
    </pre>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useTestStore } from '~/stores/TestStore'

const testStore = useTestStore()
</script>
