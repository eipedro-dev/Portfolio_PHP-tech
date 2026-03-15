/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  turbopack: {
    rules: {
      '*.frag': {
        loaders: ['raw-loader'],
        as: '*.js',
      },
      '*.vert': {
        loaders: ['raw-loader'],
        as: '*.js',
      },
      '*.glsl': {
        loaders: ['raw-loader'],
        as: '*.js',
      },
    },
  },
};

export default nextConfig;
