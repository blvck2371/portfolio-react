import { useEffect, useState, useRef } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { COLLECTIONS, CONFIG_DOCS } from "./firestore-collections";
import { uploadSocialIcon } from "../../api/upload";
import type { TSocials } from "../../types";

const NETWORKS: { key: "facebook" | "linkedin" | "twitter" | "github"; label: string; placeholder: string }[] = [
  { key: "facebook", label: "Facebook", placeholder: "https://facebook.com/..." },
  { key: "linkedin", label: "LinkedIn", placeholder: "https://linkedin.com/in/..." },
  { key: "twitter", label: "Twitter / X", placeholder: "https://twitter.com/..." },
  { key: "github", label: "GitHub", placeholder: "https://github.com/..." },
];

export function AdminSocials() {
  const [data, setData] = useState<TSocials>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingIcon, setUploadingIcon] = useState<string | null>(null);
  const [error, setError] = useState("");
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const docRef = doc(db, COLLECTIONS.config, CONFIG_DOCS.socials);

  useEffect(() => {
    getDoc(docRef)
      .then((snap) => {
        if (snap.exists()) {
          setData((snap.data() as TSocials) || {});
        }
      })
      .catch(() => setData({}))
      .finally(() => setLoading(false));
  }, []);

  const handleLinkChange = (key: "facebook" | "linkedin" | "twitter" | "github", value: string) => {
    setData((prev) => ({ ...prev, [key]: value.trim() || undefined }));
    setError("");
  };

  const handleIconUpload = async (key: "facebook" | "linkedin" | "twitter" | "github", e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Choisissez une image (PNG, JPG, SVG, etc.).");
      e.target.value = "";
      return;
    }
    setError("");
    setUploadingIcon(key);
    try {
      const url = await uploadSocialIcon(key, file);
      setData((prev) => ({ ...prev, [`${key}_icon`]: url }));
    } catch {
      setError("Échec de l’upload. Réessayez.");
    } finally {
      setUploadingIcon(null);
      e.target.value = "";
      if (fileRefs.current[key]) fileRefs.current[key]!.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const toSave: Record<string, string> = {};
      NETWORKS.forEach(({ key }) => {
        toSave[key] = (data[key] as string)?.trim() ?? "";
        const iconKey = `${key}_icon`;
        toSave[iconKey] = (data[iconKey as keyof TSocials] as string)?.trim() ?? "";
      });
      await setDoc(docRef, toSave);
    } catch {
      setError("Échec de l’enregistrement.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-slate-400">Chargement…</p>;

  return (
    <section className="space-y-4">
      <h2 className="text-md font-semibold text-white">Mes réseaux</h2>
      <p className="text-xs text-slate-400">
        Optionnel : ajoute les liens de tes réseaux. Seuls les champs remplis sont affichés sur le site. Pour chaque réseau tu peux uploader une icône (image) ; elle est enregistrée dans Firebase Storage et lue depuis Firebase.
      </p>

      {error && (
        <p className="rounded-lg bg-red-500/20 px-3 py-2 text-sm text-red-300">{error}</p>
      )}

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-6 rounded-xl border border-slate-800 bg-slate-900/50 p-4"
      >
        {NETWORKS.map(({ key, label, placeholder }) => (
          <div key={key} className="rounded-lg border border-slate-700 bg-slate-800/50 p-4">
            <label className="block text-sm font-medium text-slate-300">{label}</label>

            <div className="mt-2">
              <span className="text-xs text-slate-500">Lien du profil</span>
              <input
                type="url"
                value={data[key] ?? ""}
                onChange={(e) => handleLinkChange(key, e.target.value)}
                placeholder={placeholder}
                className="mt-1 w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-white"
              />
            </div>

            <div className="mt-3">
              <span className="text-xs text-slate-500">Icône (upload)</span>
              <div className="mt-1 flex items-center gap-3">
                {(data[`${key}_icon` as keyof TSocials] as string) && (
                  <img
                    src={data[`${key}_icon` as keyof TSocials] as string}
                    alt={label}
                    className="h-10 w-10 rounded-lg border border-slate-600 object-contain bg-slate-900"
                  />
                )}
                <label className="cursor-pointer">
                  <input
                    ref={(el) => { fileRefs.current[key] = el; }}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={uploadingIcon !== null}
                    onChange={(e) => handleIconUpload(key, e)}
                  />
                  <span className="inline-block rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-slate-300 hover:bg-slate-700">
                    {uploadingIcon === key ? "Envoi…" : (data[`${key}_icon` as keyof TSocials] ? "Remplacer l’icône" : "Uploader une icône")}
                  </span>
                </label>
              </div>
            </div>
          </div>
        ))}

        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-[#915EFF] px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {saving ? "Enregistrement…" : "Enregistrer les liens et icônes"}
        </button>
      </form>
    </section>
  );
}
