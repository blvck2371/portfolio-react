import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase";

/**
 * Upload un fichier dans Firebase Storage et retourne l’URL publique.
 * @param folder - Dossier (ex: "experiences", "projects", "tech", "certifications")
 * @param file - Fichier à uploader
 * @returns URL de téléchargement
 */
export async function uploadPortfolioImage(
  folder: string,
  file: File
): Promise<string> {
  const ext = file.name.split(".").pop() || "png";
  const path = `portfolio/${folder}/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
}

/** Upload une icône de réseau social → Storage portfolio/socials/{networkKey}.{ext}, retourne l’URL. */
export async function uploadSocialIcon(networkKey: string, file: File): Promise<string> {
  const ext = file.name.split(".").pop() || "png";
  const path = `portfolio/socials/${networkKey}.${ext}`;
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
}

/** Upload un PDF de certification → Storage portfolio/certifications_pdf/, retourne l'URL. */
export async function uploadCertificationPdf(file: File): Promise<string> {
  const ext = file.name.split(".").pop()?.toLowerCase() || "pdf";
  const path = `portfolio/certifications_pdf/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
}
