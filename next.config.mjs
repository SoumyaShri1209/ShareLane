// // next.config.mjs
// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: true,
//   images: {
//     domains: ["lh3.googleusercontent.com"], // allow Google profile images
//     remotePatterns:[
//       {hostname: "res.cloudinary.com" , protocol: "https" , port:""

//       }
//     ]
//   },
// };

// export default nextConfig;





// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["lh3.googleusercontent.com"], // For Google profile images
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/**", // 👈 this line allows all Cloudinary paths
      },
    ],
  },
};

export default nextConfig;

