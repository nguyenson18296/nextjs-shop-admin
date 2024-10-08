export const paths = {
  home: '/',
  auth: { signIn: '/auth/sign-in', signUp: '/auth/sign-up', resetPassword: '/auth/reset-password' },
  dashboard: {
    overview: '/dashboard',
    account: '/dashboard/account',
    customers: '/dashboard/san-pham',
    categories: '/dashboard/phan-loai',
    createCategories: '/dashboard/phan-loai/tao-moi',
    blogs: '/dashboard/tin-tuc',
    orders: '/dashboard/don-mua',
    createOrder: '/dashboard/don-mua/create',
    createBlogs: '/dashboard/tin-tuc/create',
    vouchers: '/dashboard/vouchers',
    settings: '/dashboard/settings',
  },
  errors: { notFound: '/errors/not-found' },
} as const;
