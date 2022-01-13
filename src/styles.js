const bodyBase = 'text-base dark:bg-gray-800 dark:text-gray-100'

export const basic = {
  html: '',
  body: `bg-gray-50 ${bodyBase}`,
  aside: 'bg-gray-800',
  asideBrand: 'bg-gray-900 text-white',
  asideMenuCloseLg: 'text-white',
  asideMenuLabel: 'text-gray-400',
  asideMenuItem: 'hover:bg-gray-600 hover:bg-opacity-50',
  asideMenuItemActive: 'font-bold text-white',
  asideMenuItemInactive: 'text-gray-300',
  asideSubmenuList: 'bg-gray-700 bg-opacity-50',
  navBarItemLabel: 'hover:text-blue-500',
  navBarMenuListUpperLabel: 'bg-gray-100',
  overlay: 'from-gray-700 via-gray-900 to-gray-700'
}

export const white = {
  html: 'scrollbars-light',
  body: `bg-white ${bodyBase}`,
  aside: 'bg-white border-r border-gray-100',
  asideBrand: '',
  asideMenuCloseLg: '',
  asideMenuLabel: 'dark:text-gray-400',
  asideMenuItem: 'text-blue-600 hover:text-black dark:text-white',
  asideMenuItemActive: 'font-bold text-black dark:text-white',
  asideMenuItemInactive: '',
  asideSubmenuList: 'bg-gray-50',
  navBarItemLabel: 'text-blue-600 hover:text-black',
  navBarMenuListUpperLabel: 'bg-gray-50',
  overlay: 'from-white via-gray-100 to-white'
}
