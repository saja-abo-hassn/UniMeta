import { MeasuredTarget, SPOTLIGHT_PADDING } from "../types";

interface TourSpotlightFrameProps {
  targetRect: MeasuredTarget | null;
  prefersReducedMotion: boolean;
}

export function TourSpotlightFrame({
  targetRect,
  prefersReducedMotion,
}: TourSpotlightFrameProps) {
  if (!targetRect) return null;

  const frameLeft = Math.round(targetRect.left - SPOTLIGHT_PADDING);
  const frameTop = Math.round(targetRect.top - SPOTLIGHT_PADDING);
  const frameWidth = Math.round(targetRect.width + SPOTLIGHT_PADDING * 2);
  const frameHeight = Math.round(targetRect.height + SPOTLIGHT_PADDING * 2);
  const frameRadius = Math.round(targetRect.borderRadius + SPOTLIGHT_PADDING);

  return (
    <div
      className="fixed pointer-events-none z-40"
      style={{
        left: `${frameLeft}px`,
        top: `${frameTop}px`,
        width: `${frameWidth}px`,
        height: `${frameHeight}px`,
        borderRadius: `${frameRadius}px`,
        border: "2px solid #0057C8",
        boxShadow:
          "0 0 0 9999px rgba(11, 25, 44, 0.60), 0 0 8px rgba(0, 87, 200, 0.35)",
        transition: prefersReducedMotion
          ? "none"
          : "top 250ms cubic-bezier(0.4, 0, 0.2, 1), left 250ms cubic-bezier(0.4, 0, 0.2, 1), width 250ms cubic-bezier(0.4, 0, 0.2, 1), height 250ms cubic-bezier(0.4, 0, 0.2, 1), border-radius 250ms cubic-bezier(0.4, 0, 0.2, 1)",
      }}
      aria-hidden="true"
    />
  );
}

