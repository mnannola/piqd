import type { PhotoScore } from "../hooks/usePhotoScoring";
import type { UploadedPhoto } from "./PhotoUploader";

interface PhotoCardProps {
  photo: UploadedPhoto;
  score?: PhotoScore;
  selected: boolean;
  onToggle: (id: string) => void;
}

function scoreBadgeClass(score: number): string {
  if (score >= 8) return "bg-green-100 text-green-700";
  if (score >= 6) return "bg-amber-100 text-amber-700";
  return "bg-red-100 text-red-600";
}

function scoreLabel(score: number): string {
  if (score >= 9) return "Exceptional";
  if (score >= 7) return "Recommended";
  if (score >= 5) return "Average";
  if (score >= 3) return "Below avg";
  return "Poor";
}

export default function PhotoCard({ photo, score, selected, onToggle }: PhotoCardProps) {
  return (
    <div
      onClick={() => onToggle(photo.id)}
      className={`
        rounded-xl overflow-hidden cursor-pointer transition-all duration-150 bg-white
        ${selected
          ? "ring-2 ring-violet-500 shadow-md shadow-violet-100"
          : "ring-1 ring-gray-200 opacity-60 hover:opacity-80"
        }
      `}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={photo.previewUrl}
          alt={photo.name}
          className="w-full h-full object-cover"
        />

        {/* Selected checkmark */}
        {selected && (
          <div className="absolute top-2 right-2 bg-violet-600 rounded-full w-6 h-6 flex items-center justify-center text-white text-xs font-bold shadow">
            ✓
          </div>
        )}

        {/* Excluded overlay */}
        {!selected && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="text-white/80 text-xs font-medium">Excluded</span>
          </div>
        )}
      </div>

      {/* Score info */}
      <div className="p-3">
        {score ? (
          <>
            <div className="flex items-center justify-between mb-1">
              <span className={`text-xs font-semibold px-2 py-0.5 rounded ${scoreBadgeClass(score.score)}`}>
                {score.score.toFixed(1)} · {scoreLabel(score.score)}
              </span>
              <span className="text-xs text-gray-400 capitalize">{score.roomType}</span>
            </div>
            <p className="text-xs text-gray-500 leading-snug line-clamp-2">{score.reasoning}</p>
          </>
        ) : (
          <p className="text-xs text-gray-400">Awaiting score...</p>
        )}
      </div>
    </div>
  );
}
