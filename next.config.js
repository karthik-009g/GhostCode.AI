/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  poweredByHeader: false,

  compress: true,

  transpilePackages: [
    "three",
    "@react-three/fiber",
    "@react-three/drei",
    "@react-three/postprocessing"
  ],

  images: {
    formats: ["image/avif", "image/webp"]
  },

  experimental: {
    optimizePackageImports: [
      "@react-three/drei",
      "@react-three/fiber"
    ]
  },

  webpack: (config) => {
    config.module.rules.push({
      test: /\.(glsl|vs|fs|vert|frag)$/i,
      type: "asset/source",
      exclude: /node_modules/
    });

    return config;
  }
};

module.exports = nextConfig;