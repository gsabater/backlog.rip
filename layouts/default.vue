<template>
  <div>
    <nav>
      <ul>
        <li>
          <NuxtLink to="/">Home</NuxtLink>
        </li>

        <li>---</li>
        <li>
          <NuxtLink to="/about">About</NuxtLink>
        </li>
        <li>
          <NuxtLink to="/posts/1">Post 1</NuxtLink>
        </li>
        <li>
          <NuxtLink to="/posts/2">Post 2</NuxtLink>
        </li>
        <li>---</li>
        <li>
          <NuxtLink to="/misc">MISC</NuxtLink>
        </li>
      </ul>
    </nav>
    <slot />
    <AppFooter />
  </div>
</template>
