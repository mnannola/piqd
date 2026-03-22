import { useState, useCallback } from "react";
import { callClaude, imageToMessageContent, parseJSON } from "../lib/claude";
import { PHOTO_SCORING_SYSTEM, buildScoringPrompt } from "../lib/prompts";
import type { UploadedPhoto } from "../components/PhotoUploader";

export interface PhotoScore {
  index: number;
  score: number;
  roomType: string;
  traits: string[];
  reasoning: string;
  recommended: boolean;
}

interface UsePhotoScoringReturn {
  scores: PhotoScore[];
  isScoring: boolean;
  error: string | null;
  scorePhotos: (photos: UploadedPhoto[]) => Promise<PhotoScore[]>;
  reset: () => void;
}

const BATCH_SIZE = 10;

export function usePhotoScoring(): UsePhotoScoringReturn {
  const [scores, setScores] = useState<PhotoScore[]>([]);
  const [isScoring, setIsScoring] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scorePhotos = useCallback(async (photos: UploadedPhoto[]): Promise<PhotoScore[]> => {
    setIsScoring(true);
    setError(null);
    setScores([]);

    const allScores: PhotoScore[] = [];

    try {
      // Process in batches to avoid token limits
      for (let i = 0; i < photos.length; i += BATCH_SIZE) {
        const batch = photos.slice(i, i + BATCH_SIZE);
        const batchOffset = i;

        const imageContents = batch.map((photo) =>
          imageToMessageContent(photo.base64, photo.file.type)
        );

        const response = await callClaude({
          system: PHOTO_SCORING_SYSTEM,
          messages: [
            {
              role: "user",
              content: [
                ...imageContents,
                {
                  type: "text",
                  text: buildScoringPrompt(batch.length),
                },
              ],
            },
          ],
          maxTokens: 2000,
        });

        const batchScores = parseJSON<PhotoScore[]>(response);

        // Offset indices to match original photo array position
        const offsetScores = batchScores.map((s) => ({
          ...s,
          index: s.index + batchOffset,
        }));

        allScores.push(...offsetScores);

        // Update state progressively so UI shows scores as they arrive
        setScores((prev) => [...prev, ...offsetScores]);
      }

      return allScores;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Scoring failed";
      setError(message);
      return [];
    } finally {
      setIsScoring(false);
    }
  }, []);

  const reset = useCallback(() => {
    setScores([]);
    setError(null);
    setIsScoring(false);
  }, []);

  return { scores, isScoring, error, scorePhotos, reset };
}
