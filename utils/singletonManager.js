/*
 * @file:    \utils\singletonManager.js
 * @desc:    Manages tippy singleton instances globally
 * -------------------------------------------
 * Created Date: 6th October 2025
 * Modified: 15th October 2025 - 05:07:01
 */

import { createSingleton } from 'tippy.js'

//+-------------------------------------------------
// class SingletonManager
// -----
// Created on Tue Oct 06 2025
//+-------------------------------------------------
class SingletonManager {
  constructor() {
    this.groups = new Map()
    this.singletons = new Map()
  }

  register(groupName, instance) {
    if (!this.groups.has(groupName)) {
      this.groups.set(groupName, [])
    }

    const instances = this.groups.get(groupName)
    instances.push(instance)

    // Update or create singleton
    this.updateSingleton(groupName)
  }

  unregister(groupName, instance) {
    if (!this.groups.has(groupName)) return

    const instances = this.groups.get(groupName)
    const index = instances.indexOf(instance)

    if (index > -1) {
      instances.splice(index, 1)
    }

    // Update singleton
    if (instances.length > 0) {
      this.updateSingleton(groupName)
    } else {
      this.destroySingleton(groupName)
    }
  }

  updateSingleton(groupName) {
    const instances = this.groups.get(groupName)

    if (!instances || instances.length === 0) return

    // Destroy existing singleton if it exists
    if (this.singletons.has(groupName)) {
      this.singletons.get(groupName).destroy()
    }

    // Get properties from the first instance to use as defaults
    const firstInstance = instances[0]
    const props = firstInstance.props

    // Create new singleton with properties inherited from individual instances
    //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    const singleton = createSingleton(instances, {
      arrow: false,
      delay: props.delay || 200,
      moveTransition: 'transform 0.1s ease-out',
      // Inherit interactive properties
      trigger: props.trigger,
      interactive: props.interactive,
      interactiveDebounce: props.interactiveDebounce || 0,
      hideOnClick: true,
      // Inherit theme and animation
      theme: props.theme,
      animation: props.animation,
      // Allow individual instances to override placement
      overrides: ['placement'],
    })

    this.singletons.set(groupName, singleton)
  }

  destroySingleton(groupName) {
    if (this.singletons.has(groupName)) {
      this.singletons.get(groupName).destroy()
      this.singletons.delete(groupName)
    }

    this.groups.delete(groupName)
  }

  clear() {
    this.singletons.forEach((singleton) => singleton.destroy())
    this.singletons.clear()
    this.groups.clear()
  }
}

// Export singleton instance
export const singletonManager = new SingletonManager()
