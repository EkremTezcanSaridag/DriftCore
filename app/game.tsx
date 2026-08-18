import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  LayoutChangeEvent,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { ScreenContainer } from '../components/ui/ScreenContainer';
import { GameHUD } from '../components/game/GameHUD';
import { PauseModal } from '../components/game/PauseModal';
import { GameOverModal } from '../components/game/GameOverModal';
import { LevelCompleteModal } from '../components/game/LevelCompleteModal';
import { CyberCar } from '../components/game/CyberCar';
import { DriftAnchor } from '../components/game/DriftAnchor';
import { LaserBeam } from '../components/game/LaserBeam';
import { SkidMarks } from '../components/game/SkidMarks';
import { EnergyShard } from '../components/game/EnergyShard';
import { NeonCoin } from '../components/game/NeonCoin';
import { DriftParticleSystem, Particle } from '../components/game/DriftParticleSystem';
import { TrackRenderer } from '../components/game/TrackRenderer';
import { TrackProgressBar } from '../components/game/TrackProgressBar';
import { Card } from '../components/ui/Card';
import { Colors } from '../constants/colors';
import { Typography } from '../constants/typography';
import { Radius, Spacing } from '../constants/spacing';
import { Config } from '../constants/config';
import { useGameStore } from '../store/useGameStore';
import { useLevelStore } from '../store/useLevelStore';
import { GameState, Vector2D } from '../types/game';
import { CyberCarState, DriftAnchor as DriftAnchorType, SkidMark } from '../types/physics';
import { ILevel, CollectibleData } from '../types/level';
import { mainGameEngine } from '../game/core/GameEngine';
import { driftPhysicsSystem } from '../game/systems/DriftPhysicsSystem';
import { LevelRegistry } from '../game/levels/LevelRegistry';
import { saveService } from '../services/SaveService';

interface ActiveCollectible extends CollectibleData {
  worldPos: Vector2D;
  collected: boolean;
}

export default function GameScreen() {
  const router = useRouter();
  const searchParams = useLocalSearchParams<{ levelId?: string }>();

  // Determine active level ID
  const storeActiveLevelId = useGameStore((state) => state.activeLevelId);
  const activeLevelId = searchParams.levelId || storeActiveLevelId || 'level_01';
  const currentLevel = LevelRegistry.getLevelById(activeLevelId);

  // Viewport dimensions measured on layout
  const [viewportDimensions, setViewportDimensions] = useState<{
    width: number;
    height: number;
  }>({ width: 0, height: 0 });

  // Game state from Zustand stores
  const {
    gameState,
    score,
    highScore,
    setGameState,
    setScore,
    setHighScore,
  } = useGameStore();

  const { unlockLevel, updateLevelStars } = useLevelStore();

  // New High Score Flag for current session
  const [isNewHighScore, setIsNewHighScore] = useState(false);

  // Camera & Render States
  const [cameraY, setCameraY] = useState<number>(0);
  const [trackProgress, setTrackProgress] = useState<number>(0);
  const [comboMultiplier, setComboMultiplier] = useState<number>(1);
  const [shardsCount, setShardsCount] = useState<number>(0);
  const [coinsCount, setCoinsCount] = useState<number>(0);
  const [isNitroActive, setIsNitroActive] = useState<boolean>(false);

  const [carRenderState, setCarRenderState] = useState<CyberCarState>({
    position: { x: 120, y: 2200 },
    velocity: { x: 0, y: -240 },
    angle: 0,
    speed: 240,
    isHooked: false,
    activeAnchorId: null,
    orbitRadius: 0,
    orbitAngle: 0,
    orbitDirection: 1,
    driftScoreMultiplier: 1,
  });

  const [anchors, setAnchors] = useState<DriftAnchorType[]>([]);
  const [collectibles, setCollectibles] = useState<ActiveCollectible[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [skidMarks, setSkidMarks] = useState<SkidMark[]>([]);
  const [activeHookAnchor, setActiveHookAnchor] = useState<DriftAnchorType | null>(null);
  const [perfectDriftText, setPerfectDriftText] = useState<string | null>(null);

  // Mutable high-frequency refs for 60 FPS tick loop
  const carStateRef = useRef<CyberCarState>({ ...carRenderState });
  const anchorsRef = useRef<DriftAnchorType[]>([]);
  const collectiblesRef = useRef<ActiveCollectible[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const skidMarksRef = useRef<SkidMark[]>([]);
  const cameraYRef = useRef<number>(0);
  const isHoldingTouchRef = useRef<boolean>(false);
  const scoreAccumulatorRef = useRef<number>(0);
  const comboMultiplierRef = useRef<number>(1);
  const shardsCountRef = useRef<number>(0);
  const coinsCountRef = useRef<number>(0);
  const hookStartTimeRef = useRef<number>(0);
  const nitroEndTimeRef = useRef<number>(0);
  const viewportWidthRef = useRef<number>(0);
  const viewportHeightRef = useRef<number>(0);
  const gameStateRef = useRef<GameState>(GameState.READY);
  const currentLevelRef = useRef<ILevel>(currentLevel);
  const isInitializedRef = useRef<boolean>(false);
  const startYRef = useRef<number>(2250);
  const finishLineYRef = useRef<number>(120);
  const totalTrackLengthRef = useRef<number>(2400);

  // Sync refs
  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  useEffect(() => {
    currentLevelRef.current = currentLevel;
  }, [currentLevel]);

  // Load High Score on initial mount
  useEffect(() => {
    saveService.load().then((savedData) => {
      if (savedData?.highScore) {
        setHighScore(savedData.highScore);
      }
    });
  }, [setHighScore]);

  // Spawn dynamic particle burst
  const spawnParticles = (x: number, y: number, color: string, count: number = 8) => {
    const newParticles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      const speed = 60 + Math.random() * 120;
      const angle = Math.random() * Math.PI * 2;
      newParticles.push({
        id: `${Date.now()}-${Math.random()}`,
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 3 + Math.random() * 4,
        color,
        life: 1.0,
        maxLife: 1.0,
      });
    }
    particlesRef.current = [...particlesRef.current, ...newParticles];
  };

  // Initialize Vertical Scrolling Track Session
  const initGameSession = useCallback(
    (width: number, height: number, level: ILevel) => {
      if (width <= 50 || height <= 50) return;

      viewportWidthRef.current = width;
      viewportHeightRef.current = height;
      totalTrackLengthRef.current = level.trackLength || 2400;
      finishLineYRef.current = level.finishLineY ?? 120;
      startYRef.current = level.startPosRatio.yWorld;

      // Start Car in world space
      const startPos: Vector2D = {
        x: Math.round(width * level.startPosRatio.x),
        y: level.startPosRatio.yWorld,
      };

      const startAngle = level.startAngle ?? 0;
      const initialSpeed = 240;

      // Center initial camera on car
      const initialCameraY = Math.max(
        0,
        Math.min(
          totalTrackLengthRef.current - height,
          startPos.y - height * 0.72
        )
      );
      cameraYRef.current = initialCameraY;

      const initialCarState: CyberCarState = {
        position: startPos,
        velocity: { x: 0, y: -initialSpeed },
        angle: startAngle,
        speed: initialSpeed,
        isHooked: false,
        activeAnchorId: null,
        orbitRadius: 0,
        orbitAngle: 0,
        orbitDirection: 1,
        driftScoreMultiplier: 1,
      };

      // Calculate track anchors in world space
      const calculatedAnchors: DriftAnchorType[] = (level.anchors || []).map((anchorData) => ({
        id: anchorData.id,
        name: anchorData.name,
        position: {
          x: Math.round(width * anchorData.xRatio),
          y: anchorData.yWorld,
        },
        radius: anchorData.radius ?? 16,
        activeRange: anchorData.activeRange ?? 160,
        color: anchorData.color ?? Colors.secondary,
      }));

      // Calculate track collectibles in world space
      const calculatedCollectibles: ActiveCollectible[] = (level.collectibles || []).map((c) => ({
        ...c,
        worldPos: {
          x: Math.round(width * c.xRatio),
          y: c.yWorld,
        },
        collected: false,
      }));

      carStateRef.current = { ...initialCarState };
      anchorsRef.current = calculatedAnchors;
      collectiblesRef.current = calculatedCollectibles;
      particlesRef.current = [];
      skidMarksRef.current = [];
      isHoldingTouchRef.current = false;
      scoreAccumulatorRef.current = 0;
      comboMultiplierRef.current = 1;
      shardsCountRef.current = 0;
      coinsCountRef.current = 0;
      nitroEndTimeRef.current = 0;

      setAnchors(calculatedAnchors);
      setCollectibles(calculatedCollectibles);
      setParticles([]);
      setSkidMarks([]);
      setActiveHookAnchor(null);
      setCarRenderState(initialCarState);
      setCameraY(initialCameraY);
      setTrackProgress(0);
      setComboMultiplier(1);
      setShardsCount(0);
      setCoinsCount(0);
      setIsNitroActive(false);
      setScore(0);
      setIsNewHighScore(false);
      setPerfectDriftText(null);

      isInitializedRef.current = true;
      gameStateRef.current = GameState.PLAYING;
      setGameState(GameState.PLAYING);
    },
    [setScore, setGameState]
  );

  // Handle Viewport Layout Measurement
  const handleArenaLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    if (width > 50 && height > 50) {
      setViewportDimensions({ width, height });
      initGameSession(width, height, currentLevel);
    }
  };

  // Touch Handlers for Sling-Drift Hook
  const handleTouchDown = () => {
    if (!isInitializedRef.current || gameStateRef.current !== GameState.PLAYING) return;

    isHoldingTouchRef.current = true;
    hookStartTimeRef.current = Date.now();
    const currentCar = carStateRef.current;

    const bestAnchor = driftPhysicsSystem.findBestAnchor(currentCar.position, anchorsRef.current);
    if (bestAnchor) {
      const hookedCar = driftPhysicsSystem.attachHook(currentCar, bestAnchor);
      carStateRef.current = hookedCar;
      setActiveHookAnchor(bestAnchor);
      setCarRenderState({ ...hookedCar });

      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      } catch {}
    }
  };

  const handleTouchUp = () => {
    if (!isInitializedRef.current) return;

    isHoldingTouchRef.current = false;
    const currentCar = carStateRef.current;

    if (currentCar.isHooked) {
      const hookDuration = (Date.now() - hookStartTimeRef.current) / 1000;
      const releasedCar = driftPhysicsSystem.releaseHook(currentCar);
      carStateRef.current = releasedCar;
      setActiveHookAnchor(null);

      // Evaluate Perfect Drift & Combo Boost
      if (hookDuration >= 0.25) {
        const nextCombo = Math.min(5, comboMultiplierRef.current + 1);
        comboMultiplierRef.current = nextCombo;
        setComboMultiplier(nextCombo);

        const bonusPoints = 50 * nextCombo;
        scoreAccumulatorRef.current += bonusPoints;
        setPerfectDriftText(`PERFECT DRIFT! x${nextCombo} (+${bonusPoints})`);

        // Trigger Nitro Boost for 0.7s
        nitroEndTimeRef.current = Date.now() + 700;
        setIsNitroActive(true);

        spawnParticles(currentCar.position.x, currentCar.position.y, Colors.primary, 10);
      } else {
        setPerfectDriftText('GOOD DRIFT! +25');
        scoreAccumulatorRef.current += 25;
      }

      setCarRenderState({ ...releasedCar });
      setTimeout(() => setPerfectDriftText(null), 1200);

      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch {}
    }
  };

  // 60 FPS Main Game Loop Engine Tick
  useEffect(() => {
    let skidFrameCounter = 0;

    const updateTick = (deltaTime: number) => {
      if (!isInitializedRef.current || gameStateRef.current !== GameState.PLAYING) return;

      let car = { ...carStateRef.current };
      const currentAnchors = anchorsRef.current;
      const height = viewportHeightRef.current;
      const width = viewportWidthRef.current;
      const totalLength = totalTrackLengthRef.current;

      // 1. Check Hook Connection
      if (isHoldingTouchRef.current && !car.isHooked) {
        const bestAnchor = driftPhysicsSystem.findBestAnchor(car.position, currentAnchors);
        if (bestAnchor) {
          car = driftPhysicsSystem.attachHook(car, bestAnchor);
          hookStartTimeRef.current = Date.now();
          setActiveHookAnchor(bestAnchor);
          try {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          } catch {}
        }
      }

      // Check Nitro State
      const nitroActive = Date.now() < nitroEndTimeRef.current;
      setIsNitroActive(nitroActive);
      const effectiveSpeed = nitroActive ? 300 : 240;
      car.speed = effectiveSpeed;

      // 2. Physics Motion Update
      if (car.isHooked && car.activeAnchorId) {
        const anchor = currentAnchors.find((a) => a.id === car.activeAnchorId);
        if (anchor) {
          car = driftPhysicsSystem.updateOrbitMotion(car, anchor, deltaTime);

          // Center Pillar Post Collision Check (Hooked too long)
          const dx = car.position.x - anchor.position.x;
          const dy = car.position.y - anchor.position.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist <= anchor.radius + 12) {
            spawnParticles(car.position.x, car.position.y, Colors.secondary, 20);
            triggerGameOver();
            return;
          }

          // Generate dynamic neon tire skid marks
          skidFrameCounter++;
          if (skidFrameCounter % 2 === 0) {
            const rad = (car.angle * Math.PI) / 180;
            const perpX = Math.cos(rad) * 9;
            const perpY = Math.sin(rad) * 9;
            const rearX = car.position.x - Math.sin(rad) * 14;
            const rearY = car.position.y + Math.cos(rad) * 14;

            const newMark: SkidMark = {
              id: `${Date.now()}-${Math.random()}`,
              leftWheel: { x: rearX - perpX, y: rearY - perpY },
              rightWheel: { x: rearX + perpX, y: rearY + perpY },
              opacity: 0.9,
            };

            const updatedMarks = [...skidMarksRef.current, newMark];
            if (updatedMarks.length > 50) updatedMarks.shift();
            skidMarksRef.current = updatedMarks;
            setSkidMarks([...updatedMarks]);
          }

          // Accumulate higher drift score with active combo multiplier
          scoreAccumulatorRef.current += deltaTime * 60 * comboMultiplierRef.current;
        }
      } else {
        // Straight motion
        car = driftPhysicsSystem.updateStraightMotion(car, deltaTime);
        scoreAccumulatorRef.current += deltaTime * Config.gameplay.SCORE_PER_SECOND * comboMultiplierRef.current;
      }

      carStateRef.current = car;

      // 3. Collectibles Pickup Detection
      const currentCollectibles = collectiblesRef.current;
      let collectiblesUpdated = false;

      for (let i = 0; i < currentCollectibles.length; i++) {
        const item = currentCollectibles[i];
        if (item.collected) continue;

        const cdx = car.position.x - item.worldPos.x;
        const cdy = car.position.y - item.worldPos.y;
        const distSq = cdx * cdx + cdy * cdy;

        if (distSq <= 24 * 24) {
          item.collected = true;
          collectiblesUpdated = true;

          if (item.type === 'shard') {
            shardsCountRef.current++;
            setShardsCount(shardsCountRef.current);
            scoreAccumulatorRef.current += 100 * comboMultiplierRef.current;
            spawnParticles(item.worldPos.x, item.worldPos.y, item.color || Colors.primary, 12);
          } else {
            coinsCountRef.current += 10;
            setCoinsCount(coinsCountRef.current);
            scoreAccumulatorRef.current += 50 * comboMultiplierRef.current;
            spawnParticles(item.worldPos.x, item.worldPos.y, Colors.warning, 10);
          }

          try {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          } catch {}
        }
      }

      if (collectiblesUpdated) {
        setCollectibles([...currentCollectibles]);
      }

      // 4. Update Particle Physics
      const activeParticles = particlesRef.current;
      if (activeParticles.length > 0) {
        const updatedParticles: Particle[] = [];
        for (const p of activeParticles) {
          p.x += p.vx * deltaTime;
          p.y += p.vy * deltaTime;
          p.life -= deltaTime * 2.2;
          if (p.life > 0) {
            updatedParticles.push(p);
          }
        }
        particlesRef.current = updatedParticles;
        setParticles([...updatedParticles]);
      }

      // 5. Smooth Camera Follow (Target at ~72% from top of viewport)
      const targetCamY = car.position.y - height * 0.72;
      const clampedTargetCamY = Math.max(0, Math.min(totalLength - height, targetCamY));
      cameraYRef.current += (clampedTargetCamY - cameraYRef.current) * 0.14;
      const currentCameraY = cameraYRef.current;
      setCameraY(currentCameraY);

      // 6. Track Boundary Collision Check
      const CAR_RADIUS = 16;
      if (
        car.position.x - CAR_RADIUS <= 6 ||
        car.position.x + CAR_RADIUS >= width - 6 ||
        car.position.y >= totalLength + 20
      ) {
        spawnParticles(car.position.x, car.position.y, Colors.secondary, 20);
        triggerGameOver();
        return;
      }

      // 7. Finish Line Reached Check
      if (car.position.y <= finishLineYRef.current) {
        const finalScore = Math.floor(scoreAccumulatorRef.current);
        triggerLevelComplete(finalScore);
        return;
      }

      // 8. Track Progress Calculation (0.0 to 1.0)
      const startY = startYRef.current;
      const finishY = finishLineYRef.current;
      const currentProg = (startY - car.position.y) / (startY - finishY);
      setTrackProgress(Math.max(0, Math.min(1, currentProg)));

      // 9. Update Score & Render State
      const currentScoreInt = Math.floor(scoreAccumulatorRef.current);
      setScore(currentScoreInt);
      setCarRenderState({ ...car });
    };

    const unsubscribe = mainGameEngine.subscribe(updateTick);
    mainGameEngine.start();

    return () => {
      unsubscribe();
      mainGameEngine.stop();
    };
  }, [setScore]);

  // Trigger Level Complete
  const triggerLevelComplete = (finalScore: number) => {
    mainGameEngine.stop();
    gameStateRef.current = GameState.LEVEL_COMPLETE;
    setGameState(GameState.LEVEL_COMPLETE);

    unlockLevel('level_02');
    updateLevelStars(activeLevelId, 3);

    const currentBest = useGameStore.getState().highScore;
    let newBest = currentBest;

    if (finalScore > currentBest) {
      setIsNewHighScore(true);
      setHighScore(finalScore);
      newBest = finalScore;
    }

    const earnedCoins = (currentLevel.rewards?.coins ?? 200) + coinsCountRef.current;

    saveService.load().then((existing) => {
      const unlockedLevels = existing?.unlockedLevelIds || ['level_01'];
      if (!unlockedLevels.includes('level_02')) {
        unlockedLevels.push('level_02');
      }

      const starsMap = existing?.levelStars || {};
      starsMap[activeLevelId] = 3;

      saveService.save({
        metadata: {
          version: Config.version,
          createdAt: existing?.metadata?.createdAt ?? Date.now(),
          lastSavedAt: Date.now(),
        },
        highScore: newBest,
        totalCoins: (existing?.totalCoins ?? 0) + earnedCoins,
        unlockedLevelIds: unlockedLevels,
        levelStars: starsMap,
        unlockedItemIds: existing?.unlockedItemIds ?? ['skin_default'],
        equippedSkinId: existing?.equippedSkinId ?? 'skin_default',
        equippedTrailId: existing?.equippedTrailId ?? 'trail_default',
        settings: existing?.settings ?? {
          sound: {
            musicEnabled: true,
            sfxEnabled: true,
            musicVolume: 1.0,
            sfxVolume: 1.0,
          },
          hapticsEnabled: true,
          graphicsQuality: 'HIGH',
          language: 'tr',
        },
      });
    });

    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {}
  };

  // Trigger Game Over
  const triggerGameOver = () => {
    mainGameEngine.stop();
    gameStateRef.current = GameState.GAME_OVER;
    setGameState(GameState.GAME_OVER);

    const finalScore = Math.floor(scoreAccumulatorRef.current);
    const currentBest = useGameStore.getState().highScore;

    if (finalScore > currentBest) {
      setIsNewHighScore(true);
      setHighScore(finalScore);

      saveService.load().then((existing) => {
        saveService.save({
          metadata: {
            version: Config.version,
            createdAt: existing?.metadata?.createdAt ?? Date.now(),
            lastSavedAt: Date.now(),
          },
          highScore: finalScore,
          totalCoins: (existing?.totalCoins ?? 0) + coinsCountRef.current,
          unlockedLevelIds: existing?.unlockedLevelIds ?? ['level_01'],
          levelStars: existing?.levelStars ?? { level_01: 0 },
          unlockedItemIds: existing?.unlockedItemIds ?? ['skin_default'],
          equippedSkinId: existing?.equippedSkinId ?? 'skin_default',
          equippedTrailId: existing?.equippedTrailId ?? 'trail_default',
          settings: existing?.settings ?? {
            sound: {
              musicEnabled: true,
              sfxEnabled: true,
              musicVolume: 1.0,
              sfxVolume: 1.0,
            },
            hapticsEnabled: true,
            graphicsQuality: 'HIGH',
            language: 'tr',
          },
        });
      });
    }

    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } catch {}
  };

  // Pause / Resume / Restart Handlers
  const handlePause = () => {
    mainGameEngine.stop();
    gameStateRef.current = GameState.PAUSED;
    setGameState(GameState.PAUSED);
  };

  const handleResume = () => {
    gameStateRef.current = GameState.PLAYING;
    setGameState(GameState.PLAYING);
    mainGameEngine.start();
  };

  const handleRestart = () => {
    initGameSession(viewportWidthRef.current, viewportHeightRef.current, currentLevel);
    mainGameEngine.start();
  };

  const handleMainMenu = () => {
    mainGameEngine.stop();
    gameStateRef.current = GameState.IDLE;
    setGameState(GameState.IDLE);
    router.replace('/');
  };

  return (
    <ScreenContainer contentStyle={styles.noPadding}>
      <View style={styles.container}>
        {/* Game HUD with Combo & Collectibles */}
        <GameHUD
          onPausePress={handlePause}
          comboMultiplier={comboMultiplier}
          shardsCollected={shardsCount}
          totalShards={currentLevel.requirements?.energyShardsToCollect || 5}
          coinsSession={coinsCount}
        />

        {/* Viewport Canvas Container */}
        <View style={styles.canvasContainer}>
          <Card
            variant="neon"
            style={styles.canvasCard}
            onLayout={handleArenaLayout}
          >
            {viewportDimensions.width > 0 && viewportDimensions.height > 0 && (
              <>
                {/* 1. Scrolling Track Road & Guardrails */}
                <TrackRenderer
                  cameraY={cameraY}
                  viewportWidth={viewportDimensions.width}
                  viewportHeight={viewportDimensions.height}
                  totalTrackLength={totalTrackLengthRef.current}
                  finishLineY={finishLineYRef.current}
                />

                {/* 2. Scrolling Tire Skid Marks */}
                <SkidMarks
                  marks={skidMarks.map((m) => ({
                    ...m,
                    leftWheel: { x: m.leftWheel.x, y: m.leftWheel.y - cameraY },
                    rightWheel: { x: m.rightWheel.x, y: m.rightWheel.y - cameraY },
                  }))}
                />

                {/* 3. Collectibles (Shards & Coins) */}
                {collectibles.map((item) =>
                  item.type === 'shard' ? (
                    <EnergyShard
                      key={item.id}
                      position={{
                        x: item.worldPos.x,
                        y: item.worldPos.y - cameraY,
                      }}
                      color={item.color}
                      collected={item.collected}
                    />
                  ) : (
                    <NeonCoin
                      key={item.id}
                      position={{
                        x: item.worldPos.x,
                        y: item.worldPos.y - cameraY,
                      }}
                      collected={item.collected}
                    />
                  )
                )}

                {/* 4. Particle Bursts */}
                <DriftParticleSystem
                  particles={particles.map((p) => ({
                    ...p,
                    y: p.y - cameraY,
                  }))}
                />

                {/* 5. Scrolling Corner Drift Anchors */}
                {anchors.map((anchor) => (
                  <DriftAnchor
                    key={anchor.id}
                    anchor={{
                      ...anchor,
                      position: {
                        x: anchor.position.x,
                        y: anchor.position.y - cameraY,
                      },
                    }}
                    isActive={activeHookAnchor?.id === anchor.id}
                  />
                ))}

                {/* 6. Scrolling Laser Hook Cable */}
                {carRenderState.isHooked && activeHookAnchor && (
                  <LaserBeam
                    from={{
                      x: carRenderState.position.x,
                      y: carRenderState.position.y - cameraY,
                    }}
                    to={{
                      x: activeHookAnchor.position.x,
                      y: activeHookAnchor.position.y - cameraY,
                    }}
                    color={activeHookAnchor.color || Colors.primary}
                  />
                )}

                {/* 7. Cyberpunk Neon Car Model with Nitro */}
                <CyberCar
                  position={{
                    x: carRenderState.position.x,
                    y: carRenderState.position.y - cameraY,
                  }}
                  angle={carRenderState.angle}
                  isHooked={carRenderState.isHooked}
                  isNitroActive={isNitroActive}
                />

                {/* 8. Vertical Neon Progress Bar */}
                <TrackProgressBar progress={trackProgress} />

                {/* 9. Perfect Drift Toast Feedback */}
                {perfectDriftText && (
                  <View pointerEvents="none" style={styles.perfectToast}>
                    <Text style={styles.perfectToastText}>{perfectDriftText}</Text>
                  </View>
                )}

                {/* 10. Full-screen Hold & Release Touch Layer */}
                <Pressable
                  style={[StyleSheet.absoluteFillObject, { zIndex: 99999 }]}
                  onPressIn={handleTouchDown}
                  onPressOut={handleTouchUp}
                />
              </>
            )}
          </Card>
        </View>

        {/* Pause Modal Overlay */}
        <PauseModal
          visible={gameState === GameState.PAUSED}
          onResume={handleResume}
          onRestart={handleRestart}
          onMainMenu={handleMainMenu}
        />

        {/* Game Over Modal Overlay */}
        <GameOverModal
          visible={gameState === GameState.GAME_OVER}
          score={score}
          highScore={highScore}
          isNewHighScore={isNewHighScore}
          onRestart={handleRestart}
          onMainMenu={handleMainMenu}
        />

        {/* Level Complete Modal Overlay */}
        <LevelCompleteModal
          visible={gameState === GameState.LEVEL_COMPLETE}
          levelName={currentLevel.name}
          score={score}
          highScore={highScore}
          onRestart={handleRestart}
          onMainMenu={handleMainMenu}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  noPadding: {
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  canvasContainer: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  canvasCard: {
    flex: 1,
    backgroundColor: '#070B14',
    borderWidth: 2,
    borderColor: Colors.primaryGlow,
    borderRadius: Radius.xl,
    overflow: 'hidden',
  },
  perfectToast: {
    position: 'absolute',
    top: '20%',
    alignSelf: 'center',
    backgroundColor: 'rgba(255, 0, 127, 0.35)',
    borderColor: Colors.secondary,
    borderWidth: 1.5,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.full,
    zIndex: 200,
    shadowColor: Colors.secondary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
  },
  perfectToastText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.black,
    color: Colors.secondary,
    letterSpacing: Typography.letterSpacing.wide,
  },
});
