/**
 * @project: certiapp-nuxt
 * @file:    axios.js
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 29th October 2021
 * Last Modified: Tue Feb 28 2023
 **/

import axios from "axios";

export default defineNuxtPlugin((nuxtApp) => {
  //+-------------------------------------------------
  // interceptors.request
  // Middleware before each request is made.
  // Check if the request has already been cached.
  // If it has, return the cached version with a throw response
  // -----
  // Created on Wed Nov 03 2021
  //+-------------------------------------------------
  axios.interceptors.request.use(
    (request) => {
      // Do not process requests in a blacklist
      if (request.url.includes("users/")) return request;
      if (request.url.includes("notificaciones")) return request;

      if (
        store.getters["offline/caching"] ||
        store.getters["offline/isOffline"]
      )
        console.log("🐇 New request", request.method, request);

      // While the application is offline
      // queue POST and DELETE requests made to the server
      if (store.getters["offline/isOffline"]) {
        if (["post", "patch", "delete"].indexOf(request.method) > -1) {
          console.warn("post", "patch", "delete", request);
          store.commit("offline/addToQueue", request);
          store.commit("offline/snapshot");
          throw { isQueued: true };
        }
      }

      return request;
    }
    //   (error) => {
    //     return error?.isCached ? Promise.resolve(error) : Promise.reject(error)
    //   }
  );

  // //+-------------------------------------------------
  // // interceptors.response
  // // Middleware after a request is received.
  // // Returns data and stores it in the cache.
  // // returns a cached version when isCached: true,
  // // -----
  // // Created on Wed Nov 03 2021
  // //+-------------------------------------------------
  axios.interceptors.response
    .use
    // (response) => {
    //   console.log('🐇 Response', response)
    //   // store.commit('offline/addToCache', {...response})
    //   return response
    // }
    // (payload) => {
    //   if (!payload) return
    //   if (payload.url) {
    //     console.warn('🚇 Loading cached data for ', payload.url, payload)
    //     return payload?.isCached ? Promise.resolve(payload) : Promise.reject(payload)
    //   }

    //   return Promise.reject(payload)
    // }
    ();

  axios.interceptors.response.use(
    (config) => {
      // Do something before request is sent
      return config;
    },
    async (error) => {
      console.info("🆙", error.response);
      console.info(error);

      // Do something with request error
      const response = error.response;
      if (!response) {
        return;
      }

      let message = response.data.error || response.data.message;
      const code = parseInt(error.response && error.response.status);

      // Login errors
      if (error.config.url == "/auth") {
        if (code == 401) {
          message = "Usuario o contraseña incorrectos";
        }

        if (code >= 500) {
          message = "Estamos realizando tareas de mantenimiento";
        }
        store.commit("notification/show", {
          color: "error",
          text: `${message}`,
          timeout: 4500,
        });
        return;
      }

      if (code === 400) {
        message =
          response.data?.error?.exception &&
          response.data?.error?.exception[0].message;
        if (message)
          store.commit("notification/show", {
            color: "error",
            text: `${message}`,
            timeout: 4500,
          });
      } else {
        if (route.path !== "/login") {
          console.warn(route.path);
          store.commit("notification/show", {
            color: "error",
            text: "Error en los datos enviados",
            timeout: 4500,
          });
        }
      }

      if (code === 403) {
        store.commit("notification/show", {
          color: "warning",
          text: `Su usario no dispone de suficientes permisos.`,
          timeout: 4500,
        });
        return new Promise(() => error);
      } else if (code !== 401)
        if (message) {
          store.commit("notification/show", {
            color: "error",
            text: `ERROR ${response.status}: ${message}`,
            timeout: 2500,
          });
        } else if (code === 401 && route.path !== "/login") {
          await app.$auth.logout();
          redirect("/login");
        }
      // return Promise.reject(error);
    }
  );

  // axios.onError(error => {
  //   const response = error.response;
  //   console.error('error.response', response);
  //   if (response.status !== 401) store.commit("notification/show", {color: 'error', text: `ERROR ${response.status}: ${response.data.message}`, timeout: 0})
  //   if (response.status === 401) app.router.replace('/login')
  // })

  return {
    provide: {
      axios: axios,
    },
  };
});
