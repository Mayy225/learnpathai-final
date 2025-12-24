
import React, { useEffect, useRef, useState } from 'react';
import { cn } from "@/lib/utils";

interface TransitionProps {
  children: React.ReactNode;
  className?: string;
  animation?: 'fade-in' | 'slide-up' | 'slide-down' | 'scale-in';
  delay?: number;
  threshold?: number;
  duration?: number;
  once?: boolean;
}

const Transition: React.FC<TransitionProps> = ({
  children,
  className,
  animation = 'fade-in',
  delay = 0,
  threshold = 0.1,
  duration = 500,
  once = true
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentRef = ref.current;
    
    if (!currentRef) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!once || (once && !hasAnimated)) {
            setIsVisible(true);
            if (once) setHasAnimated(true);
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin: '0px'
      }
    );
    
    observer.observe(currentRef);
    
    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [threshold, once, hasAnimated]);
  
  const animationClass = `animate-${animation}`;
  
  return (
    <div 
      ref={ref}
      className={cn(
        isVisible ? animationClass : 'opacity-0',
        className
      )}
      style={{ 
        animationDuration: `${duration}ms`, 
        animationDelay: `${delay}ms`,
        animationFillMode: 'forwards'
      }}
    >
      {children}
    </div>
  );
};

export default Transition;
