import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';

export const navItems = [
  { key: 'overview', title: 'Overview', href: paths.dashboard.overview, icon: 'chart-pie' },
  { key: 'products', title: 'Sản phẩm', href: paths.dashboard.customers, icon: 'users' },
  {
    key: 'categories',
    title: 'Phân loại sản phẩm',
    href: paths.dashboard.categories,
    icon: 'category',
    items: [
      {
        key: 'create-category',
        title: 'Tạo category',
        href: paths.dashboard.createCategories,
      },
    ],
  },
  {
    key: 'news',
    title: 'Tin tức',
    href: paths.dashboard.blogs,
    icon: 'news',
    items: [
      {
        key: 'list-posts',
        title: 'Danh sách bài viết',
        href: paths.dashboard.blogs,
      },
      {
        key: 'create-post',
        title: 'Tạo bài viết',
        href: paths.dashboard.createBlogs,
      },
    ],
  },
  {
    key: 'orders',
    title: 'Đơn mua',
    href: paths.dashboard.categories,
    icon: 'category',
    items: [
      {
        key: 'create-order',
        title: 'Tạo đơn mua',
        href: paths.dashboard.createOrder,
      },
    ],
  },
  { key: 'settings', title: 'Settings', href: paths.dashboard.settings, icon: 'gear-six' },
  { key: 'account', title: 'Account', href: paths.dashboard.account, icon: 'user' },
  { key: 'error', title: 'Error', href: paths.errors.notFound, icon: 'x-square' },
] satisfies NavItemConfig[];
