# Free Laravel Vue 3.x Tailwind 3.x Dashboard

[![Vue 3.x Tailwind 3.x admin dashboard demo](https://static.justboil.me/templates/one/repo-styles.png)](https://justboil.github.io/admin-one-vue-tailwind/)

This guide will help you integrate your Laravel application with [Admin One - free Vue 3 Tailwind 3 Admin Dashboard with dark mode](https://github.com/justboil/admin-one-vue-tailwind).

**Admin One** is simple, fast and free Vue.js 3.x Tailwind CSS 3.x admin dashboard with Laravel 9.x integration.

* Built with **Vue.js 3**, **Tailwind CSS 3** framework & **Composition API**
* **Laravel** build tools
* **Laravel Breeze** with **Inertia + Vue** stack
* **SFC** `<script setup>` [Info](https://v3.vuejs.org/api/sfc-script-setup.html)
* **Pinia** state library (official Vuex 5)
* **Dark mode**
* **Styled** scrollbars
* **Production CSS** is only **&thickapprox;38kb**
* Reusable components
* Free under MIT License

## Table of contents

* [Install](#install)
* [Copy styles, components and scripts](#copy-styles-components-and-scripts)
* [Add pages](#add-pages)
* [Fix router links](#fix-router-links)
* [Add Inertia-related stuff](#add-inertia-related-stuff)
* [Optional steps](#optional-steps)
* [More information](#more-information)

## Install

### Install Laravel

First, [install Laravel](https://laravel.com/docs/installation) application

### Install Breeze

Then `cd` to project dir and install Breeze with Vue option

```bash
composer require laravel/breeze --dev

php artisan breeze:install vue

npm install
php artisan migrate
```

### Install dependencies

```bash
npm i pinia @mdi/js chart.js numeral -D
```

## Copy styles, components and scripts

**Before you start,** we recommend to remove/rename Laravel Breeze's original folders — `resources/js/Components` and `resources/js/Layouts`

Now clone [justboil/admin-one-vue-tailwind](https://github.com/justboil/admin-one-vue-tailwind) project somewhere locally (into any separate folder)

Next, copy these files **from justboil/admin-one-vue-tailwind project** directory **to laravel project** directory:

* Copy `tailwind.config.js` to `/`
* Copy `src/components` `src/layouts` `src/stores` `src/colors.js` `src/config.js` `src/menuAside.js` `src/menuNavBar.js` `src/styles.js` to `resources/js/`
* Copy `.laravel-guide/resources/js/` to `resources/js/`
* Delete `resources/css/app.css`
* Copy `src/css` to `resources/css`

### lowecase vs Capitalized folder names

Fresh Laravel install with Breeze provides **Capitalized** folder names such as `Components`, `Layouts`, etc. For the sake of simplicity we just follow Vue conventions with lowercase folder names. However, you may opt-in to capitalize folder names:

* Make sure you've removed original Laravel Breeze's `resources/js/Layouts` and `resources/js/Components` folders
* Rename the folders you've copied in the previous section: `resources/js/layouts` to `Layouts`; `components` to `Components`; `stores` to `Stores`
* Replace everywhere in imports: `@/layouts/` with `@/Layouts/`; `@/components/` with `@/Components/`; `@/stores/` with `@/Stores/`

### In tailwind.config.js

Replace `content`, to reflect Laravel's structure:

```js
module.exports = {
  content: [
    './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
    './storage/framework/views/*.php',
    './resources/views/**/*.blade.php',
    './resources/js/**/*.vue',
    './resources/js/**/*.js',
  ],
  // ...
}
```

### In resources/views/app.blade.php

* Remove `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap">`

## Add Pages

Let's just add first page. You can repeat these steps for other pages, if you wish to. Please note, that `SectionBottomOtherPages` should be removed where present, as it depends on vue-router.

First, copy `src/views/HomeView.vue` (justboil/admin-one-vue-tailwind project) to `resources/js/Pages/` (your Laravel project).

Then, open `resources/js/Pages/HomeView.vue` and add `<Head>`:

```vue
<script setup>
import { Head } from '@inertiajs/inertia-vue3'
// ...
</script>

<template>
  <LayoutAuthenticated>
    <Head title="Dashboard" />
    <!-- ... -->
  </LayoutAuthenticated>
</template>
```

Add route in `routes/web.php`. There's a `/dashboard` route already defined by default, so just replace `Inertia::render('Dashboard')` with `Inertia::render('HomeView')`:

```php
Route::get('/dashboard', function () {
  return Inertia::render('HomeView');
})->middleware(['auth', 'verified'])->name('dashboard');
```

## Fix router links

Here we replace RouterLink with Inertia Link.

### resources/js/menuAside.js and resources/js/menuNavBar.js

Optionally, you can pass menu via Inertia shared props, so it's going to be controlled with PHP. Here we'd just use JS.

`to` should be replaced with `route` which specifies route name defined in `routes/web.php`. For external links `href` should be used instead. Here's an example for `menuAside.js` and `menuNavBar.js`:

```javascript
export default [
  'General',
  [
    {
      route: 'dashboard',
      icon: mdiMonitor,
      label: 'Dashboard'
    },
    {
      route: 'dashboard2',
      icon: mdiMonitor,
      label: 'Dashboard 2'
    },
    {
      href: 'https://example.com/',
      icon: mdiMonitor,
      label: 'Example.com'
    }
  ]
]
```

Route names reflect ones defined in `routes/web.php`:

```php
Route::middleware(['auth:sanctum', 'verified'])->get('/dashboard', function () {
    return Inertia::render('Home');
})->name('dashboard');

Route::middleware(['auth:sanctum', 'verified'])->get('/dashboard-2', function () {
    return Inertia::render('Home2');
})->name('dashboard2');
```

Now, let's update vue files, to make them work with route names and Inertia links.

### resources/js/components/AsideMenuItem.vue

Replace `RouterLink` imported from `vue-router` with `Link` import in `<script setup>` and add consts:

```vue
<script setup>
import { Link } from '@inertiajs/inertia-vue3'
// ...

// Add itemHref
const itemHref = computed(() => props.item.route ? route(props.item.route) : props.item.href)

// Add activeInactiveStyle
const activeInactiveStyle = computed(
  () => props.item.route && route().current(props.item.route)
    ? styleStore.asideMenuItemActiveStyle
    : ''
)

// ...
</script>
```

In `<template>` section:

* In `<component>` remove `v-slot` and `:to` attributes; replace `:is` with `:is="item.route ? Link : 'a'"` and `:href` with `:href="itemHref"`
* Inside `<component>` replace `:class` attribute for `<BaseIcon>`, `<span>` and another `<BaseIcon>` with `:class="activeInactiveStyle"`

### resources/js/components/BaseButton.vue

Replace `RouterLink` imported from `vue-router` with `Link` import in `<script setup>`:

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

### resources/js/components/NavBarItem.vue

Replace `RouterLink` imported from `vue-router` with `Link` import in `<script setup>`:

```vue
<script setup>
import { Link } from '@inertiajs/inertia-vue3'
// ...

// Add itemHref
const itemHref = computed(() => props.item.route ? route(props.item.route) : props.item.href)

// Update `const is` to return `Link` when `props.routeName` is set:
const is = computed(() => {
  if (props.item.href) {
    return 'a'
  }

  if (props.item.route) {
    return RouterLink
  }

  return 'Link'
})
</script>
```

Then, remove `to` attribute and update `href` attributes in `<component>`:

```vue
<template>
  <component
    :href="itemHref"
  >
    <slot />
  </component>
</template>
```

## Add Inertia-related stuff

### resources/js/components/UserAvatarCurrentUser.vue

Let's fetch user avatar initials based on username stored in database.

```vue
<script setup>
import { computed } from 'vue'
import { usePage } from '@inertiajs/inertia-vue3'
import UserAvatar from '@/components/UserAvatar.vue'

const userName = computed(() => usePage().props.value.auth.user.name)
</script>

<template>
  <UserAvatar
    :username="userName"
    api="initials"
  />
</template>
```

### resources/js/components/NavBarItem.vue

```vue
<script setup>
// Add usePage:
import { usePage } from '@inertiajs/inertia-vue3'
// Remove unused useMainStore:
// import { useMainStore } from '@/stores/main.js'
// ...

// Update itemLabel:
const itemLabel = computed(() => props.item.isCurrentUser ? usePage().props.value.auth.user.name : props.item.label)

// ...
</script>
```

### resources/js/layouts/LayoutAuthenticated.vue

```vue
<script setup>
// Remove vue-router stuff:

// import { useRouter } from 'vue-router'

// const router = useRouter()

// router.beforeEach(() => {
//   layoutStore.isAsideMobileExpanded = false
//   layoutStore.isAsideLgActive = false
// })

// Add:

import { Inertia } from '@inertiajs/inertia'

Inertia.on('navigate', () => {
  layoutStore.isAsideMobileExpanded = false
  layoutStore.isAsideLgActive = false
})

// Replace `isLogout` logic:

const menuClick = (event, item) => {
  // ...

  if (item.isLogout) {
    // Add:
    Inertia.post(route('logout'))
  }
}

// ...
</script>
```

## Optional steps

### Default style

It's likely, you'll use only one app style, either `basic` or one of listed in `src/styles.js`. Follow [this guide](https://justboil.github.io/docs/customization/#default-style) to set one of choice.

### Fix .editorconfig

Add to .editorconfig:

```editorconfig
[*.{js,jsx,ts,tsx,vue,html,css}]
indent_size = 2
```

### resources/js/bootstrap.js

Global `lodash` and `axios` aren't needed, as we import them directly when needed. Most likely, you'd not need `axios` at all, as Laravel pushes all data via Inertia.

## More information

* [Laravel Docs](https://laravel.com/docs)
* [Inertia](https://inertiajs.com/)