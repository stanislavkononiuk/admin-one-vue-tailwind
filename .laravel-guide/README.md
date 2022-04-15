# Free Laravel Vue 3.x Tailwind 3.x Dashboard

This guide will help you integrate your Laravel application with [Admin One - free Vue 3 Tailwind 3 Admin Dashboard with dark mode](https://github.com/justboil/admin-one-vue-tailwind).

**Please note:** this document is work in progress, so [some things are missing](#work-in-progress).

## Table of contents

* [Install](#install)
* [Copy styles, components and scripts](#copy-styles-components-and-scripts)
* [Add pages](#add-pages)
* [Fix router links](#fix-router-links)
* [Optional steps](#optional-steps)
* [Delete unused files](#delete-unused-files)
* [Work in progress](#work-in-progress)

## Install

* [Install Laravel](https://laravel.com/docs/installation) application
* [Install Jetstream](https://jetstream.laravel.com/2.x/installation.html) with Inertia + Vue stack
* `cd` to project dir and run `npm i vuex @mdi/js chart.js numeral autoprefixer -D`

Add `require('autoprefixer')` to PostCSS plugin options in `webpack.mix.js`:

```javascript
mix.js('resources/js/app.js', 'public/js')
  .vue()
  .postCss('resources/css/app.css', 'public/css', [
    require('postcss-import'),
    require('tailwindcss'),
    require('autoprefixer'),
  ])
  .webpackConfig(require('./webpack.config'))
```

### Copy styles, components and scripts

Clone [justboil/admin-one-vue-tailwind](https://github.com/justboil/admin-one-vue-tailwind) project locally into a separate folder

Next, copy these files **from justboil/admin-one-vue-tailwind project** directory **to laravel project** directory:

* Copy `.laravel/tailwind.config.js` to `/`
* Copy `src/components` `src/store` `src/colors.js` `src/config.js` `src/menu.js` `src/styles.js` to `resources/js/`
* Copy `.laravel/resources/js/app.js` to `resources/js/` (this is an adapted version of src/main.js)
* Copy `src/App.vue` to `resources/layouts/`
* Copy `.laravel/resources/js/Pages/Auth/Login.vue` to `resources/js/Pages/Auth/`
* Copy `src/css` to `resources/css`
* Delete `resources/css/app.css`
* Rename `resources/css/main.css` to `app.css`

##### In resources/layouts/App.vue

* Replace `<router-view />` with `<slot />`
* Add `store.dispatch('fullScreenToggle', false)` after `const store = useStore()`

##### In resources/views/app.blade.php

* Remove `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap">`

## Add Pages

Let's just add first page. You can repeat these steps for other pages, if you wish to.

First, copy `src/views/Home.vue` (justboil/admin-one-vue-tailwind project) to `resources/js/Pages/` (your Laravel project).

Then, open `resources/js/Pages/Home.vue` and add these lines to `<script setup>`:

```vue
<script setup>
import { Head } from '@inertiajs/inertia-vue3'
import App from '@/Layouts/App.vue'
// ...
</script>
```
Wrap the content inside `<template>` with `<app>`. Then add `<Head title="Dashboard" />`

Here's an original `<template>`:

```vue
<template>
  <!-- ... -->
</template>
```

Here's the result:

```vue
<template>
  <Head title="Dashboard" />
  <app>
    <!-- ... -->
  </app>
</template>
```

Add route in `routes/web.php`. There's a `/dashboard` route already defined by default, so just replace `Inertia::render('Dashboard')` with `Inertia::render('Home')`:

```injectablephp
Route::middleware(['auth:sanctum', 'verified'])->get('/dashboard', function () {
    return Inertia::render('Home');
})->name('dashboard');
```

## Fix router links

Here we replace router-link with Inertia Link.

##### resources/js/menu.js

Optionally, you can pass menu via Inertia shared props, so it's going to be controlled with PHP. Here we'd just use JS.

`to` should be replaced with `route` which specifies route name defined in `routes/web.php`. For external links `href` should be used instead. Here's an example for `menu.js`:

```javascript
export default [
  'General',
  [
    {
      route: 'dashboard',
      icon: mdiDesktopMac,
      label: 'Dashboard'
    },
    {
      route: 'dashboard2',
      icon: mdiDesktopMac,
      label: 'Dashboard 2'
    },
    {
      href: 'https://example.com/',
      icon: mdiDesktopMac,
      label: 'Example.com'
    }
  ]
]
```

Route names reflect ones defined in `routes/web.php`:

```injectablephp
Route::middleware(['auth:sanctum', 'verified'])->get('/dashboard', function () {
    return Inertia::render('Home');
})->name('dashboard');

Route::middleware(['auth:sanctum', 'verified'])->get('/dashboard-2', function () {
    return Inertia::render('Home2');
})->name('dashboard2');
```

Now, let's update vue files, to make them work with route names and Inertia links.

##### resources/js/components/AsideMenuItem.vue

Add `Link` import to `<script setup>`:

```vue
<script setup>
import { Link } from '@inertiajs/inertia-vue3'
// ...
</script>
```

In `<script setup>` section replace following const declarations with the ones below:

```javascript
const componentIs = computed(() => props.item.route ? Link : 'a')
```

```javascript
const itemHref = computed(() => props.item.route ? route(props.item.route) : props.item.href)
```

```javascript
const itemTarget = computed(() => props.item.target ? props.item.target : null)
```

Remove `const itemTo`

Add `const activeInactiveStyle`:

```javascript
const activeInactiveStyle = computed(
  () => props.item.route && route().current(props.item.route)
    ? asideMenuItemActiveStyle.value
    : asideMenuItemInactiveStyle.value
)
```

In `<template>` section:

* In `<component>` remove `v-slot` and `:to` attributes
* Inside `<component>` replace `:class` attribute for `<icon>`, `<span>` and another `<icon>` with `:class="activeInactiveStyle"`

```vue
<template>

  <!-- ... -->

  <component
    :is="componentIs"
    :href="itemHref"
    :target="itemTarget"
    class="flex cursor-pointer dark:hover:bg-gray-700/50"
    :class="[ asideMenuItemStyle, isSubmenuList ? 'p-3 text-sm' : 'py-2' ]"
    @click="menuClick"
  >
    <icon
      v-if="item.icon"
      :path="item.icon"
      class="flex-none"
      :class="activeInactiveStyle"
      w="w-12"
    />
    <span
      class="grow"
      :class="activeInactiveStyle"
    >{{ item.label }}</span>
    <icon
      v-if="hasDropdown"
      :path="dropdownIcon"
      class="flex-none"
      :class="activeInactiveStyle"
      w="w-12"
    />
  </component>

  <!-- ... -->

</template>
```

##### resources/js/components/JbButton.vue

Add `Link` import to `<script setup>`:

```vue
<script setup>
import { Link } from '@inertiajs/inertia-vue3'
// ...
</script>
```

Replace `to` prop declaration with `routeName`:

```javascript
const props = defineProps({
  // ...
  routeName: {
    type: String,
    default: null
  }
  // ...
})
```

Fix `const is` declaration, so it returns the `Link` component when `props.routeName` is set:

```javascript
const is = computed(() => {
  if (props.as) {
    return props.as
  }

  if (props.routeName) {
    return Link
  }

  if (props.href) {
    return 'a'
  }

  return 'button'
})
```

Remove `:to` and replace `:href` in `<component>` with `:href="routeName ? route(routeName) : href"`:

```vue
<template>
  <component
    :is="is"
    :class="componentClass"
    :href="routeName ? route(routeName) : href"
    :type="computedType"
    :target="target"
    :disabled="disabled"
  >
    <!-- ... -->
  </component>
</template>
```

##### resources/js/components/NavBarItem.vue

Add `Link` import to `<script setup>`:

```vue
<script setup>
import { Link } from '@inertiajs/inertia-vue3'
// ...
</script>
```

Replace `to` prop with `routeName` prop:

```javascript
const props = defineProps({
  // ...
  routeName: {
    type: String,
    default: null
  }
  // ...
})
```

Update `const is` to return `Link` when `props.routeName` is set:

```javascript
const is = computed(() => {
  if (props.href) {
    return 'a'
  }

  if (props.routeName) {
    return Link
  }

  return 'div'
})
```

Update `const activeClass` to match current route name:

```javascript
const activeClass = computed(
  () => props.routeName && route().current(props.routeName) ? props.activeColor : null
)
```

Then, update attributes in `<component>`:

```vue
<template>
  <component
    :is="is"
    :class="[componentClass, activeClass]"
    :href="routeName ? route(routeName) : href"
  >
    <slot />
  </component>
</template>
```

## Optional steps

### Fix .editorconfig

Add to .editorconfig:

```editorconfig
[*.{js,jsx,ts,tsx,vue,html,css}]
indent_size = 2
```

### Fix Pages/Welcome.vue

In case, you need Pages/Welcome.vue, add `mounted` hook to remove unnecessary padding, which is set by default:

```js
export default defineComponent({
  // ...
  mounted () {
    this.$store.dispatch('fullScreenToggle', true)
  }
})
```

## Delete unused files

* Delete resources/js/bootstrap.js
* ...other items are coming soon

## Work in progress

As mentioned, this guide is WIP - work in progress. Contributions open. Here's the list of what's missing right now:

* Pages for resources/Pages/API
* Pages for resources/Pages/Auth (except Login.vue)
* Pages for resources/Pages/Profile
* Unused default Jetstream files list
