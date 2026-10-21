"use client";

import React, { useEffect, useRef, useState } from "react";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  once?: boolean;
}

/**
 * COMPONENT HIỆU ỨNG CUỘN XUẤT HIỆN (SCROLL REVEAL MOTION)
 * Bắt chuyển động khi người dùng cuộn tới từng phần, tạo hiệu ứng mượt mà đẳng cấp.
 * Hỗ trợ tự động tái kích hoạt chuyển động mỗi khi người dùng lướt đi lướt lại.
 */
export default function Reveal({
  children,
  className = "",
  delay = 0,
  duration = 700,
  direction = "up",
  once = false,
}: RevealProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold: 0.05, rootMargin: "0px 0px -20px 0px" }
    );

    const el = ref.current;
    if (el) observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
    };
  }, [once]);

  const getTransform = () => {
    if (isVisible) return "translate-x-0 translate-y-0 opacity-100 scale-100";
    if (direction === "up") return "translate-y-8 opacity-0 scale-[0.98]";
    if (direction === "down") return "-translate-y-8 opacity-0 scale-[0.98]";
    if (direction === "left") return "-translate-x-8 opacity-0";
    if (direction === "right") return "translate-x-8 opacity-0";
    return "opacity-0 scale-95";
  };

  return (
    <div
      ref={ref}
      style={{
        transitionDuration: isVisible ? `${duration}ms` : "150ms",
        transitionDelay: isVisible ? `${delay}ms` : "0ms",
      }}
      className={`transition-all ease-out transform ${getTransform()} ${className}`}
    >
      {children}
    </div>
  );
}
