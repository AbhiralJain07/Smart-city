# Project ASUR - Zephyrus Duo 2026 Landing Experience

## Project Overview
Project ASUR is an ultra-premium cinematic product experience for the Zephyrus Duo 2026. This is not a webpage; it's an interactive unveiling of a machine built for power.

## Core Directives

### Asur Aesthetics DNA
- **Visual Language**: Hybrid of Samsung Minimalism + ROG Cyber-Tech
- **Samsung Elements**: Clean layouts, bold typography, generous white space
- **ROG Elements**: High-contrast neon accents, RGB motion, dynamic lighting
- **Neon Restriction**: Electric Cyan/Neon Magenta reserved exclusively for performance elements

### Dual Screen First
- Primary optimization for dual 16" OLED panel experience
- Adaptive layouts for single/dual screen configurations
- Synchronized content across both screens

## Performance Laws (Unbreakable)

### Load Performance
- Initial Load & LCP: < 2.5 seconds
- Sustained 60 FPS for all animations
- Interactive readiness within 3 seconds

### Asset Constraints
- 3D Models: GLB format, < 3 MB each
- Images: WebP format, < 300 KB each
- Videos: WebM format, optimized for web
- Lazy Loading: Mandatory for all off-screen content

## Motion System Architecture

### Three-Layer Motion Design
1. **Layer 1**: Layout motion via Framer Motion
2. **Layer 2**: Scroll-synced physics via GSAP ScrollTrigger
3. **Layer 3**: Interactive 3D via Three.js

### Motion Constraints
- All animations must support `prefers-reduced-motion`
- GPU acceleration mandatory for smooth transitions
- Intersection Observer for performance optimization

## Technical Stack

### Core Framework
- **Next.js**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling

### Animation & Interaction
- **Framer Motion**: React animation library
- **GSAP**: Professional animation suite with ScrollTrigger
- **Three.js**: 3D graphics and WebGL
- **React Three Fiber**: React renderer for Three.js

### Development Tools
- **ESLint**: Code quality
- **TypeScript**: Static typing
- **PostCSS**: CSS processing

## Component Architecture

### Core Components
```
components/
├── ui/
│   ├── Button/
│   ├── Typography/
│   └── Layout/
├── motion/
│   ├── ScrollAnimator/
│   ├── ParallaxContainer/
│   └── MotionLayer/
├── three/
│   ├── ModelViewer/
│   ├── Scene3D/
│   └── LightingSystem/
└── sections/
    ├── Hero/
    ├── Performance/
    ├── Display/
    └── Features/
```

### Performance Optimization
- Component-level lazy loading
- Asset optimization pipeline
- Memory management for 3D scenes
- Efficient state management

## Accessibility Requirements

### Keyboard Navigation
- Full keyboard accessibility
- Logical tab order
- Focus management for dynamic content

### Screen Reader Support
- Comprehensive ARIA labels
- Semantic HTML structure
- Alternative text for visual content

### Motion Accessibility
- Respect `prefers-reduced-motion`
- Provide static alternatives
- Control mechanisms for animations

## Asset Pipeline

### Image Optimization
- WebP format with fallbacks
- Responsive image generation
- Progressive loading

### 3D Model Pipeline
- GLB format optimization
- LOD (Level of Detail) implementation
- Compression techniques

### Video Optimization
- WebM format with MP4 fallback
- Adaptive quality streaming
- Thumbnail generation

## Development Workflow

### Spec-Driven Development
1. Create detailed component specs
2. Define props, behavior, dependencies
3. Implement after spec approval
4. Performance testing integration

### Testing Strategy
- Unit tests for core logic
- Performance benchmarks
- Accessibility audits
- Cross-device testing

## Deployment Considerations

### Performance Monitoring
- Core Web Vitals tracking
- Real User Monitoring (RUM)
- Performance budgets

### CDN Strategy
- Global asset distribution
- Edge caching for static assets
- Optimized delivery pipelines

## Success Metrics

### Technical Metrics
- Lighthouse score > 95
- Core Web Vitals compliance
- 60 FPS animation performance

### User Experience Metrics
- Engagement time > 2 minutes
- Scroll depth > 80%
- Conversion rate optimization

## Risk Mitigation

### Performance Risks
- Asset size monitoring
- Animation performance budgets
- Memory leak prevention

### Compatibility Risks
- Browser compatibility matrix
- Fallback strategies
- Progressive enhancement
