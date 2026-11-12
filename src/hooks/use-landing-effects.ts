"use client";

import { useState, useEffect, useRef } from "react";

/**
 * Lightweight Typewriter Hook
 * Types text character-by-character once on mount.
 * Stays static after completion.
 * Respects prefers-reduced-motion.
 */
export function useTypewriter(fullText: string, speed = 40) {
  const [displayedText, setDisplayedText] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReduced) {
        const timer = setTimeout(() => {
          setDisplayedText(fullText);
          setIsComplete(true);
        }, 0);
        return () => clearTimeout(timer);
      }
    }

    let currentIndex = 0;
    const interval = setInterval(() => {
      currentIndex++;
      if (currentIndex <= fullText.length) {
        setDisplayedText(fullText.slice(0, currentIndex));
      } else {
        clearInterval(interval);
        setIsComplete(true);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [fullText, speed]);

  return { displayedText, isComplete };
}

/**
 * Lightweight Scroll Reveal Hook
 * Uses native IntersectionObserver to trigger entrance transitions when in view.
 * Zero external libraries.
 * Respects prefers-reduced-motion.
 */
export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(threshold = 0.05) {
  const elementRef = useRef<T>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReduced) {
        const timer = setTimeout(() => {
          setIsVisible(true);
        }, 0);
        return () => clearTimeout(timer);
      }
    }

    const currentElem = elementRef.current;
    if (currentElem) {
      // Immediate check if element is already within viewport
      const rect = currentElem.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        const timer = setTimeout(() => {
          setIsVisible(true);
        }, 50);
        return () => clearTimeout(timer);
      }
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Fire once and stay visible
        }
      },
      { threshold, rootMargin: "60px 0px -20px 0px" }
    );

    if (currentElem) {
      observer.observe(currentElem);
    }

    return () => {
      if (currentElem) observer.unobserve(currentElem);
    };
  }, [threshold]);

  return { elementRef, isVisible };
}
