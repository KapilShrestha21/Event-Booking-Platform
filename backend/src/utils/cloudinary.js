import { v2 as cloudinary } from 'cloudinary';
import { unlink } from 'fs/promises';
import fs from 'fs';

// Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Put this temporarily after cloudinary.config(...)
// cloudinary.api.ping()
//   .then(res => console.log('Cloudinary connection OK:', res))
//   .catch(err => console.error('Cloudinary Auth Failed:', err));

// console.log('Cloudinary Config Test:', {
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     has_secret: !!process.env.CLOUDINARY_API_SECRET,
// });

// Helper to safely delete local temporary files without crashing
const safeUnlink = async (filePath) => {
    if (filePath && fs.existsSync(filePath)) {
        try {
            await unlink(filePath);
        } catch (error) {
            console.error('Failed to delete temporary file:', error);
        }
    }
};

const uploadOnCloudinary = async (localFilePath) => {
    if (!localFilePath) return null;

    try {
        // Replace Windows backslashes (\) with forward slashes (/)
        const normalizedPath = localFilePath.replace(/\\/g, '/');

        // Upload local file to Cloudinary inside the 'events' folder
        const response = await cloudinary.uploader.upload(normalizedPath, {
            // folder: 'events',
            resource_type: 'auto',
        });

        console.log('File uploaded to Cloudinary:', response.secure_url);

        // Delete temporary file from local server disk
        await safeUnlink(localFilePath);

        return response;
    } catch (error) {
        console.error('Cloudinary upload failed:', error);

        // Clean up temporary local file if upload threw an error
        await safeUnlink(localFilePath);

        return null;
    }
};

const deleteFromCloudinary = async (publicId) => {
    try {
        if (!publicId) return null;

        const result = await cloudinary.uploader.destroy(publicId, {
            resource_type: 'image',
        });

        console.log('File destroyed from Cloudinary:', publicId, result);
        return result;
    } catch (error) {
        console.error('Failed to delete image from Cloudinary:', error);
        return null;
    }
};

export {
    uploadOnCloudinary,
    deleteFromCloudinary,
};

// ------------ cloudinary return back this for upload --------------
/*response {
        asset_id: "...",
        public_id: "events/event-123",
        version: 1234567890,
        format: "jpg",
        resource_type: "image",
        width: 1200,
        height: 800,
        secure_url: "https://res.cloudinary.com/....../image/upload/....jpg",
        url: "http://res.cloudinary.com/....../image/upload/....jpg",
        bytes: 245678
} */


// ------------- cloudinary return back this for delete ----------------------
// If deletion succeeds
/* result {
    result: "ok"
}*/

// If deletion fail
/* result {
    result: "not found"
}*/
