import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";
import { SpeechToTextConvertResponse } from "@elevenlabs/elevenlabs-js/api";

export async function transcribeAudio(
  audioBuffer: Buffer,
  mimeType: string
): Promise<string> {
  const elevenlabs = new ElevenLabsClient();

  const file = new File([new Uint8Array(audioBuffer)], "audio.mp3", {
    type: mimeType,
  });

  const transcription: SpeechToTextConvertResponse =
    await elevenlabs.speechToText.convert({
      file,
      modelId: "scribe_v1",
      tagAudioEvents: true,
      diarize: false, // ensures single-speaker output
    });

  if ("text" in transcription && typeof transcription.text === "string") {
    return transcription.text;
  }

  if ("transcription" in transcription && transcription.transcription) {
    const t = transcription.transcription as any;
    if (t.transcript) return t.transcript;
    if (Array.isArray(t.channels))
      return t.channels.map((c: any) => c.transcript || "").join(" ");
  }

  throw new Error(
    "Unable to extract transcription text from ElevenLabs response."
  );
}
