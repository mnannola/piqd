import { useState } from "react";
import type { PropertyDetails } from "../lib/prompts";
import type { UploadedPhoto } from "./PhotoUploader";
import { useDescription } from "../hooks/useDescription";

interface DescriptionPanelProps {
  selectedPhotos: UploadedPhoto[];
}

const NEIGHBORHOODS = [
  "East Austin", "South Congress", "Travis Heights", "Mueller",
  "Bouldin Creek", "Hyde Park", "Tarrytown", "Westlake",
  "Round Rock", "Cedar Park", "Leander", "Pflugerville",
  "Domain / North Austin", "South Lamar", "Barton Hills", "Other",
];

export default function DescriptionPanel({ selectedPhotos }: DescriptionPanelProps) {
  const { description, isGenerating, error, generateDescription, reset } = useDescription();
  const [copied, setCopied] = useState(false);

  const [details, setDetails] = useState<PropertyDetails>({
    beds: "",
    baths: "",
    sqft: "",
    neighborhood: "",
    highlights: "",
  });

  function handleChange(field: keyof PropertyDetails, value: string) {
    setDetails((prev) => ({ ...prev, [field]: value }));
  }

  async function handleGenerate() {
    if (selectedPhotos.length === 0) return;
    await generateDescription(selectedPhotos, details);
  }

  async function handleCopy() {
    if (!description) return;
    await navigator.clipboard.writeText(description);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const canGenerate = selectedPhotos.length > 0 && !isGenerating;

  return (
    <div className="space-y-6">

      {/* Property details form */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-4">Property details</h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Beds</label>
            <input
              type="number"
              min="0"
              value={details.beds}
              onChange={(e) => handleChange("beds", e.target.value)}
              placeholder="3"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Baths</label>
            <input
              type="number"
              min="0"
              step="0.5"
              value={details.baths}
              onChange={(e) => handleChange("baths", e.target.value)}
              placeholder="2"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Sq ft</label>
            <input
              type="number"
              min="0"
              value={details.sqft}
              onChange={(e) => handleChange("sqft", e.target.value)}
              placeholder="1800"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Neighborhood</label>
            <select
              value={details.neighborhood}
              onChange={(e) => handleChange("neighborhood", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent bg-white"
            >
              <option value="">Select...</option>
              {NEIGHBORHOODS.map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Agent highlights
            <span className="text-gray-400 font-normal ml-1">(optional — anything you want emphasized)</span>
          </label>
          <textarea
            value={details.highlights}
            onChange={(e) => handleChange("highlights", e.target.value)}
            placeholder="e.g. New roof 2024, original hardwoods, walk to Barton Springs, no HOA..."
            rows={3}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none"
          />
        </div>
      </div>

      {/* Selected photos count */}
      {selectedPhotos.length === 0 && (
        <div className="rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-700">
          Select at least one photo in the Photos tab before generating a description.
        </div>
      )}

      {/* Generate button */}
      <button
        onClick={handleGenerate}
        disabled={!canGenerate}
        className={`
          w-full py-3 rounded-xl font-semibold text-sm transition-all duration-150
          ${canGenerate
            ? "bg-violet-600 hover:bg-violet-700 text-white shadow-sm hover:shadow-md"
            : "bg-gray-100 text-gray-400 cursor-not-allowed"
          }
        `}
      >
        {isGenerating
          ? "Generating description..."
          : `Generate description from ${selectedPhotos.length} photo${selectedPhotos.length !== 1 ? "s" : ""}`
        }
      </button>

      {/* Error */}
      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Generated description */}
      {description && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold text-gray-900">Listing description</h2>
            <div className="flex gap-2">
              <button
                onClick={handleCopy}
                className="text-xs font-medium px-3 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors text-gray-600"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
              <button
                onClick={reset}
                className="text-xs font-medium px-3 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors text-gray-600"
              >
                Regenerate
              </button>
            </div>
          </div>
          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
            {description}
          </p>
          <p className="text-xs text-gray-400 mt-4">
            {description.split(" ").length} words
          </p>
        </div>
      )}
    </div>
  );
}
