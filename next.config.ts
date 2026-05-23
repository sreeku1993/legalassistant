import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,

  serverExternalPackages: [
    "@xenova/transformers",
    "onnxruntime-node"
  ],

  experimental: {
    // Force Vercel to strip away heavy, unused operating system binaries
    outputFileTracingExcludes: {
      '*': [
        'node_modules/onnxruntime-node/bin/napi-v3/win32/**',
        'node_modules/onnxruntime-node/bin/napi-v3/darwin/**',
        'node_modules/onnxruntime-node/bin/napi-v3/linux/arm64/**', // Delete if not deploying to ARM
        'node_modules/@xenova/transformers/deps/**',
      ],
    },
  },
};

export default nextConfig;
