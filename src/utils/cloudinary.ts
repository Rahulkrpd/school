import { v2 as cloudinary } from "cloudinary";
import fs from "fs"

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
    api_key: process.env.CLOUDINARY_API_KEY!,
    api_secret: process.env.CLOUDINARY_API_SECRET!,
})

export async function uploadToCloudinary(localPath: string, folder = "school") {
    try {
        const result = await cloudinary.uploader.upload(localPath, {
            folder,
            resource_type: "auto"
        })

        fs.unlinkSync(localPath)
        return result
    } catch (error) {
        if (fs.existsSync(localPath)) fs.unlinkSync(localPath);
        throw error;
    }

}