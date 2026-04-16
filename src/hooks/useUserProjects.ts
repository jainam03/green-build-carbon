import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, doc, setDoc, deleteDoc, serverTimestamp, query, orderBy } from "firebase/firestore";
import { ProjectInputs } from "@/lib/useCarbonMappingEngine";

export interface UserProject extends ProjectInputs {
  id: string;
  name: string;
  createdAt: any;
}

const defaultInputs: ProjectInputs = {
  areaSqft: 0,
  demolitionType: "Mechanical",
  concretePercent: 0,
  steelPercent: 0,
  bricksPercent: 0,
  othersPercent: 0,
  rulesFollowed: "Not sure",
  complianceType: "Informal / none",
};

export function useUserProjects(userId: string | undefined) {
  const [projects, setProjects] = useState<UserProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setProjects([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const projectsRef = collection(db, "users", userId, "projects");
    const q = query(projectsRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const dbProjects: UserProject[] = [];
        snapshot.forEach((docSnap) => {
          dbProjects.push({ ...docSnap.data(), id: docSnap.id } as UserProject);
        });
        setProjects(dbProjects);
        setIsLoading(false);
      },
      (error) => {
        console.error("Error fetching projects", error);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userId]);

  const addProject = async (name: string) => {
    if (!userId) return null;
    const newDocRef = doc(collection(db, "users", userId, "projects"));
    const newProject = {
      ...defaultInputs,
      name,
      createdAt: serverTimestamp(),
    };
    await setDoc(newDocRef, newProject);
    return newDocRef.id;
  };

  const deleteProject = async (projectId: string) => {
    if (!userId) return;
    const docRef = doc(db, "users", userId, "projects", projectId);
    await deleteDoc(docRef);
  };

  return { projects, addProject, deleteProject, isLoading };
}
