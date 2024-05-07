/*
 * @file:    \plugins\wowfactor.client.js
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 14th April 2024
 * Modified: Sat May 04 2024
 */

// import { preloadImages } from './utils.js'
import { gsap } from 'gsap'

const init = () => {
  const breakPoint = '53em'
  const mm = gsap.matchMedia()

  mm.add(
    {
      isDesktop: `(min-width: ${breakPoint})`,
      isMobile: `(max-width: ${breakPoint})`,
    },
    (context) => {
      let { isDesktop } = context.conditions

      const scene = document.querySelector('.scene')
      const image = document.querySelector('.xcard__img')
      const cardList = gsap.utils.toArray('.xcard')
      const count = cardList.length

      const sliceAngle = (2 * Math.PI) / count

      // Distance from the image center to the screen center.
      let radius = isDesktop ? 250 / 2 : 180 / 2
      let radius1 = 50 + image.clientHeight / 2
      let radius2 = isDesktop ? (250 - radius1) / 2 : 180 - radius1

      const timeline = Math.floor(Math.random() * 3) + 1

      switch (timeline) {
        case 1:
          gsap
            .timeline()

            .to(scene, {
              opacity: 1,
            })

            .from(cardList, {
              y: window.innerHeight / 2 + image.clientHeight * 1.5,
              rotateX: -180,
              stagger: 0.1,
              duration: 0.5,
              opacity: 0.8,
              scale: 3,
            })
            .set(cardList, {
              transformOrigin: `center ${radius1 + image.clientHeight / 2}px`,
            })
            .set('.group', {
              // https://developer.mozilla.org/en-US/docs/Web/CSS/transform-style
              transformStyle: 'preserve-3d',
            })
            .to(cardList, {
              y: -radius1,
              duration: 0.5,
              ease: 'power1.out',
            })
            .to(
              cardList,
              {
                rotation: (index) => {
                  return (index * 360) / count
                },
                rotateY: 15,
                duration: 1,
                ease: 'power1.out',
              },
              '<'
            )
            .to(cardList, {
              // Expand the radius
              x: (index) => {
                return Math.round(radius2 * Math.cos(sliceAngle * index - Math.PI / 4))
              },
              y: (index) => {
                return (
                  Math.round(radius2 * Math.sin(sliceAngle * index - Math.PI / 4)) -
                  radius1
                )
              },
              rotation: (index) => {
                return (index + 1) * (360 / count)
              },
            })
            .to(
              cardList,
              {
                rotateY: 180,
                opacity: 0.8,
                duration: 1,
              },
              '<'
            )
            // .from(
            //   '.headings',
            //   {
            //     opacity: 0,
            //     filter: 'blur(60px)',
            //     duration: 1,
            //   },
            //   '<'
            // )
            .to(cardList, {
              repeat: -1,
              duration: 2,
              onRepeat: () => {
                gsap.to(cardList[Math.floor(Math.random() * count)], {
                  rotateY: '+=180',
                })
              },
            })
            .to(
              '.group',
              {
                rotation: 360,
                duration: 20,
                repeat: -1,
                ease: 'none',
              },
              '<-=2'
            )

          break

        case 2:
          radius = isDesktop ? 250 - 75 : 180 / 2
          radius1 = 50 + image.clientHeight / 2
          radius2 = isDesktop ? (250 - radius1) / 2 : 180 - radius1

          gsap
            .timeline()
            .to(scene, {
              opacity: 1,
            })

            .from(cardList, {
              x: (index) => {
                return index % 2
                  ? -window.innerWidth / 2 - image.clientWidth * 4
                  : window.innerWidth / 2 + image.clientWidth * 4
              },
              rotation: (index) => {
                return index % 2 ? -90 : 90
              },
              delay: (index) => {
                return Math.floor(index / 2) * 0.1
              },
              duration: 1,
              opacity: 0.8,
              scale: 5,
              ease: 'power4.out',
            })
            .set(cardList, {
              // Flip the second half of the images.
              scale: (index) => {
                return index > count / 2 - 1 ? -1 : 1
              },
            })
            .to(cardList, {
              y: (index) => {
                return (index >= Math.floor(count / 2) ? 1 : -1) * radius
              },
              duration: 0.5,
              ease: 'power2.out',
            })
            .set(cardList, {
              transformOrigin: `center ${radius + image.clientHeight / 2}px`,
              y: (index) => {
                if (index >= Math.floor(count / 2)) {
                  return -radius
                }
              },
            })
            .to(cardList, {
              rotation: (index) => {
                return index > count / 2 - 1
                  ? ((count - index - 1) * 360) / count
                  : (index * 360) / count
              },
              opacity: 0.8,
              duration: 1,
              ease: 'power2.out',
            })
            // .from(
            //   '.headings',
            //   {
            //     opacity: 0,
            //     filter: 'blur(60px)',
            //     duration: 1.5,
            //   },
            //   '<-=1'
            // )
            .to(cardList, {
              repeat: -1,
              duration: 2,
              onRepeat: () => {
                gsap.to(cardList[Math.floor(Math.random() * count)], {
                  rotateY: '+=180',
                })
              },
            })
            .to(
              '.group',
              {
                rotation: 360,
                duration: 20,
                repeat: -1,
                ease: 'none',
              },
              '<-=1.5'
            )
          break

        case 3:
          radius = isDesktop ? 250 - 75 : 180 / 2
          radius1 = 50 + image.clientHeight / 2
          radius2 = isDesktop ? (250 - radius1) / 2 : 180 - radius1

          gsap.set(cardList, {
            x: (index) => {
              return Math.round(radius * Math.cos(sliceAngle * index - Math.PI / 4))
            },
            y: (index) => {
              return Math.round(radius * Math.sin(sliceAngle * index - Math.PI / 4))
            },
            rotation: (index) => {
              return (index + 1) * (360 / count)
            },
          })

          gsap
            .timeline()

            .set(cardList, {
              opacity: 0,
              scale: 0,
              x: 0,
              y: 0,
              duration: 2,
            })
            .to(scene, {
              opacity: 1,
            })
            .to(cardList, {
              stagger: 0.15,
              opacity: 1,
              scale: 1,
              duration: 1,
              x: (index) => {
                return Math.round(radius * Math.cos(sliceAngle * index - Math.PI / 4))
              },
              y: (index) => {
                return Math.round(radius * Math.sin(sliceAngle * index - Math.PI / 4))
              },
              rotation: (index) => {
                return (index + 1) * (360 / count)
              },
            })
            .to(
              '.group',
              {
                rotation: -360 - 90,
                duration: 3,
                ease: 'power4.out',
              },
              0
            )
            // .from(
            //   '.headings',
            //   {
            //     opacity: 0,
            //     filter: 'blur(60px)',
            //     duration: 1,
            //   },
            //   1
            // )
            .to(cardList, {
              repeat: -1,
              duration: 2,
              onRepeat: () => {
                gsap.to(cardList[Math.floor(Math.random() * count)], {
                  rotateY: '+=180',
                })
              },
            })
            .to(
              '.group',
              {
                rotation: '-=360',
                duration: 20,
                ease: 'none',
                repeat: -1,
              },
              0
            )
          break
      }

      return () => {}
    }
  )
}

// preloadImages('.card__img').then(() => {
//   document.body.classList.remove('loading')
//   init()
// })

export default defineNuxtPlugin((nuxtApp) => {
  return {
    provide: {
      wow: init,
    },
  }
})
