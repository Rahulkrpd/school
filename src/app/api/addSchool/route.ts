import dbConnect from "@/lib/db";
import School from "@/model/school";
import { uploadToCloudinary } from "@/utils/cloudinary";
import { NextResponse } from "next/server";
import path from "path";
import { writeFile } from "fs/promises";

export async function POST(req: Request) {
    await dbConnect();

    try {
        const formData = await req.formData();
        const nameEntry = formData.get("name");
        const addressEntry = formData.get("address");
        const cityEntry = formData.get("city");
        const stateEntry = formData.get("state");
        const contactEntry = formData.get("contact");
        const emailEntry = (formData.get("email") ?? formData.get("email_id"));
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



        const name = nameEntry;
        const address = addressEntry;
        const city = cityEntry;
        const state = stateEntry;
        const email = emailEntry;
        const contact = Number(contactEntry);

        const exist = await School.findOne({ email })
        if (exist) {
            return NextResponse.json({ message: "School is already present with this email" }, { status: 409 });
        }

        let publicId = "";
        let mediaUrl = "";

        if (file) {
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);
            const tempFilePath = path.join(process.cwd(), "public/temp", file.name);
            await writeFile(tempFilePath, buffer);

            const uploadRes = await uploadToCloudinary(tempFilePath);
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
            publicId

        });

        return NextResponse.json({ message: "Post created", newSchool });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}
