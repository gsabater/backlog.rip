/* __placeholder__ */
export default (await import('vue')).defineComponent({
name: 'Games Browser',
components: {},

props: {
items: {
type: Array,
default: () => [
'dwdqwd', 'dwdqwd',
],
},
},

data() {
return {};
},

computed: {
elements() {
return this.items
.sort((a, b) => b.playtime_forever - a.playtime_forever)
.map((item) => ({
...item,
import: true,
}))
.slice(0, 10);
},
},

methods: {},
});
