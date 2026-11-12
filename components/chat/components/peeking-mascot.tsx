import Image from "next/image";
import { MascotState, getImageConfig } from "../types";

interface PeekingMascotProps {
  mascotMounted: boolean;
  mascotVisible: boolean;
  isMobile: boolean;
  displayedState: MascotState;
  isTransitioning: boolean;
}

export function PeekingMascot({
  mascotMounted,
  mascotVisible,
  isMobile,
  displayedState,
  isTransitioning,
}: PeekingMascotProps) {
  if (!mascotMounted) return null;

  const currentImgConfig = getImageConfig(displayedState);

  let mascotMotionClass = "mascot-idle-float";
  let mascotInlineTransform = "";

  if (displayedState === "typing") {
    mascotMotionClass = "";
    mascotInlineTransform = isMobile
      ? "translate3d(0, -4px, 0)"
      : "translate3d(0, -6px, 0) rotate(3deg)";
  } else if (displayedState === "idle") {
    mascotMotionClass = "mascot-idle-float mascot-slow-blink";
  }

  return (
    <div
      className={`absolute bottom-full end-6 sm:end-8 pointer-events-none select-none overflow-hidden z-20 transition-all duration-250 ease-out ${
        mascotVisible
          ? "opacity-100 translate-y-0 scale-100"
          : "opacity-0 translate-y-6 scale-90"
      }`}
      style={{
        width: isMobile ? "68px" : "80px",
        height: isMobile ? "58px" : "68px",
      }}
      aria-hidden="true"
    >
      <div
        className={`relative w-full h-full transition-transform duration-200 ease-out ${mascotMotionClass}`}
        style={mascotInlineTransform ? { transform: mascotInlineTransform } : undefined}
      >
        <div
          key={displayedState}
          className={`relative w-full h-full transition-all duration-200 ease-out ${
            isTransitioning
              ? "opacity-0 translate-y-1 scale-95"
              : "opacity-100 translate-y-0 scale-100"
          }`}
        >
          <Image
            src={currentImgConfig.src}
            alt={currentImgConfig.alt}
            fill
            className={currentImgConfig.imgClass}
            priority
          />
        </div>
      </div>
    </div>
  );
}

