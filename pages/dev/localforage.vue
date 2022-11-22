<template>
  <section>
    <h1>DEV - Localforage</h1>
    <p>This page will be displayed at the /about route.</p>
    <button @click="checkIndexedDB">Check indexeddb</button>
    <button @click="initConfig">NO initconfig</button>
    <button @click="initDB">NO InitDB</button>
    <button @click="addData">addData</button>
    <button @click="loadData">loadData</button>
    <button @click="makeUUID">uuid</button>
    <div>
      we are
      <pre>{{ ui.isDone }}</pre>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import localforage from 'localforage'
import { v4 as uuidv4 } from 'uuid';


let ui = ref({
  isDone: false
})

var stores = {
  config: localforage.createInstance({
    driver: localforage.INDEXEDDB,
    name: 'backlog.rip',
    storeName: 'config',
  }),

  games: localforage.createInstance({
    driver: localforage.INDEXEDDB,
    name: 'backlog.rip',
    storeName: 'games',
  })
}

// https://web.dev/indexeddb/
let checkIndexedDB = () => {
  if (!window.indexedDB) {
    alert('Your browser doesn\'t support a stable version of IndexedDB. Such and such feature will not be available.')
  } else {
    alert('Your browser supports a stable version of IndexedDB.')
  }
}

let initConfig = () => {
  // localforage.config({
  //   driver: localforage.INDEXEDDB,
  //   name: 'backlog',
  //   storeName: 'keyvaluepairs',
  //   description: 'some description'
  // })
}

let initDB = () => {
  // var store = localforage.createInstance({
  //   name: "nameHere"
  // });

  // var tableOne = localforage.createInstance({
  //   name: 'backlog',
  //   storeName: 'tableOne',
  //   description: '...'
  // });

  // ui.isDone = true

  // console.warn(tableOne)
}

let addData = () => {

  // localforage.config({
  //   name: 'Hipster PDA App'
  // });

  var time = new Date().getTime();

  stores.games.setItem('somekeyz' + time, 'some valuez' + time).then(function (value) {
    // Do other things once the value has been saved.
    console.log(value);
  }).catch(function (err) {
    // This code runs if there were any errors
    console.log(err);
  });

  stores.config.setItem('pepe' + time, 'some valuez' + time).then(function (value) {
    // Do other things once the value has been saved.
    console.log(value);
  })
}

let loadData = () => {
  stores.config.keys().then(function (keys) {
    // An array of all the key names.
    console.log(keys);
  }).catch(function (err) {
    // This code runs if there were any errors
    console.log(err);
  });
}

let makeUUID = () => {
  console.log(uuidv4())
}

// console.log('localforage is: ', localforage);
</script>
