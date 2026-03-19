import { Image, Trash2, Upload } from "lucide-react";

export default function UploadZone({
  label, file, preview, onUpload, onRemove,
}: {
  label: string;
  file: File | null;
  preview: string | null;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
}) {
  const inputId = `upload-${label.replace(/\s+/g, "-").toLowerCase()}`;
  return (
    <div>
      <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-2.5">{label}</p>
      {!file ? (
        <label htmlFor={inputId}
          className="flex flex-col items-center justify-center gap-3 p-7 rounded-2xl border-2 border-dashed border-neutral-200
            bg-white cursor-pointer hover:border-neutral-400 hover:bg-neutral-50 transition-all duration-300 group">
          <div className="w-12 h-12 rounded-2xl bg-neutral-50 border border-neutral-100 flex items-center justify-center shadow-sm group-hover:shadow-md transition-all">
            <Upload className="w-5 h-5 text-neutral-400 group-hover:text-neutral-700 transition-colors" />
          </div>
          <div className="text-center">
            <p className="text-xs text-neutral-500 font-semibold">
              Drop file or <span className="text-neutral-900 underline underline-offset-2">browse</span>
            </p>
            <p className="text-[10px] text-neutral-400 mt-1 font-medium">PNG · JPG · PDF · AI · EPS · Max 50MB</p>
          </div>
          <input id={inputId} type="file" className="hidden" accept=".png,.jpg,.jpeg,.pdf,.ai,.eps" onChange={onUpload} />
        </label>
      ) : (
        <div className="relative rounded-2xl overflow-hidden border border-neutral-200 bg-white group shadow-sm">
          {preview ? (
            <img src={preview} alt={label} className="w-full h-40 object-cover" />
          ) : (
            <div className="w-full h-40 flex items-center justify-center bg-neutral-50">
              <Image className="w-8 h-8 text-neutral-300" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent flex items-end p-4">
            <div className="flex items-center gap-2 w-full">
              <p className="text-xs text-white font-bold flex-1 truncate">{file.name}</p>
              <button onClick={onRemove}
                className="p-1.5 rounded-lg bg-white/20 backdrop-blur-sm hover:bg-rose-500 text-white transition-all">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          <div className="absolute top-3 right-3 bg-emerald-500 text-white text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
            ✓ Ready
          </div>
        </div>
      )}
    </div>
  );
}