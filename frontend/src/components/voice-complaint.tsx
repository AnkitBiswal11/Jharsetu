import { useRef, useState } from "react";
import { toast } from "sonner";
import { Loader2, Mic, Square } from "lucide-react";
import { transcribeComplaint } from "@/lib/voice.functions";
import { useI18n } from "@/lib/i18n";

/** Encode captured PCM chunks as a complete 16-bit mono 16 kHz WAV file. */
function encodeWav(chunks: Float32Array[], sampleRate: number): Blob {
  const target = 16000;
  const merged = new Float32Array(chunks.reduce((n, c) => n + c.length, 0));
  let offset = 0;
  for (const c of chunks) {
    merged.set(c, offset);
    offset += c.length;
  }
  const ratio = sampleRate / target;
  const outLength = Math.floor(merged.length / ratio);
  const samples = new Int16Array(outLength);
  for (let i = 0; i < outLength; i++) {
    const s = Math.max(-1, Math.min(1, merged[Math.floor(i * ratio)] ?? 0));
    samples[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
  }
  const buffer = new ArrayBuffer(44 + samples.length * 2);
  const view = new DataView(buffer);
  const writeStr = (o: number, s: string) => {
    for (let i = 0; i < s.length; i++) view.setUint8(o + i, s.charCodeAt(i));
  };
  writeStr(0, "RIFF");
  view.setUint32(4, 36 + samples.length * 2, true);
  writeStr(8, "WAVE");
  writeStr(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, target, true);
  view.setUint32(28, target * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeStr(36, "data");
  view.setUint32(40, samples.length * 2, true);
  new Int16Array(buffer, 44).set(samples);
  return new Blob([buffer], { type: "audio/wav" });
}

const toBase64 = (blob: Blob) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(",")[1] ?? "");
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });

export function VoiceComplaint({ onText }: { onText: (text: string) => void }) {
  const { t, speechLang } = useI18n();
  const [state, setState] = useState<"idle" | "recording" | "working">("idle");
  const media = useRef<{
    stream: MediaStream;
    ctx: AudioContext;
    node: ScriptProcessorNode;
    source: MediaStreamAudioSourceNode;
    pcm: Float32Array[];
  } | null>(null);

  const start = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const ctx = new AudioContext();
      const source = ctx.createMediaStreamSource(stream);
      const node = ctx.createScriptProcessor(4096, 1, 1);
      const pcm: Float32Array[] = [];
      node.onaudioprocess = (e) => pcm.push(new Float32Array(e.inputBuffer.getChannelData(0)));
      source.connect(node);
      node.connect(ctx.destination);
      media.current = { stream, ctx, node, source, pcm };
      setState("recording");
    } catch {
      toast.error(t("voice.mic"));
    }
  };

  const stop = async () => {
    const m = media.current;
    if (!m) return;
    media.current = null;
    m.stream.getTracks().forEach((tr) => tr.stop());
    m.node.disconnect();
    m.source.disconnect();
    const blob = encodeWav(m.pcm, m.ctx.sampleRate);
    await m.ctx.close();
    if (blob.size < 4096) {
      setState("idle");
      toast.error(t("voice.failed"), { description: t("voice.hint") });
      return;
    }
    setState("working");
    try {
      const audioBase64 = await toBase64(blob);
      const res = await transcribeComplaint({ data: { audioBase64, language: speechLang } });
      if (!res.text) throw new Error("empty");
      onText(res.text);
      toast.success(t("voice.done"));
    } catch (e) {
      toast.error(t("voice.failed"), {
        description: e instanceof Error ? e.message : undefined,
      });
    } finally {
      setState("idle");
    }
  };

  return (
    <div className="rounded-xl border border-teal/30 bg-teal/5 p-3">
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => void (state === "recording" ? stop() : start())}
          disabled={state === "working"}
          className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-bold transition-colors disabled:opacity-60 ${
            state === "recording"
              ? "bg-destructive text-white"
              : "bg-teal text-white hover:bg-navy"
          }`}
        >
          {state === "working" ? (
            <Loader2 className="size-4 animate-spin" />
          ) : state === "recording" ? (
            <Square className="size-3.5" />
          ) : (
            <Mic className="size-4" />
          )}
          {state === "working"
            ? t("voice.working")
            : state === "recording"
              ? t("voice.stop")
              : t("voice.start")}
        </button>
        <span className="flex-1 text-[11px] text-muted-foreground">
          {state === "recording" ? (
            <span className="inline-flex items-center gap-2 font-semibold text-destructive">
              <span className="pulse-dot" /> {t("voice.listening")}
            </span>
          ) : (
            t("voice.hint")
          )}
        </span>
      </div>
    </div>
  );
}
