import React, { useEffect, useRef, useState } from 'react';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number; // Delay in milliseconds
  duration?: number; // Duration in milliseconds
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  distance?: string; // Distance to translate, e.g. "30px"
  threshold?: number; // Intersection threshold
  once?: boolean; // Whether animation should trigger only once
}

export default function ScrollReveal({
  children,
  className = '',
  delay = 0,
  duration = 800,
  direction = 'up',
  distance = '24px',
  threshold = 0.08,
  once = true,
}: ScrollRevealProps) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const domRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          if (once && domRef.current) {
            observer.unobserve(domRef.current);
          }
        } else if (!once) {
          setIsIntersecting(false);
        }
      },
      {
        threshold,
        rootMargin: '0px 0px -50px 0px', // slightly offset trigger for better feel
      }
    );

    const currentRef = domRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [once, threshold]);

  // Generate translation styles based on direction
  const getTransformStyle = () => {
    if (!isIntersecting) {
      switch (direction) {
        case 'up':
          return `translate3d(0, ${distance}, 0)`;
        case 'down':
          return `translate3d(0, -${distance}, 0)`;
        case 'left':
          return `translate3d(${distance}, 0, 0)`;
        case 'right':
          return `translate3d(-${distance}, 0, 0)`;
        case 'none':
        default:
          return 'none';
      }
    }
    return 'translate3d(0, 0, 0)';
  };

  const style: React.CSSProperties = {
    opacity: isIntersecting ? 1 : 0,
    transform: getTransformStyle(),
    transition: `opacity ${duration}ms cubic-bezier(0.16, 1, 0.3, 1), transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1)`,
    transitionDelay: `${delay}ms`,
    willChange: 'transform, opacity',
  };

  return (
    <div ref={domRef} style={style} className={className}>
      {children}
    </div>
  );
}
