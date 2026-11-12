import React from "react";
import Image from "next/image";
import {
  maskNationalId,
  OFFICIAL_PLEDGE_TEXT,
  OFFICIAL_PLEDGE_VERSION,
} from "@/src/services/exchange-agreement-service";

interface StepPledgeSignatureProps {
  fullName: string;
  nationalId: string;
  onBackToStep1: () => void;
  pledgeAgreed: boolean;
  setPledgeAgreed: (agreed: boolean) => void;
  signatureType: "canvas" | "upload";
  setSignatureType: (type: "canvas" | "upload") => void;
  signatureDataUrl: string | null;
  setSignatureDataUrl: (url: string | null) => void;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  hasDrawnOnCanvas: boolean;
  setHasDrawnOnCanvas: (drawn: boolean) => void;
  startDrawing: (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => void;
  draw: (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => void;
  stopDrawing: () => void;
  clearCanvas: () => void;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errors: Record<string, string>;
  submitErrorMessage: string | null;
}

export function StepPledgeSignature({
  fullName,
  nationalId,
  onBackToStep1,
  pledgeAgreed,
  setPledgeAgreed,
  signatureType,
  setSignatureType,
  signatureDataUrl,
  setSignatureDataUrl,
  canvasRef,
  hasDrawnOnCanvas,
  setHasDrawnOnCanvas,
  startDrawing,
  draw,
  stopDrawing,
  clearCanvas,
  handleFileUpload,
  errors,
  submitErrorMessage,
}: StepPledgeSignatureProps) {
  return (
    <div className="space-y-5 animate-fade-in">
      <div className="p-3 rounded-2xl bg-[#F0F7FD] border border-[#D7EAF7] flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-[#16324A]">{fullName}</span>
          <span className="text-[#8297A8]">&bull;</span>
          <span className="font-mono text-[#0057C8]">{maskNationalId(nationalId)}</span>
        </div>
        <button
          type="button"
          onClick={onBackToStep1}
          className="text-[11px] font-bold text-[#0057C8] hover:underline"
        >
          تعديل بيانات الخطوة 1 &larr;
        </button>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-extrabold text-[#16324A] flex items-center gap-1.5">
            <span>📜</span>
            <span>وثيقة التعهد والالتزام الأكاديمي</span>
          </label>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#EAF4FD] text-[#0057C8] border border-[#BEE3F8]">
            {OFFICIAL_PLEDGE_VERSION}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-[#F8FBFE] border border-[#D7EAF7] max-h-40 overflow-y-auto text-xs text-[#16324A] leading-relaxed whitespace-pre-line font-medium shadow-inner">
          {OFFICIAL_PLEDGE_TEXT}
        </div>

        <label className="flex items-start gap-2.5 pt-1 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={pledgeAgreed}
            onChange={(e) => setPledgeAgreed(e.target.checked)}
            className="w-4 h-4 rounded border-[#D7EAF7] text-[#0057C8] focus:ring-[#0057C8] mt-0.5 shrink-0"
          />
          <span className="text-xs font-bold text-[#16324A] leading-relaxed">
            قرأت بنود التعهد والمسؤولية أعلاه، وأوافق عليها بكامل الأهلية والالتزام الأكاديمي والمدني.
          </span>
        </label>
      </div>

      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-extrabold text-[#16324A]">
            التوقيع الرقمي المعتمد للاتفاقية (إجباري)
          </label>
          <span className="text-[11px] text-[#8297A8]">اختر طريقة التوقيع الأنسب لك</span>
        </div>

        <div className="grid grid-cols-2 p-1 rounded-xl bg-[#F0F6FA] border border-[#D7EAF7] text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setSignatureType("canvas");
              setSignatureDataUrl(null);
              setHasDrawnOnCanvas(false);
            }}
            className={`py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
              signatureType === "canvas"
                ? "bg-white text-[#0057C8] shadow-xs"
                : "text-[#66788A] hover:text-[#16324A]"
            }`}
          >
            <span>✍️</span>
            <span>رسم التوقيع (شاشة لمس / ماوس)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setSignatureType("upload");
              setSignatureDataUrl(null);
            }}
            className={`py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
              signatureType === "upload"
                ? "bg-white text-[#0057C8] shadow-xs"
                : "text-[#66788A] hover:text-[#16324A]"
            }`}
          >
            <span>📤</span>
            <span>رفع صورة التوقيع (PNG/JPG)</span>
          </button>
        </div>

        {signatureType === "canvas" && (
          <div className="space-y-2 animate-fade-in">
            <div className="relative border-2 border-dashed border-[#BEE3F8] hover:border-[#0057C8] rounded-2xl bg-white overflow-hidden shadow-inner flex flex-col items-center justify-center">
              <canvas
                ref={canvasRef}
                width={500}
                height={160}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                className="w-full h-40 cursor-crosshair touch-none"
              />

              {!hasDrawnOnCanvas && (
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center text-xs text-[#8297A8] font-medium">
                  <span>ارسم توقيعك هنا بالماوس أو الإصبع...</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-[11px] text-[#8297A8]">توقيع رسمي ملزم</span>
              <button
                type="button"
                onClick={clearCanvas}
                disabled={!hasDrawnOnCanvas}
                className="text-xs font-bold text-red-600 hover:text-red-700 disabled:opacity-30 transition-colors"
              >
                مسح وإعادة الرسم ↺
              </button>
            </div>
          </div>
        )}

        {signatureType === "upload" && (
          <div className="space-y-2 animate-fade-in">
            <div className="p-5 border-2 border-dashed border-[#BEE3F8] hover:border-[#0057C8] rounded-2xl bg-[#F8FBFE] text-center space-y-2">
              <input
                type="file"
                id="signature-file-input"
                accept="image/png, image/jpeg, image/jpg, image/webp"
                onChange={handleFileUpload}
                className="hidden"
              />
              <label
                htmlFor="signature-file-input"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0057C8] text-white text-xs font-bold hover:bg-[#0046A0] transition-colors cursor-pointer shadow-xs"
              >
                <span>اختيار صورة التوقيع</span>
                <span>📎</span>
              </label>
              <p className="text-[11px] text-[#66788A]">
                الصيغ المسموحة: PNG، JPG، WebP &bull; الحد الأقصى للحجم: <strong>2MB</strong>
              </p>
            </div>
            {errors.signature && <p className="text-[11px] text-red-600">{errors.signature}</p>}
          </div>
        )}

        {signatureDataUrl && (
          <div className="p-3.5 rounded-2xl bg-[#F0F7FD] border border-[#BEE3F8] flex items-center justify-between gap-4 animate-fade-in">
            <div className="space-y-0.5">
              <span className="text-[11px] font-bold text-[#0057C8] block">معاينة التوقيع المعتمد:</span>
              <span className="text-[10px] text-[#8297A8]">
                الموقع: {fullName} &bull; التاريخ: {new Date().toLocaleDateString("ar-EG")}
              </span>
            </div>

            <div className="p-1 bg-white rounded-xl border border-[#D7EAF7] shadow-2xs max-w-[160px] h-14 flex items-center justify-center">
              <Image
                src={signatureDataUrl}
                alt="Signature Preview"
                width={150}
                height={50}
                unoptimized
                className="max-h-full max-w-full object-contain"
              />
            </div>
          </div>
        )}
      </div>

      {submitErrorMessage && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2 animate-fade-in">
          <span>✕</span>
          <span>{submitErrorMessage}</span>
        </div>
      )}
    </div>
  );
}

