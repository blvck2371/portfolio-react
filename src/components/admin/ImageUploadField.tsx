import { useRef, useState } from "react";
import { uploadPortfolioImage } from "../../api/upload";

type Props = {
  folder: string;
  value: string;
  onChange: (url: string) => void;
  label?: string;
  accept?: string;
};

export function ImageUploadField({
  folder,
  value,
  onChange,
  label = "Image / Icône",
  accept = "image/*",
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    setUploading(true);
    try {
      const url = await uploadPortfolioImage(folder, file);
      onChange(url);
    } catch (err) {
      setError("Échec de l’upload. Vérifiez les règles Storage.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-xs font-medium text-slate-300">
          {label}
        </label>
      )}
      <div className="flex flex-wrap items-center gap-2">
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleFile}
          className="hidden"
        />
        <button
          type="button"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          className="rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-slate-300 hover:border-[#915EFF] hover:text-white disabled:opacity-50"
        >
          {uploading ? "Upload…" : "Choisir un fichier"}
        </button>
        {value && (
          <>
            <span className="text-xs text-slate-500 truncate max-w-[180px]">
              Image enregistrée
            </span>
            <img
              src={value}
              alt="Aperçu"
              className="h-10 w-10 rounded object-cover border border-slate-600"
            />
          </>
        )}
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
