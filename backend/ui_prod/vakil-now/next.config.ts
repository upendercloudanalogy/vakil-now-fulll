import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // ✅ Modern Turbopack config
  turbopack: {
    rules: {
      '*.svg': {
        loaders: [
          {
            loader: '@svgr/webpack',
            options: {
              icon: true
            }
          }
        ],
        as: '*.js'
      }
    }
  },

  // 🧱 Webpack for production build
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            icon: true
          }
        }
      ]
    });

    return config;
  }
};

export default nextConfig;
