"use client";
import React, { useState } from "react";

interface SchoolFormData {
    name: string;
    address: string;
    city: string;
    state: string;
    contact: string;
    email_id: string;
    image: File | null;
}

const SchoolForm: React.FC = () => {
    const [formData, setFormData] = useState<SchoolFormData>({
        name: "",
        address: "",
        city: "",
        state: "",
        contact: "",
        email_id: "",
        image: null,
    });

    const [loading, setLoading] = useState<boolean>(false);
    const [message, setMessage] = useState<string>("");

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ): void => {
        const { name, value, files } = e.target;
        setFormData({
            ...formData,
            [name]: files ? files[0] : value,
        } as SchoolFormData); // type assertion for mixed values
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const data = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                if (value !== null) {
                    data.append(key, value);
                }
            });

            const res = await fetch("/api/addSchool/", {
                method: "POST",
                body: data,
            });

            const result = await res.json();

            if (res.ok) {
                setMessage("✅ School added successfully! Go to Show School page");
                setFormData({
                    name: "",
                    address: "",
                    city: "",
                    state: "",
                    contact: "",
                    email_id: "",
                    image: null,
                });
            } else {
                setMessage("❌ Failed: " + (result.message || result.error));
            }
        } catch (error) {
            console.error(error);
            setMessage("⚠️ Something went wrong!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen text-black bg-gray-100">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md"
                encType="multipart/form-data"
            >
                <h2 className="text-2xl font-bold mb-4 text-center">Add School</h2>

                {["name", "address", "city", "state", "contact", "email_id"].map(
                    (field) => (
                        <div className="mb-4" key={field}>
                            <label className="block text-gray-700 mb-1 capitalize">
                                {field.replace("_id", "")}
                            </label>
                            <input
                                type={field === "contact" ? "number" : "text"}
                                name={field}
                                value={formData[field as keyof SchoolFormData] as string}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                    )
                )}

                {/* File upload */}
                <div className="mb-4">
                    <label className="block text-gray-700 mb-1">Image</label>
                    <input
                        type="file"
                        name="image"
                        accept="image/*"
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition disabled:opacity-50"
                >
                    {loading ? "Submitting..." : "Submit"}
                </button>

                {message && (
                    <p className="mt-4 text-center font-medium text-gray-700">
                        {message}
                    </p>
                )}
            </form>
        </div>
    );
};

export default SchoolForm;
