"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/src/contexts/auth-context";
import {
  StudentKycData,
  AgreementSignature,
  AgreementPledge,
  validateNationalId,
  validatePhone,
  maskNationalId,
  maskPhone,
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
  const { user, verifyEmail, resendVerificationCode, refreshProfile } = useAuth();

  const [currentStep, setCurrentStep] = useState<1 | 2>(1);

  const [nationalId, setNationalId] = useState("");
  const [phone, setPhone] = useState("");
  const [studentId, setStudentId] = useState("");
  const [fullName, setFullName] = useState("");
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  const [otpCode, setOtpCode] = useState("");
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [showAgreementEmailNotice, setShowAgreementEmailNotice] = useState(false);
  const [otpCountdown, setOtpCountdown] = useState(0);
  const [otpNotice, setOtpNotice] = useState<string | null>(null);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const [pledgeAgreed, setPledgeAgreed] = useState(false);
  const [signatureType, setSignatureType] = useState<"canvas" | "upload">("canvas");
  const [signatureDataUrl, setSignatureDataUrl] = useState<string | null>(null);
  const [signatureSize, setSignatureSize] = useState<number>(0);
  const [signatureMime, setSignatureMime] = useState<string>("image/png");

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const sendingOtpRef = useRef(false);
  const verifyingOtpRef = useRef(false);
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
    setShowAgreementEmailNotice(false);
    setOtpCode("");

    const savedKyc = getSavedStudentKyc(currentStudent.studentId || undefined);
    if (savedKyc) {
      setNationalId(savedKyc.nationalId || "");
      setPhone(savedKyc.phone || "");
      setStudentId(savedKyc.studentId || currentStudent.studentId || "");
      setFullName(savedKyc.fullName || currentStudent.name || "");
      setIsEmailVerified(user?.emailVerified === true);
    } else {
      setFullName(currentStudent.name || "");
      setStudentId(currentStudent.studentId || "");
      setNationalId("");
      setPhone("");
      setIsEmailVerified(user?.emailVerified === true);
    }
  }, [isOpen, currentStudent, user?.emailVerified]);

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
    if (sendingOtpRef.current) return;
    const email = user?.email?.trim();
    if (!email) {
      setErrors((prev) => ({ ...prev, otp: "تعذر العثور على البريد الإلكتروني للحساب. سجّل الدخول مجددًا." }));
      return;
    }

    setErrors((prev) => {
      const copy = { ...prev };
      delete copy.otp;
      return copy;
    });

    sendingOtpRef.current = true;
    setIsSendingOtp(true);
    setOtpNotice(null);

    try {
      const result = await resendVerificationCode(email);
      setIsSendingOtp(false);
      if (!result.errors && result.status !== undefined && result.status >= 200 && result.status < 300) {
        setOtpSent(true);
        setOtpCountdown(60);
        setOtpNotice("تم إرسال رمز التحقق إلى بريدك الإلكتروني.");
        setShowAgreementEmailNotice(true);
      } else {
        setErrors((prev) => ({ ...prev, otp: "تعذر إرسال رمز التحقق إلى البريد الإلكتروني. يرجى المحاولة مجددًا." }));
      }
    } catch {
      setIsSendingOtp(false);
      setErrors((prev) => ({ ...prev, otp: "تعذر إرسال رمز التحقق إلى البريد الإلكتروني. يرجى المحاولة مجددًا." }));
    } finally {
      sendingOtpRef.current = false;
    }
  };

  const handleVerifyOtp = async () => {
    if (verifyingOtpRef.current) return;
    const submittedCode = otpCode.replace(/\D/g, "");
    if (submittedCode.length !== 6) {
      setErrors((prev) => ({ ...prev, otp: "يرجى إدخال رمز التحقق المكوّن من 6 أرقام." }));
      return;
    }

    verifyingOtpRef.current = true;
    setIsVerifyingOtp(true);
    setErrors((prev) => {
      const copy = { ...prev };
      delete copy.otp;
      return copy;
    });

    try {
      const email = user?.email?.trim();
      if (!email || !/^\d{6}$/.test(submittedCode)) {
        setIsVerifyingOtp(false);
        setErrors((prev) => ({ ...prev, otp: "يرجى إدخال رمز التحقق المكوّن من 6 أرقام." }));
        return;
      }

      const result = await verifyEmail(email, submittedCode);
      setIsVerifyingOtp(false);
      if (!result.errors && result.status !== undefined && result.status >= 200 && result.status < 300) {
        const refreshedUser = await refreshProfile();
        if (refreshedUser?.emailVerified === false) {
          setErrors((prev) => ({ ...prev, otp: "لم يؤكد الخادم حالة البريد بعد. حدّث الصفحة أو أعد المحاولة." }));
          return;
        }
        setIsEmailVerified(true);
        setOtpNotice("تم التحقق من البريد الإلكتروني.");
      } else {
        setErrors((prev) => ({ ...prev, otp: result.message || "رمز التحقق غير صحيح أو منتهي الصلاحية." }));
      }
    } catch {
      setIsVerifyingOtp(false);
      setErrors((prev) => ({ ...prev, otp: "تعذر التحقق من الرمز. يرجى المحاولة مجددًا." }));
    } finally {
      verifyingOtpRef.current = false;
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
    }

    if (!isEmailVerified) nextErrors.otp = "يجب التحقق من البريد الإلكتروني للمتابعة.";

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
      isEmailVerified: true,
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
    email: user?.email || "",
    studentId,
    setStudentId,
    fullName,
    setFullName,
    isEmailVerified,
    otpCode,
    setOtpCode,
    isSendingOtp,
    isVerifyingOtp,
    otpSent,
    otpCountdown,
    otpNotice,
    showAgreementEmailNotice,
    setShowAgreementEmailNotice,
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

