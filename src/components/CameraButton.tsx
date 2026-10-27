import { Camera } from 'lucide-react';

interface Props {
  label: string;
  disabled?: boolean;
  onCapture: (file: File) => void;
}

/** Opens the rear camera on phones (file picker on desktop). */
export default function CameraButton({ label, disabled, onCapture }: Props) {
  return (
    <label
      className={`flex shrink-0 cursor-pointer items-center gap-1.5 rounded-xl bg-zinc-800 px-3 py-2 text-sm font-semibold text-zinc-200 hover:bg-zinc-700 ${
        disabled ? 'pointer-events-none opacity-40' : ''
      }`}
    >
      <Camera size={16} />
      <span>+ {label}</span>
      <input
        type="file"
        accept="image/*"
        capture="environment"
        disabled={disabled}
        className="sr-only"
        onChange={(e) => {
          const file = e.target.files?.[0];
          e.target.value = '';
          if (file) onCapture(file);
        }}
      />
    </label>
  );
}
