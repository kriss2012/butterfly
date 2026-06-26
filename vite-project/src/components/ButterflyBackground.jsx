import React, { useState, useEffect, useRef, useCallback } from "react";
import "./ButterflyBackground.css";
import ButterflyEngine from "./ButterflyEngine";
import ControlPanel from "./ControlPanel";
import StatsBar from "./StatsBar";
import { useDimensions } from "../hooks/useDimensions";
import { useMouseRepulsion } from "../hooks/useMouseRepulsion";
import { useAnimationLoop } from "../hooks/useAnimationLoop";
import { tickPhysics } from "./ButterflyEngine/physics";
import { createButterfly } from "../systems/spawner";

const DEFAULT_CONFIG = {
  BUTTERFLY_CAP: 20,
  TRAIL_LENGTH: 150,
  TRAIL_DECAY: 0.022,
  REPULSION_RADIUS: 120,
  REPULSION_FORCE: 0.8,
  GRAVITY_MODE: "Earth",
  GRAVITY_Y: [-1.2, -0.3],
  DRIFT_AMPLITUDE: [0.3, 1.1],
  WIND_ANGLE: 0,
  WIND_STRENGTH: 0,
  PALETTE_INDEX: -1,
  WING_COLORS: null,
};

export default function ButterflyBackground() {
  const containerRef = useRef(null);
  const dims = useDimensions(containerRef);
  const { mousePos, setMousePos } = useMouseRepulsion(containerRef);

  const [butterflies, setButterflies] = useState([]);
  const [trails, setTrails] = useState([]);
  const [tick, setTick] = useState(0);
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [isSandbox, setIsSandbox] = useState(false);
  const [isPanelCollapsed, setIsPanelCollapsed] = useState(true);

  // FPS Telemetry
  const [fps, setFps] = useState(60);
  const lastFrameTime = useRef(Date.now());
  const frameTimes = useRef([]);

  // Scroll Telemetry
  const lastScrollY = useRef(0);
  const lastScrollTime = useRef(Date.now());
  const scrollVelocity = useRef(0);
  const nextId = useRef(0);

  // Initialize butterflies
  useEffect(() => {
    if (!dims.width || !dims.height) return;
    const initial = Array.from({ length: config.BUTTERFLY_CAP }, (_, i) =>
      createButterfly(nextId.current++, dims.width, dims.height, config)
    );
    setButterflies(initial);
  }, [dims.width, dims.height]);

  // Handle cap changes or resized canvas
  useEffect(() => {
    if (!dims.width || !dims.height) return;
    setButterflies(prev => {
      if (prev.length > config.BUTTERFLY_CAP) {
        return prev.slice(0, config.BUTTERFLY_CAP);
      } else if (prev.length < config.BUTTERFLY_CAP) {
        const diff = config.BUTTERFLY_CAP - prev.length;
        const added = Array.from({ length: diff }, () =>
          createButterfly(nextId.current++, dims.width, dims.height, config)
        );
        return [...prev, ...added];
      }
      return prev;
    });
  }, [config.BUTTERFLY_CAP]);

  // Track scroll speed
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const currentTime = Date.now();
      const dt = Math.max(currentTime - lastScrollTime.current, 1);
      const dy = currentScrollY - lastScrollY.current;

      // Scroll velocity in pixels/ms
      scrollVelocity.current = dy / dt;

      lastScrollY.current = currentScrollY;
      lastScrollTime.current = currentTime;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Spawn butterfly at coordinates
  const spawnAt = useCallback((x, y) => {
    setButterflies(prev => {
      const bf = createButterfly(nextId.current++, dims.width, dims.height, config);
      bf.x = x;
      bf.y = y;
      bf.vy = config.GRAVITY_Y[0] * 1.5; // Spawn with higher launch speed
      const next = [...prev, bf];
      // Keep it within max cap + temporary sandbox spawns (allow up to +10 over cap temporarily)
      if (next.length > config.BUTTERFLY_CAP + 10) {
        return next.slice(1);
      }
      return next;
    });
  }, [dims, config]);

  // Physics animation tick
  const handleTick = useCallback((currentTick) => {
    setTick(currentTick);

    // Calculate FPS
    const now = Date.now();
    const elapsed = now - lastFrameTime.current;
    lastFrameTime.current = now;

    frameTimes.current.push(elapsed);
    if (frameTimes.current.length > 30) {
      frameTimes.current.shift();
    }
    const avgElapsed = frameTimes.current.reduce((a, b) => a + b, 0) / frameTimes.current.length;
    const currentFps = Math.round(1000 / avgElapsed);
    if (currentTick % 10 === 0) {
      setFps(currentFps > 62 ? 60 : currentFps);
    }

    // Decay scroll speed
    scrollVelocity.current *= 0.92;

    // Run physics update
    setButterflies(prevButterflies => {
      const result = tickPhysics(
        prevButterflies,
        trails,
        currentTick,
        mousePos,
        dims,
        config,
        scrollVelocity.current
      );
      setTrails(result.trails);
      return result.butterflies;
    });
  }, [trails, mousePos, dims, config]);

  // Hook up animation loop
  useAnimationLoop(handleTick);

  // Spawn on click inside sandbox
  const handleClick = useCallback((e) => {
    if (!isSandbox) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    spawnAt(e.clientX - rect.left, e.clientY - rect.top);
  }, [isSandbox, spawnAt]);

  const handleReset = () => {
    setConfig(DEFAULT_CONFIG);
    if (dims.width) {
      const resetSet = Array.from({ length: DEFAULT_CONFIG.BUTTERFLY_CAP }, (_, i) =>
        createButterfly(nextId.current++, dims.width, dims.height, DEFAULT_CONFIG)
      );
      setButterflies(resetSet);
      setTrails([]);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`butterfly-bg-container ${isSandbox ? "sandbox-active" : ""}`}
      onClick={isSandbox ? handleClick : undefined}
    >
      {/* Background canvas rendering */}
      <ButterflyEngine
        butterflies={butterflies}
        trails={trails}
        tick={tick}
        dims={dims}
        mousePos={mousePos}
        repulsionRadius={config.REPULSION_RADIUS}
      />

      {/* Floating HUD Controls */}
      <div className="hud-overlay">
        <button
          className={`sandbox-toggle-btn ${isSandbox ? "active" : ""}`}
          onClick={() => {
            setIsSandbox(!isSandbox);
            setMousePos(null);
            if (!isSandbox) {
              setIsPanelCollapsed(false); // Auto open controls when entering sandbox
            }
          }}
        >
          {isSandbox ? "✕ Close Sandbox" : "🔬 Physics Sandbox"}
        </button>

        <StatsBar
          activeCount={butterflies.length}
          tick={tick}
          trailsCount={trails.length}
          fps={fps}
          gravityMode={config.GRAVITY_MODE}
          windSpeed={config.WIND_STRENGTH}
        />
      </div>

      {/* Control Panel */}
      <ControlPanel
        config={config}
        onChange={setConfig}
        onReset={handleReset}
        isCollapsed={isPanelCollapsed}
        setIsCollapsed={setIsPanelCollapsed}
      />

      {/* Dynamic Instruction Banner */}
      <div className={`sandbox-instruction ${isSandbox ? "show" : ""}`}>
        <div className="pulse-dot" />
        <span>Click to Spawn • Hover to Repel • Drag Panels</span>
      </div>
    </div>
  );
}
