import { useState, useCallback } from "react";
import { callClaude, imageToMessageContent } from "../lib/claude";
import { DESCRIPTION_SYSTEM, buildDescriptionPrompt, type PropertyDetails } from "../lib/prompts";
import type { UploadedPhoto } from "../components/PhotoUploader";

interface UseDescriptionReturn {
  description: string | null;
  isGenerating: boolean;
  error: string | null;
  generateDescription: (
    selectedPhotos: UploadedPhoto[],
    details: PropertyDetails
  ) => Promise<void>;
  reset: () => void;
}

const MAX_DESCRIPTION_PHOTOS = 12;

export function useDescription(): UseDescriptionReturn {
  const [description, setDescription] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateDescription = useCallback(
    async (selectedPhotos: UploadedPhoto[], details: PropertyDetails): Promise<void> => {
      setIsGenerating(true);
      setError(null);
      setDescription(null);

      try {
        // Use top N photos to stay within token limits
        // Prioritize variety — take every Nth photo to spread across rooms
        const photosToSend = selectedPhotos.slice(0, MAX_DESCRIPTION_PHOTOS);

        const imageContents = photosToSend.map((photo) =>
          imageToMessageContent(photo.base64, photo.file.type)
        );

        const response = await callClaude({
          system: DESCRIPTION_SYSTEM,
          messages: [
            {
              role: "user",
              content: [
                ...imageContents,
                {
                  type: "text",
                  text: buildDescriptionPrompt(details),
                },
              ],
            },
          ],
          maxTokens: 1500,
        });

        setDescription(response.trim());
      } catch (err) {
        const message = err instanceof Error ? err.message : "Description generation failed";
        setError(message);
      } finally {
        setIsGenerating(false);
      }
    },
    []
  );

  const reset = useCallback(() => {
    setDescription(null);
    setError(null);
    setIsGenerating(false);
  }, []);

  return { description, isGenerating, error, generateDescription, reset };
}
