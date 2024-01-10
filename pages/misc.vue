<template>
  <fieldset>
    <legend>Add new friend</legend>
    <label>
      Name:
      <input v-model="friendName" type="text" />
    </label>
    <br />
    <label>
      Age:
      <input v-model="friendAge" type="number" />
    </label>
    <br />
    <button @click="addFriend">Add Friend</button>
    <p>{{ status }}</p>
  </fieldset>

  <hr />
  <pre>
    {{ friends }}
    <!-- <li v-for="friend in friends" :key="friend.key">
      {{ friend.name }}, {{ friend.age }}
    </li> -->
  </pre>
</template>

<script>
import { liveQuery } from 'dexie'
import { useObservable } from '@vueuse/rxjs'

export default {
  name: 'FriendAdder',
  props: {
    defaultAge: {
      type: Number,
      default: 21,
    },
  },
  // setup(_, context) {
  //   return {
  //     friends:
  //   }
  // },

  data: () => {
    return {
      status: '',
      friendName: '',
      friendAge: 21,
    }
  },

  computed: {
    friends() {
      if (!this.$db?.config) {
        console.warn(this.$db)
        return [
          {
            key: 'abc',
            name: 'xxx',
          },
        ]
      }
      return useObservable(
        liveQuery(() => {
          console.warn('liveQuery', this.$db.config.toArray())
          return this.$db.config.toArray()
        })
      )
    },
  },
  methods: {
    async addFriend() {
      try {
        // Add the new friend!
        const id = await this.$db.config.add({
          key: Math.random() * 1000,
          name: this.friendName,
          age: this.friendAge,
        })

        this.status = `Friend ${this.friendName}
          successfully added. Got id ${id}`

        // Reset form:
        this.friendName = ''
        this.friendAge = this.defaultAge
      } catch (error) {
        this.status = `Failed to add
          ${this.friendName}: ${error}`
      }
    },
  },
}
</script>
