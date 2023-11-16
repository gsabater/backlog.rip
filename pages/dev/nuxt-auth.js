//+-------------------------------------------------
// Nota
// Este es el codigo modificado del plugin nuxt-sanctum-auth
// por si se actualiza y reemplaza el que hay en node_modules
// -----
// ./node_modules\nuxt-sanctum-auth\dist\runtime\plugin.mjs
// -----
// Created on Tue Mar 21 2023
//+-------------------------------------------------

import { defineNuxtPlugin, addRouteMiddleware, useState, useRuntimeConfig, useCookie } from '#app'
// import { ofetch } from "ofetch";
// export default defineNuxtPlugin(async () => {
//   const auth = useState("auth", () => {
//     return {
//       user: null,
//       loggedIn: false
//     };
//   });
//   const config = useRuntimeConfig().nuxtSanctumAuth;
//   addRouteMiddleware("auth", async () => {
//     await getUser();
//     if (auth.value.loggedIn === false) {
//       return config.redirects.login;
//     }
//   });
//   addRouteMiddleware("guest", async () => {
//     await getUser();
//     if (auth.value.loggedIn) {
//       return config.redirects.home;
//     }
//   });
//   const apiFetch = ofetch.create({
//     baseURL: config.baseUrl,
//     // credentials: "include",
//     headers: {
//       Accept: "application/json",
//       Authorization: `${useCookie("auth._token.local").value}`,
//       // "X-XSRF-TOKEN": useCookie("XSRF-TOKEN").value
//     }
//   });
//   const csrf = async () => {
//     await ofetch(config.endpoints.csrf, {
//       baseURL: config.baseUrl,
//       // credentials: "include",
//       method: "GET",
//       headers: {
//         Accept: "application/json"
//       }
//     });
//   };
//   const getUser = async () => {
//     if (auth.value.loggedIn && auth.value.user) {
//       return auth.value.user;
//     }
//     try {
//       const user = await apiFetch(config.endpoints.user);
//       if (user) {
//         auth.value.loggedIn = true;
//         auth.value.user = user;
//         return user;
//       }
//     } catch (error) {
//     }
//   };
//   const login = async (data, callback) => {
//     await csrf();
//     try {
//       const response = await apiFetch(config.endpoints.login, {
//         method: "POST",
//         body: JSON.stringify(data),
//         headers: {
//           Accept: "application/json",
//           // "X-XSRF-TOKEN": useCookie("XSRF-TOKEN").value
//         }
//       });
//       if (callback !== void 0) {
//         callback(response);
//         return;
//       }
//       window.location.replace(config.redirects.home);
//     } catch (error) {
//       throw error.data;
//     }
//   };
//   const logout = async (callback) => {
//     try {
//       const response = await apiFetch(config.endpoints.logout, {
//         method: "POST"
//       });
//       if (callback !== void 0) {
//         callback(response);
//         return;
//       }
//       window.location.replace(config.redirects.logout);
//     } catch (error) {
//       console.log(error);
//     } finally {
//       auth.value.loggedIn = false;
//       auth.value.user = null;
//     }
//   };
//   return {
//     provide: {
//       apiFetch,
//       csrf,
//       sanctumAuth: {
//         login,
//         getUser,
//         logout
//       }
//     }
//   };
// });

// export default defineNuxtPlugin(async () => {
//   const auth = useState('auth', () => {
//     return {
//       user: null,
//       loggedIn: false,
//       test1: 'test1',
//     }
//   })

//   return {
//     provide: {
//       // tabler: tabler,
//     },
//   }
// })

export default defineNuxtPlugin(() => {})
