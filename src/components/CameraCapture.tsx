"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { t, type TranslationKey } from "@/lib/i18n";
import type { Language } from "@/lib/types";

interface CameraCaptureProps {
  language: Language;
  mode?: "visitor" | "business_card";
  onCapture: (photoData: string) => void;
  onSkip: () => void;
}

export function CameraCapture({
  language,
  mode = "visitor",
  onCapture,
  onSkip,
}: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cameraReady, setCameraReady] = useState(false);

  const isBusinessCard = mode === "business_card";
  const titleKey: TranslationKey = isBusinessCard
    ? "businessCardCapture"
    : "photoCapture";
  const instructionKey: TranslationKey = isBusinessCard
    ? "businessCardInstruction"
    : "photoInstruction";
  const skipKey: TranslationKey = isBusinessCard
    ? "skipBusinessCard"
    : "skipPhoto";

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: isBusinessCard ? "environment" : "user",
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });
        if (!mounted) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
          setCameraReady(true);
        }
      } catch {
        if (mounted) {
          setError(t(language, "cameraError"));
        }
      }
    }

    if (!preview) {
      startCamera();
    }

    return () => {
      mounted = false;
      stopCamera();
    };
  }, [preview, language, stopCamera, isBusinessCard]);

  function takePhoto() {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
    setPreview(dataUrl);
    stopCamera();
  }

  function retake() {
    setPreview(null);
    setCameraReady(false);
  }

  function confirm() {
    if (preview) {
      onCapture(preview);
    }
  }

  return (
    <div className="flex flex-col items-center gap-8">
      <h2 className="kiosk-heading text-center text-4xl">
        {t(language, titleKey)}
      </h2>
      <p className="max-w-2xl text-center text-xl text-[var(--yobell-muted)]">
        {t(language, instructionKey)}
      </p>

      {error ? (
        <div className="rounded-2xl border-2 border-amber-200 bg-amber-50 px-8 py-6 text-center text-xl text-amber-800">
          {error}
        </div>
      ) : (
        <div className="relative overflow-hidden rounded-3xl border-4 border-[var(--yobell-border)] bg-black shadow-2xl">
          {preview ? (
            <img
              src={preview}
              alt="Captured"
              className="h-[400px] w-[600px] max-w-full object-cover"
            />
          ) : (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="h-[400px] w-[600px] max-w-full object-cover"
            />
          )}
          <canvas ref={canvasRef} className="hidden" />
          {!cameraReady && !preview && !error && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-xl text-white">
              {t(language, "cameraStarting")}
            </div>
          )}
        </div>
      )}

      <div className="flex w-full max-w-2xl flex-col gap-4">
        {preview ? (
          <>
            <button type="button" onClick={confirm} className="kiosk-btn-primary">
              {isBusinessCard ? t(language, "callHost") : t(language, "next")}
            </button>
            <button
              type="button"
              onClick={retake}
              className="kiosk-btn-secondary"
            >
              {t(language, "retakePhoto")}
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={takePhoto}
              disabled={!cameraReady || !!error}
              className="kiosk-btn-primary disabled:opacity-50"
            >
              {t(language, "takePhoto")}
            </button>
            <button type="button" onClick={onSkip} className="kiosk-btn-secondary">
              {t(language, skipKey)}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
