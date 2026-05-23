import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,

  serverExternalPackages: [
    "@xenova/transformers",
    "onnxruntime-node"
  ]
};

export default nextConfig;