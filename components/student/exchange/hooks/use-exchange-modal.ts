"use client";

import { useState, useEffect, useRef } from "react";
import {
  StudentKycData,
  AgreementSignature,
  AgreementPledge,
  validateNationalId,
  validatePhone,
  maskNationalId,
  maskPhone,
  sendPhoneOtp,
  verifyPhoneOtp,
  getSavedStudentKyc,
  validateSignatureFile,
  submitExchangeAgreementRequest,
  OFFICIAL_PLEDGE_TEXT,
  OFFICIAL_PLEDGE_VERSION,
} from "@/src/services/exchange-agreement-service";
import { useNotifications } from "@/src/contexts/notifications-context";
import { TwoStepExchangeModalProps } from "../modal-types";

export function useExchangeModal({
  isOpen,
  onClose,
  existingAgreementId,
  item,
  currentStudent,
  onSuccess,
}: TwoStepExchangeModalProps) {
  const { notify } = useNotifications();

  const [currentStep, setCurrentStep] = useState<1 | 2>(1);

  const [nationalId, setNationalId] = useState("");
  const [phone, setPhone] = useState("");
  const [studentId, setStudentId] = useState("");
  const [fullName, setFullName] = useState("");
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);

  const [otpCode, setOtpCode] = useState("");
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpCountdown, setOtpCountdown] = useState(0);
  const [otpNotice, setOtpNotice] = useState<string | null>(null);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const [pledgeAgreed, setPledgeAgreed] = useState(false);
  const [signatureType, setSignatureType] = useState<"canvas" | "upload">("canvas");
  const [signatureDataUrl, setSignatureDataUrl] = useState<string | null>(null);
  const [signatureSize, setSignatureSize] = useState<number>(0);
  const [signatureMime, setSignatureMime] = useState<string>("image/png");

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawnOnCanvas, setHasDrawnOnCanvas] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitErrorMessage, setSubmitErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    setCurrentStep(1);
    setSubmitErrorMessage(null);
    setPledgeAgreed(false);
    setSignatureDataUrl(null);
    setHasDrawnOnCanvas(false);
    setOtpSent(false);
    setOtpCode("");

    const savedKyc = getSavedStudentKyc(currentStudent.studentId || undefined);
    if (savedKyc) {
      setNationalId(savedKyc.nationalId || "");
      setPhone(savedKyc.phone || "");
      setStudentId(savedKyc.studentId || currentStudent.studentId || "");
      setFullName(savedKyc.fullName || currentStudent.name || "");
      setIsPhoneVerified(!!savedKyc.isPhoneVerified);
    } else {
      setFullName(currentStudent.name || "");
      setStudentId(currentStudent.studentId || "");
      setNationalId("");
      setPhone("");
      setIsPhoneVerified(false);
    }
  }, [isOpen, currentStudent]);

  useEffect(() => {
    if (otpCountdown <= 0) return;
    const interval = setInterval(() => {
      setOtpCountdown((c) => (c > 0 ? c - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [otpCountdown]);

  useEffect(() => {
    if (currentStep === 2 && signatureType === "canvas" && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.lineJoin = "round";
        ctx.lineCap = "round";
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = "#0057C8";
      }
    }
  }, [currentStep, signatureType]);

  const handleSendOtp = async () => {
    const phoneCheck = validatePhone(phone);
    if (!phoneCheck.valid) {
      setErrors((prev) => ({ ...prev, phone: phoneCheck.error || "رقم الجوال غير صحيح." }));
      return;
    }

    setErrors((prev) => {
      const copy = { ...prev };
      delete copy.phone;
      return copy;
    });

    setIsSendingOtp(true);
    setOtpNotice(null);

    try {
      const result = await sendPhoneOtp(phone);
      setIsSendingOtp(false);
      if (result.success) {
        setOtpSent(true);
        setOtpCountdown(60);
        setOtpNotice(`تم إرسال كود التحقق بنجاح (الكود التجريبي: ${result.otpCode})`);
      }
    } catch {
      setIsSendingOtp(false);
      setErrors((prev) => ({ ...prev, otp: "تعذر إرسال رمز التحقق حالياً." }));
    }
  };

  const handleVerifyOtp = async () => {
    if (!otpCode.trim()) {
      setErrors((prev) => ({ ...prev, otp: "يرجى كتابة رمز التحقق المكوّن من 4 أرقام." }));
      return;
    }

    setIsVerifyingOtp(true);
    setErrors((prev) => {
      const copy = { ...prev };
      delete copy.otp;
      return copy;
    });

    try {
      const result = await verifyPhoneOtp(phone, otpCode);
      setIsVerifyingOtp(false);
      if (result.success) {
        setIsPhoneVerified(true);
        setOtpNotice("تم تأكيد رقم الجوال بنجاح! ✓");
      } else {
        setErrors((prev) => ({ ...prev, otp: result.error || "رمز التحقق غير صحيح." }));
      }
    } catch {
      setIsVerifyingOtp(false);
      setErrors((prev) => ({ ...prev, otp: "فشل التحقق من الرمز." }));
    }
  };

  const handleProceedToStep2 = () => {
    const nextErrors: Record<string, string> = {};

    const idCheck = validateNationalId(nationalId);
    if (!idCheck.valid) {
      nextErrors.nationalId = idCheck.error || "رقم الهوية غير صحيح.";
    }

    const phoneCheck = validatePhone(phone);
    if (!phoneCheck.valid) {
      nextErrors.phone = phoneCheck.error || "رقم الجوال غير صحيح.";
    } else if (!isPhoneVerified) {
      nextErrors.phone = "يجب تأكيد رقم الجوال عبر رمز OTP للمتابعة.";
    }

    if (!studentId.trim()) {
      nextErrors.studentId = "الرقم الجامعي إجباري.";
    }

    if (!fullName.trim()) {
      nextErrors.fullName = "اسم الطالب إجباري.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    setCurrentStep(2);
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = ("touches" in e ? e.touches[0].clientX : e.clientX) - rect.left;
    const y = ("touches" in e ? e.touches[0].clientY : e.clientY) - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
    setHasDrawnOnCanvas(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = ("touches" in e ? e.touches[0].clientX : e.clientX) - rect.left;
    const y = ("touches" in e ? e.touches[0].clientY : e.clientY) - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      const dataUrl = canvas.toDataURL("image/png");
      setSignatureDataUrl(dataUrl);
      setSignatureMime("image/png");
      setSignatureSize(Math.round((dataUrl.length * 3) / 4));
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    setHasDrawnOnCanvas(false);
    setSignatureDataUrl(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const check = validateSignatureFile(file);
    if (!check.valid) {
      setErrors((prev) => ({ ...prev, signature: check.error || "ملف غير صالح." }));
      return;
    }

    setErrors((prev) => {
      const copy = { ...prev };
      delete copy.signature;
      return copy;
    });

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setSignatureDataUrl(dataUrl);
      setSignatureSize(file.size);
      setSignatureMime(file.type);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmitFinal = async () => {
    if (!signatureDataUrl) {
      setSubmitErrorMessage("يرجى إدراج توقيعك (رسم باللوحة أو رفع صورة) لاعتماد الاتفاقية.");
      return;
    }

    if (!pledgeAgreed) {
      setSubmitErrorMessage("يجب الموافقة على نص التعهد والمسؤولية الأكاديمية للاستمرار.");
      return;
    }

    setIsSubmitting(true);
    setSubmitErrorMessage(null);

    const studentKyc: StudentKycData = {
      nationalId: nationalId.trim(),
      maskedNationalId: maskNationalId(nationalId),
      phone: phone.trim(),
      maskedPhone: maskPhone(phone),
      studentId: studentId.trim(),
      fullName: fullName.trim(),
      college: currentStudent.faculty || "كلية الهندسة وتكنولوجيا المعلومات",
      major: currentStudent.major || "هندسة البرمجيات",
      isPhoneVerified: true,
    };

    const signature: AgreementSignature = {
      type: signatureType,
      dataUrl: signatureDataUrl,
      mimeType: signatureMime,
      sizeBytes: signatureSize,
      uploadedAt: new Date().toISOString(),
    };

    const pledge: AgreementPledge = {
      pledgeText: OFFICIAL_PLEDGE_TEXT,
      pledgeVersion: OFFICIAL_PLEDGE_VERSION,
      agreed: true,
      agreedAt: new Date().toISOString(),
    };

    try {
      const result = await submitExchangeAgreementRequest({
        existingAgreementId,
        itemType: item.category,
        itemId: item.id,
        itemName: item.title,
        itemCategory: item.category,
        ownerName: item.ownerName,
        ownerMajor: item.ownerMajor,
        depositAmount: item.depositAmount,
        dailyRate: item.dailyRate,
        durationDays: item.durationDays,
        durationText: item.durationText,
        proposedStartDate: new Date().toISOString().split("T")[0],
        studentKyc,
        pledge,
        signature,
      });

      setIsSubmitting(false);

      if (result.success) {
        notify({
          type: "general",
          title: "تم توثيق وتقديم طلب الاتفاقية! 📋",
          message: `تم رفع طلب "${item.title}" وهو الآن بانتظار موافقة المشرف. رقم الطلب: ${result.agreementId}.`,
          link: "/student/agreements",
          playSound: true,
          browserNotify: true,
        });

        if (onSuccess) {
          onSuccess(result.agreementId);
        }
        onClose();
      } else {
        setSubmitErrorMessage(result.message || "تعذر إرسال الطلب، يرجى المحاولة لاحقاً.");
      }
    } catch {
      setIsSubmitting(false);
      setSubmitErrorMessage("حدث خطأ أثناء الاتصال بالخادم، يرجى إعادة المحاولة.");
    }
  };

  return {
    currentStep,
    setCurrentStep,
    nationalId,
    setNationalId,
    phone,
    setPhone,
    studentId,
    setStudentId,
    fullName,
    setFullName,
    isPhoneVerified,
    setIsPhoneVerified,
    otpCode,
    setOtpCode,
    isSendingOtp,
    isVerifyingOtp,
    otpSent,
    otpCountdown,
    otpNotice,
    errors,
    setErrors,
    pledgeAgreed,
    setPledgeAgreed,
    signatureType,
    setSignatureType,
    signatureDataUrl,
    setSignatureDataUrl,
    canvasRef,
    hasDrawnOnCanvas,
    setHasDrawnOnCanvas,
    isSubmitting,
    submitErrorMessage,
    handleSendOtp,
    handleVerifyOtp,
    handleProceedToStep2,
    startDrawing,
    draw,
    stopDrawing,
    clearCanvas,
    handleFileUpload,
    handleSubmitFinal,
  };
}

