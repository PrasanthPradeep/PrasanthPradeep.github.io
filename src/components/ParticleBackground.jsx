import React, { useEffect, useRef, memo } from 'react';

const ParticleBackground = () => {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: null, y: null, radius: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let width = window.innerWidth;
    let height = window.innerHeight;
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

    const GRID_SPACING = 40;
    const PARTICLE_SPEED = 0.15;
    const PARTICLE_BASE_SIZE = 1.2;
    const GLOW_RADIUS = 200;
    const PARTICLE_COUNT_RATIO = 0.00004;
    const MAX_PARTICLES_MOBILE = 35;
    const MAX_PARTICLES_DESKTOP = 70;

    let particles = [];

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * PARTICLE_SPEED;
        this.vy = (Math.random() - 0.5) * PARTICLE_SPEED;
        this.size = PARTICLE_BASE_SIZE + Math.random() * 0.6;
        this.opacity = 0.3 + Math.random() * 0.4;
        this.pulseSpeed = 0.002 + Math.random() * 0.003;
        this.pulseOffset = Math.random() * Math.PI * 2;
      }

      update(time) {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < -10) this.x = width + 10;
        if (this.x > width + 10) this.x = -10;
        if (this.y < -10) this.y = height + 10;
        if (this.y > height + 10) this.y = -10;

        const dx = mouseRef.current.x - this.x;
        const dy = mouseRef.current.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouseRef.current.radius && dist > 0) {
          const force = (1 - dist / mouseRef.current.radius) * 0.3;
          this.vx -= (dx / dist) * force;
          this.vy -= (dy / dist) * force;
        }

        const maxSpeed = PARTICLE_SPEED * 2;
        const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        if (speed > maxSpeed) {
          this.vx = (this.vx / speed) * maxSpeed;
          this.vy = (this.vy / speed) * maxSpeed;
        }

        this.currentOpacity = this.opacity + Math.sin(time * this.pulseSpeed + this.pulseOffset) * 0.1;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(161, 169, 209, ${this.currentOpacity})`;
        ctx.fill();
      }
    }

    const initParticles = () => {
      const isMobile = width < 768;
      const count = isMobile
        ? Math.min(Math.floor(width * height * PARTICLE_COUNT_RATIO), MAX_PARTICLES_MOBILE)
        : Math.min(Math.floor(width * height * PARTICLE_COUNT_RATIO), MAX_PARTICLES_DESKTOP);

      particles = [];
      for (let i = 0; i < count; i++) {
        particles.push(new Particle());
      }
    };

    const drawGrid = () => {
      ctx.fillStyle = 'rgba(82, 82, 91, 0.08)';
      for (let x = 0; x <= width; x += GRID_SPACING) {
        for (let y = 0; y <= height; y += GRID_SPACING) {
          ctx.beginPath();
          ctx.arc(x, y, 0.8, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };

    const drawMouseGlow = () => {
      if (mouseRef.current.x === null) return;
      const gradient = ctx.createRadialGradient(
        mouseRef.current.x, mouseRef.current.y, 0,
        mouseRef.current.x, mouseRef.current.y, GLOW_RADIUS
      );
      gradient.addColorStop(0, 'rgba(122, 162, 247, 0.06)');
      gradient.addColorStop(0.5, 'rgba(122, 162, 247, 0.02)');
      gradient.addColorStop(1, 'rgba(122, 162, 247, 0)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(mouseRef.current.x, mouseRef.current.y, GLOW_RADIUS, 0, Math.PI * 2);
      ctx.fill();
    };

    let time = 0;
    const animate = () => {
      time++;
      ctx.clearRect(0, 0, width, height);

      drawGrid();
      drawMouseGlow();

      for (const p of particles) {
        p.update(time);
        p.draw();
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    const init = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * pixelRatio);
      canvas.height = Math.floor(height * pixelRatio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      mouseRef.current.radius = Math.min(width, height) * 0.12;
      initParticles();
    };

    const handleMouseMove = (e) => {
      mouseRef.current.x = e.x;
      mouseRef.current.y = e.y;
    };

    const handleMouseOut = () => {
      mouseRef.current.x = null;
      mouseRef.current.y = null;
    };

    let resizeTimeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(init, 250);
    };

    init();
    animate();

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseout', handleMouseOut);
    window.addEventListener('resize', handleResize);

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseout', handleMouseOut);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="background-canvas"
      className="fixed top-0 left-0 w-full h-full"
      style={{ zIndex: 0, willChange: 'transform' }}
    />
  );
};

export default memo(ParticleBackground);
