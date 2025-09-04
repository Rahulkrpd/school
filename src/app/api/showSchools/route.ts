import dbConnect from "@/lib/db";
import School from "@/model/school";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    await dbConnect();

    try {
        const response = await School.find({});  // ✅ await here


        return NextResponse.json({response})
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { message: "Fail to fetch school data", error: (error as Error).message },
            { status: 500 }
        );
    }
}
