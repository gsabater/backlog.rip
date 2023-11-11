/*
 * @file:    \plugins\axios.js
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 29th October 2021
 * Modified: Fri Nov 10 2023
 */

import axios from 'axios'

export default defineNuxtPlugin((nuxtApp) => {
  let domain =
    process.env.NODE_ENV == 'development' ? 'https://api.backlog.rip' : 'https://api.backlog.rip'

  log('Axios domain set to: ', domain)

  const instance = axios.create({
    baseURL: domain,
    timeout: 60000,
    headers: {
      // accept: 'application/ld+json',
    },
  })

  // //+-------------------------------------------------
  // // interceptors.request
  // // Middleware before each request is made.
  // // Check if the request has already been cached.
  // // If it has, return the cached version with a throw response
  // // -----
  // // Created on Wed Nov 03 2021
  // //+-------------------------------------------------
  // instance.interceptors.request.use(
  //   (request) => {
  //     // Do not process requests in a blacklist
  //     // if (request.url.includes("users/")) return request;
  //     return request
  //   }
  //   //   (error) => {
  //   //     return error?.isCached ? Promise.resolve(error) : Promise.reject(error)
  //   //   }
  // )

  // //+-------------------------------------------------
  // // interceptors.response
  // // Middleware after a request is received.
  // // -----
  // // Created on Thu Mar 02 2023
  // //+-------------------------------------------------
  // instance.interceptors.response.use(
  //   function (response) {
  //     // Any status code that lie within the range of 2xx cause this function to trigger
  //     // Do something with response data
  //     return response
  //   },
  //   function (error) {
  //     console.error('🚨', error.response)
  //     if (error.response.data && error.response.data['hydra:description']) {
  //       if (
  //         error.response.data['hydra:description'].includes('Integrity constraint violation') ||
  //         error.response.data['hydra:description'].includes('no se puede eliminar')
  //       ) {
  //         notify.show({
  //           mode: 'dialog',
  //           type: 'error',
  //           title: 'Información',
  //           message:
  //             'No se ha podido eliminar. Este elemento está siendo utilizado por otros registros.',
  //           details: error.response.data['hydra:description'],
  //         })
  //       }
  //     }

  //     // Any status codes that falls outside the range of 2xx cause this function to trigger
  //     // Do something with response error
  //     return Promise.reject(error)
  //   }
  //   // if code == 401 and message is "Expired JWT Token"
  // )

  return {
    provide: {
      axios: instance,
    },
  }
})
