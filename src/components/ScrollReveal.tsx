import React, { ReactNode, CSSProperties } from 'react';
import { useScrollAnimation, useParallax } from './ScrollAnimations';

// ─── Animation Types ───────────────────────────────────────────────────
type AnimationType = 
  | 'fade-up' 
  | 'fade-down' 
  | 'fade-left' 
  | 'fade-right' 
  | 'fade' 
  | 'scale' 
  | 'slide-up'
  | 'slide-down';

interface ScrollRevealProps {
  children: ReactNode;
  animation?: AnimationType;
  delay?: number;
  duration?: number;
  threshold?: number;
  className?: string;
  style?: CSSProperties;
  as?: keyof JSX.IntrinsicElements;
}

// Animation configurations
const animations: Record<AnimationType, { hidden: CSSProperties; visible: CSSProperties }> = {
  'fade-up': {
    hidden: { opacity: 0, transform: 'translateY(40px)' },
    visible: { opacity: 1, transform: 'translateY(0)' },
  },
  'fade-down': {
    hidden: { opacity: 0, transform: 'translateY(-40px)' },
    visible: { opacity: 1, transform: 'translateY(0)' },
  },
  'fade-left': {
    hidden: { opacity: 0, transform: 'translateX(-40px)' },
    visible: { opacity: 1, transform: 'translateX(0)' },
  },
  'fade-right': {
    hidden: { opacity: 0, transform: 'translateX(40px)' },
    visible: { opacity: 1, transform: 'translateX(0)' },
  },
  'fade': {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  'scale': {
    hidden: { opacity: 0, transform: 'scale(0.95)' },
    visible: { opacity: 1, transform: 'scale(1)' },
  },
  'slide-up': {
    hidden: { opacity: 0, transform: 'translateY(60px)' },
    visible: { opacity: 1, transform: 'translateY(0)' },
  },
  'slide-down': {
    hidden: { opacity: 0, transform: 'translateY(-60px)' },
    visible: { opacity: 1, transform: 'translateY(0)' },
  },
};

export function ScrollReveal({
  children,
  animation = 'fade-up',
  delay = 0,
  duration = 0.7,
  threshold = 0.1,
  className = '',
  style = {},
  as: Component = 'div',
}: ScrollRevealProps) {
  const [ref, isVisible] = useScrollAnimation<HTMLDivElement>({
    threshold,
    triggerOnce: true,
  });

  const animConfig = animations[animation];

  const combinedStyle: CSSProperties = {
    ...style,
    ...(isVisible ? animConfig.visible : animConfig.hidden),
    transition: `opacity ${duration}s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${delay}s, transform ${duration}s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${delay}s`,
    willChange: 'opacity, transform',
  };

  return React.createElement(
    Component,
    { ref, className, style: combinedStyle },
    children
  );
}

// ─── Parallax Container ────────────────────────────────────────────────
interface ParallaxProps {
  children: ReactNode;
  speed?: number;
  className?: string;
  style?: CSSProperties;
}

export function Parallax({
  children,
  speed = 0.3,
  className = '',
  style = {},
}: ParallaxProps) {
  const [ref, offset] = useParallax<HTMLDivElement>({ speed });

  const combinedStyle: CSSProperties = {
    ...style,
    transform: `translateY(${offset}px)`,
    willChange: 'transform',
  };

  return (
    <div ref={ref} className={className} style={combinedStyle}>
      {children}
    </div>
  );
}

// ─── Stagger Container ─────────────────────────────────────────────────
interface StaggerContainerProps {
  children: ReactNode;
  staggerDelay?: number;
  className?: string;
  style?: CSSProperties;
}

export function StaggerContainer({
  children,
  staggerDelay = 0.1,
  className = '',
  style = {},
}: StaggerContainerProps) {
  const [ref, isVisible] = useScrollAnimation<HTMLDivElement>({
    threshold: 0.1,
    triggerOnce: true,
  });

  return (
    <div ref={ref} className={className} style={style}>
      {React.Children.map(children, (child, index) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<{ style?: CSSProperties }>, {
            style: {
              ...(child.props as { style?: CSSProperties }).style,
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
              transition: `opacity 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${index * staggerDelay}s, transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${index * staggerDelay}s`,
              willChange: 'opacity, transform',
            },
          });
        }
        return child;
      })}
    </div>
  );
}

// ─── Scroll Progress Bar ───────────────────────────────────────────────
import { useScrollProgress } from './ScrollAnimations';

export function ScrollProgressBar() {
  const progress = useScrollProgress();

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: `${progress}%`,
        height: '3px',
        background: 'var(--grad-primary)',
        zIndex: 9999,
        transition: 'width 0.1s ease-out',
      }}
    />
  );
}

export default ScrollReveal;
