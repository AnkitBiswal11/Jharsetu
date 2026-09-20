import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const transcribeComplaint = createServerFn({ method: "POST" })
  .inputValidator((d) =>
    z
      .object({
        audioBase64: z.string().min(100),
        language: z.string().optional(),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    try {
      // Decode base64 PCM/WAV back to binary
      const binaryString = atob(data.audioBase64);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      const blob = new Blob([bytes], { type: "audio/wav" });
      const formData = new FormData();
      formData.append("file", blob, "complaint.wav");
      if (data.language) {
        formData.append("language", data.language);
      }

      // Send directly to FastAPI backend on port 8000
      const response = await fetch("http://localhost:8000/api/voice/transcribe", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Voice transcription failed with status ${response.status}`);
      }

      const result = await response.json();
      return { text: (result.text || "").trim() };
    } catch (err: any) {
      console.error("[Voice Transcription Local Bridge Error]:", err);
      throw new Error(err.message || "Voice transcription service unreachable.");
    }
  });