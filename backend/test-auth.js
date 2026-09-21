import dotenv from 'dotenv';
dotenv.config();
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

try {
  // ping() authenticates your API key and secret against Cloudinary servers
  const res = await cloudinary.api.ping();
  console.log('Authentication Successful:', res);
} catch (error) {
  console.error('Authentication Error:', error);
}