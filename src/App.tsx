import { useState } from "react";
import PhotoUploader, { type UploadedPhoto } from "./components/PhotoUploader";
import PhotoGrid from "./components/PhotoGrid";
import DescriptionPanel from "./components/DescriptionPanel";
import { usePhotoScoring } from "./hooks/usePhotoScoring";
import { saveOverride } from "./lib/storage";

type Tab = "upload" | "photos" | "description";

export default function App() {
  const [tab, setTab] = useState<Tab>("upload");
  const [photos, setPhotos] = useState<UploadedPhoto[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const { scores, isScoring, error: scoringError, scorePhotos, reset: resetScores } = usePhotoScoring();

  async function handlePhotosLoaded(loaded: UploadedPhoto[]) {
    setPhotos(loaded);
    setSelectedIds(new Set());
    resetScores();
    setTab("photos");

    const results = await scorePhotos(loaded);

    // Auto-select recommended photos
    const recommended = new Set(
      results
        .filter((s) => s.recommended)
        .map((s) => loaded[s.index]?.id)
        .filter(Boolean) as string[]
    );
    setSelectedIds(recommended);
  }

  function handleToggle(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      const score = scores.find((s) => photos[s.index]?.id === id);

      if (next.has(id)) {
        // Agent is removing a photo Claude selected
        next.delete(id);
        if (score) saveOverride(score.traits, score.roomType, "removed_selected");
      } else {
        // Agent is keeping a photo Claude rejected
        next.add(id);
        if (score) saveOverride(score.traits, score.roomType, "kept_rejected");
      }
      return next;
    });
  }

  function handleReset() {
    setPhotos([]);
    setSelectedIds(new Set());
    resetScores();
    setTab("upload");
  }

  const selectedPhotos = photos.filter((p) => selectedIds.has(p.id));

  const tabs: { id: Tab; label: string; count?: number }[] = [
    { id: "upload", label: "Upload" },
    { id: "photos", label: "Photos", count: photos.length },
    { id: "description", label: "Description", count: selectedPhotos.length },
  ];

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-2">
              <span className="text-xl">🏠</span>
              <span className="font-bold text-gray-900 text-lg tracking-tight">Piqd</span>
              <span className="text-xs text-gray-400 font-normal hidden sm:inline">
                Austin listing tool
              </span>
              {import.meta.env.VITE_USE_MOCK === "true" && (
                <span className="text-xs bg-amber-100 text-amber-700 font-medium px-2 py-0.5 rounded-full">
                  Mock mode
                </span>
              )}
            </div>
            {photos.length > 0 && (
              <button
                onClick={handleReset}
                className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
              >
                Start over
              </button>
            )}
          </div>

          {/* Tabs */}
          <div className="flex gap-1 -mb-px">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                disabled={t.id !== "upload" && photos.length === 0}
                className={`
                  flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors
                  ${tab === t.id
                    ? "border-violet-600 text-violet-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed"
                  }
                `}
              >
                {t.label}
                {t.count !== undefined && t.count > 0 && (
                  <span className={`
                    text-xs px-1.5 py-0.5 rounded-full font-medium
                    ${tab === t.id ? "bg-violet-100 text-violet-600" : "bg-gray-100 text-gray-500"}
                  `}>
                    {t.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">

        {/* Upload tab */}
        {tab === "upload" && (
          <div className="max-w-xl mx-auto">
            <div className="mb-8 text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Upload listing photos
              </h1>
              <p className="text-gray-500 text-sm">
                Piqd will score each photo and automatically select the best ones for your listing.
              </p>
            </div>
            <PhotoUploader onPhotosLoaded={handlePhotosLoaded} />
          </div>
        )}

        {/* Photos tab */}
        {tab === "photos" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-xl font-bold text-gray-900">Photo selection</h1>
                <p className="text-sm text-gray-500 mt-0.5">
                  Click any photo to include or exclude it from your listing.
                </p>
              </div>
              {selectedPhotos.length > 0 && (
                <button
                  onClick={() => setTab("description")}
                  className="bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors shadow-sm"
                >
                  Generate description →
                </button>
              )}
            </div>

            {/* Scoring status */}
            {isScoring && (
              <div className="mb-4 flex items-center gap-2 text-sm text-violet-600 bg-violet-50 border border-violet-200 rounded-lg px-4 py-3">
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                Scoring photos with AI — results appear as they arrive...
              </div>
            )}

            {scoringError && (
              <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                {scoringError}
              </div>
            )}

            <PhotoGrid
              photos={photos}
              scores={scores}
              selectedIds={selectedIds}
              onToggle={handleToggle}
            />
          </div>
        )}

        {/* Description tab */}
        {tab === "description" && (
          <div>
            <div className="mb-6">
              <h1 className="text-xl font-bold text-gray-900">Generate description</h1>
              <p className="text-sm text-gray-500 mt-0.5">
                Claude will write a listing description based on your {selectedPhotos.length} selected photo{selectedPhotos.length !== 1 ? "s" : ""}.
              </p>
            </div>
            <DescriptionPanel selectedPhotos={selectedPhotos} />
          </div>
        )}

      </main>
    </div>
  );
}
