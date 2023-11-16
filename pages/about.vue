<template>
  <section>
    <p>This page will be displayed at the /about route.</p>
    <hr>
    <div>
    Is user logged in?
    <sapn>{{ loggedIn ? 'yes' : 'no' }}</sapn>
  </div>
  <div v-if="loggedIn">
    What is users name?
    <sapn>{{ user.name || user.nombre }}</sapn>
  </div>
  <pre>
    {{ pep }}
  </pre>
  <v-btn @click="getUser">dasdsa</v-btn>
  </section>
</template>

<script setup>
const { $sanctumAuth } = useNuxtApp()
const { user, loggedIn } = useState('auth').value
const pep = useState('auth').value

const getUser = async () => {
  let pepe = await $sanctumAuth.getUser()
  console.warn(pepe)
}
</script>
