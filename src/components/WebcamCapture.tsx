"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Props = {
  onCapture: (dataUrl: string | null) => void;
  photo: string | null;
};

export default function WebcamCapture({ onCapture, photo }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [active, setActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setActive(false);
  }, []);

  const startCamera = useCallback(async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 640, height: 480 },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setActive(true);
    } catch (err) {
      setError(
        "カメラを利用できませんでした。権限を確認するか、写真なしで続行してください。",
      );
      console.error(err);
    }
  }, []);

  const takePhoto = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.7);
    onCapture(dataUrl);
    stopStream();
  }, [onCapture, stopStream]);

  useEffect(() => {
    return () => stopStream();
  }, [stopStream]);

  if (photo) {
    return (
      <div className="flex flex-col items-center gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photo}
          alt="撮影した写真"
          className="h-48 w-64 rounded-xl border-4 border-brand object-cover"
        />
        <button
          type="button"
          onClick={() => onCapture(null)}
          className="rounded-lg bg-slate-200 px-4 py-2 text-sm font-bold text-slate-700"
        >
          撮り直す
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative h-48 w-64 overflow-hidden rounded-xl border-2 border-dashed border-slate-300 bg-slate-100">
        <video
          ref={videoRef}
          className={`h-full w-full object-cover ${active ? "" : "hidden"}`}
          playsInline
          muted
        />
        {!active && (
          <div className="flex h-full items-center justify-center text-5xl text-slate-300">
            📷
          </div>
        )}
      </div>

      {error && <p className="text-center text-sm text-red-600">{error}</p>}

      {!active ? (
        <button
          type="button"
          onClick={startCamera}
          className="rounded-lg bg-brand px-5 py-2 text-sm font-bold text-white"
        >
          カメラを起動（任意）
        </button>
      ) : (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={takePhoto}
            className="rounded-lg bg-green-600 px-5 py-2 text-sm font-bold text-white"
          >
            撮影する
          </button>
          <button
            type="button"
            onClick={stopStream}
            className="rounded-lg bg-slate-200 px-5 py-2 text-sm font-bold text-slate-700"
          >
            やめる
          </button>
        </div>
      )}
    </div>
  );
}
