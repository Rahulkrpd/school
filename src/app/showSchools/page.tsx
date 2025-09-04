"use client";
import { useSchool } from "@/context/SchoolContext";
import Image from "next/image";
import { ISchool } from "@/model/school";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ShowSchools() {
    const { schoolData, getSchool } = useSchool();
    const router = useRouter();

    useEffect(() => {
        getSchool();


    }, [getSchool])

    const handleBack = () => {
        router.push('/')
    }

    return (
        <div className="p-6  min-h-screen bg-gray-700">
            <h2 className="text-3xl font-bold mb-6 text-center">Schools</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 ">
                {schoolData.map((school: ISchool) => (
                    <div
                        key={school.email}
                        className="bg-[#afc3cc] border border-gray-200 rounded-2xl shadow-md p-5 hover:shadow-lg transition duration-300"
                    >
                        <Image
                            src={school.image}
                            alt={school.name}
                            className="object-cover rounded-xl w-full h-40"
                            width={600}
                            height={400}
                        />
                        <div className="mt-4 text-black">
                            <h3 className="text-lg font-semibold text-gray-900">{school.name}</h3>
                            <p className="text-gray-700 text-sm mt-1">{school.address}</p>
                            <p className="text-gray-700 text-sm">{school.city}</p>
                            <p className="text-gray-700 text-sm">{school.email}</p>
                            <p className="text-gray-700 text-sm">{school.contact}</p>
                        </div>
                    </div>

                ))}

            </div>
            <div className="w-full flex justify-center items-center  mt-10">
                <button onClick={() => handleBack()} className="p-2 bg-blue-400 rounded-2xl ">Go Back </button>
            </div>

        </div>
    );
}
