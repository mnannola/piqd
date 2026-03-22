import type { UploadedPhoto } from "./PhotoUploader";
import type { PhotoScore } from "../hooks/usePhotoScoring";
import PhotoCard from "./PhotoCard";

interface PhotoGridProps {
  photos: UploadedPhoto[];
  scores: PhotoScore[];
  selectedIds: Set<string>;
  onToggle: (id: string) => void;
}

export default function PhotoGrid({ photos, scores, selectedIds, onToggle }: PhotoGridProps) {
  const scoreMap = new Map(scores.map((s) => [photos[s.index]?.id, s]));
  const selected = photos
    .filter((p) => selectedIds.has(p.id))
    .sort((a,b) => {
        const scoreA = scoreMap.get(a.id)?.score ?? 0;
        const scoreB = scoreMap.get(b.id)?.score ?? 0;
        return scoreB - scoreA;
    });
  const excluded = photos.filter((p) => !selectedIds.has(p.id));
  const avgScore = scores.length
    ? (scores.reduce((a, b) => a + b.score, 0) / scores.length).toFixed(1)
    : null;

  return (
    <div>
      {/* Stats bar */}
      <div className="flex items-center gap-6 py-3 mb-5 border-b border-gray-200 text-sm text-gray-500">
        <span><strong className="text-gray-900">{photos.length}</strong> total</span>
        <span><strong className="text-violet-600">{selected.length}</strong> selected</span>
        <span><strong className="text-gray-400">{excluded.length}</strong> excluded</span>
        {avgScore && (
          <span className="ml-auto">
            Avg score: <strong className="text-gray-900">{avgScore}</strong>
          </span>
        )}
      </div>

      {/* Selected */}
      {selected.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xs font-semibold text-violet-500 uppercase tracking-wider mb-3">
            Selected ({selected.length})
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {selected.map((photo) => (
              <PhotoCard
                key={photo.id}
                photo={photo}
                score={scoreMap.get(photo.id)}
                selected={true}
                onToggle={onToggle}
              />
            ))}
          </div>
        </div>
      )}

      {/* Excluded */}
      {excluded.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Excluded ({excluded.length})
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {excluded.map((photo) => (
              <PhotoCard
                key={photo.id}
                photo={photo}
                score={scoreMap.get(photo.id)}
                selected={false}
                onToggle={onToggle}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
