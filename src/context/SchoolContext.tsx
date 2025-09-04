"use client"
import { createContext, ReactNode, useCallback, useContext, useState } from "react";
import { ISchool } from "@/model/school";


// Define context type
type SchoolContextType = {
  schoolData: ISchool[];
  setSchoolData: React.Dispatch<React.SetStateAction<ISchool[]>>;
  createSchool: (data: ISchool) => Promise<void>;
  getSchool: () => Promise<void>;
};

// Create context
const SchoolContext = createContext<SchoolContextType | undefined>(undefined);

// Provider component
export function SchoolProvider({ children }: { children: ReactNode }) {
  const [schoolData, setSchoolData] = useState<ISchool[]>([]);




  const createSchool = async (data: ISchool) => {
    try {
      const formData = new FormData()
      formData.append("name", data.name)
      formData.append("address", data.address)
      formData.append("city", data.city)
      formData.append("contact", data.contact.toString())
      if (data.image) formData.append("image", data.image)
        formData.append("email", data.email)

      const response = await fetch("/api/addSchool", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to create school")
      }

      const { newSchool } = await response.json();

      setSchoolData(prev => [newSchool as ISchool, ...prev]);
    } catch (error) {
      console.error(error);
    }
  }

  const getSchool = useCallback(async (): Promise<void> => {
    try {
      const response = await fetch("/api/showSchools/");
      if (!response.ok) {
        throw new Error("Failed to fetch schools");
      }
      const data = await response.json();

      console.log("school data",data.response)
      setSchoolData(data.response || []);
    } catch (error) {
      console.error("Error fetching schools:", error);
      setSchoolData([]);
    }
  }, []);


  return (
    <SchoolContext.Provider value={{ schoolData, setSchoolData, createSchool, getSchool }}>
      {children}
    </SchoolContext.Provider>
  );
}

// Custom hook
export function useSchool() {
  const context = useContext(SchoolContext);
  if (context === undefined) {
    throw new Error("useSchool must be used within SchoolProvider");
  }
  return context;
}
