/** @type {import('next').NextConfig} */
const config = {
    reactStrictMode: false,
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'res.cloudinary.com',
                port: '',
              },
        ]
    }
};

export default config;
