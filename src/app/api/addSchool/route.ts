import dbConnect from "@/lib/db";
import School from "@/model/school";
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import { NextResponse } from "next/server";

// Cloudinary config (make sure these env vars exist in Vercel)
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
    await dbConnect();

    try {
        const formData = await req.formData();

        const nameEntry = formData.get("name");
        const addressEntry = formData.get("address");
        const cityEntry = formData.get("city");
        const stateEntry = formData.get("state");
        const contactEntry = formData.get("contact");
        const emailEntry = formData.get("email") ?? formData.get("email_id");
        const file = formData.get("image") as File | null;

        if (
            typeof nameEntry !== "string" ||
            typeof addressEntry !== "string" ||
            typeof cityEntry !== "string" ||
            typeof stateEntry !== "string" ||
            typeof emailEntry !== "string" ||
            typeof contactEntry !== "string"
        ) {
            return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
        }

        const name: string = nameEntry;
        const address: string = addressEntry;
        const city: string = cityEntry;
        const state: string = stateEntry;
        const email: string = emailEntry;
        const contact: number = Number(contactEntry);

        // check duplicate
        const exist = await School.findOne({ email });
        if (exist) {
            return NextResponse.json(
                { message: "School is already present with this email" },
                { status: 409 }
            );
        }

        let publicId = "";
        let mediaUrl = "";

        if (file) {
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);

            // Upload buffer directly to Cloudinary
            const uploadRes = (await new Promise<UploadApiResponse>((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    { folder: "schools" },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result as UploadApiResponse);
                    }
                );
                uploadStream.end(buffer);
            })) as UploadApiResponse;

            mediaUrl = uploadRes.secure_url;
            publicId = uploadRes.public_id;
        }

        const newSchool = await School.create({
            name,
            address,
            city,
            state,
            email,
            contact,
            image: mediaUrl,
            publicId,
        });

        return NextResponse.json({ message: "School created", newSchool });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}
