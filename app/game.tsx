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
import { Card } from '../components/ui/Card';
import { Colors } from '../constants/colors';
import { Typography } from '../constants/typography';
import { Radius, Spacing } from '../constants/spacing';
import { Config } from '../constants/config';
import { useGameStore } from '../store/useGameStore';
import { useLevelStore } from '../store/useLevelStore';
import { GameState, Vector2D } from '../types/game';
import { CyberCarState, DriftAnchor as DriftAnchorType, SkidMark } from '../types/physics';
import { ILevel } from '../types/level';
import { mainGameEngine } from '../game/core/GameEngine';
import { driftPhysicsSystem } from '../game/systems/DriftPhysicsSystem';
import { LevelRegistry } from '../game/levels/LevelRegistry';
import { saveService } from '../services/SaveService';

export default function GameScreen() {
  const router = useRouter();
  const searchParams = useLocalSearchParams<{ levelId?: string }>();

  // Determine active level ID
  const storeActiveLevelId = useGameStore((state) => state.activeLevelId);
  const activeLevelId = searchParams.levelId || storeActiveLevelId || 'level_01';
  const currentLevel = LevelRegistry.getLevelById(activeLevelId);

  // Arena dimensions measured on layout
  const [arenaDimensions, setArenaDimensions] = useState<{
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

  // Visual Render States (Synced from tick ref at 60 FPS)
  const [carRenderState, setCarRenderState] = useState<CyberCarState>({
    position: { x: 120, y: 550 },
    velocity: { x: 0, y: -230 },
    angle: 0,
    speed: 230,
    isHooked: false,
    activeAnchorId: null,
    orbitRadius: 0,
    orbitAngle: 0,
    orbitDirection: 1,
    driftScoreMultiplier: 1,
  });

  const [anchors, setAnchors] = useState<DriftAnchorType[]>([]);
  const [skidMarks, setSkidMarks] = useState<SkidMark[]>([]);
  const [activeHookAnchor, setActiveHookAnchor] = useState<DriftAnchorType | null>(null);
  const [perfectDriftText, setPerfectDriftText] = useState<string | null>(null);

  // High-frequency mutable refs for 60 FPS physics tick loop
  const carStateRef = useRef<CyberCarState>({ ...carRenderState });
  const anchorsRef = useRef<DriftAnchorType[]>([]);
  const skidMarksRef = useRef<SkidMark[]>([]);
  const isHoldingTouchRef = useRef<boolean>(false);
  const scoreAccumulatorRef = useRef<number>(0);
  const arenaWidthRef = useRef<number>(0);
  const arenaHeightRef = useRef<number>(0);
  const gameStateRef = useRef<GameState>(GameState.READY);
  const currentLevelRef = useRef<ILevel>(currentLevel);
  const isInitializedRef = useRef<boolean>(false);
  const finishLineYRef = useRef<number>(50);

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

  // Initialize Sling-Drift Game Session
  const initGameSession = useCallback(
    (width: number, height: number, level: ILevel) => {
      if (width <= 50 || height <= 50) return;

      arenaWidthRef.current = width;
      arenaHeightRef.current = height;
      finishLineYRef.current = Math.round(height * (level.finishLineYRatio ?? 0.08));

      // Calculate initial car start position
      const startRatio = level.startPosRatio || { x: 0.3, y: 0.88 };
      const startPos: Vector2D = {
        x: Math.round(width * startRatio.x),
        y: Math.round(height * startRatio.y),
      };

      const startAngle = level.startAngle ?? 0;
      const initialSpeed = Config.gameplay.CORE_SPEED || 230;

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

      // Calculate track anchors from relative level coordinates
      const relAnchors = level.anchors || [];
      const calculatedAnchors: DriftAnchorType[] = relAnchors.map((rel) => ({
        id: rel.id,
        name: rel.name,
        position: {
          x: Math.round(width * rel.xRatio),
          y: Math.round(height * rel.yRatio),
        },
        radius: rel.radius ?? 16,
        activeRange: rel.activeRange ?? 150,
        color: rel.color ?? Colors.secondary,
      }));

      carStateRef.current = { ...initialCarState };
      anchorsRef.current = calculatedAnchors;
      skidMarksRef.current = [];
      isHoldingTouchRef.current = false;
      scoreAccumulatorRef.current = 0;

      setAnchors(calculatedAnchors);
      setSkidMarks([]);
      setActiveHookAnchor(null);
      setCarRenderState(initialCarState);
      setScore(0);
      setIsNewHighScore(false);
      setPerfectDriftText(null);

      isInitializedRef.current = true;
      gameStateRef.current = GameState.PLAYING;
      setGameState(GameState.PLAYING);
    },
    [setScore, setGameState]
  );

  // Handle Arena Layout Measurement
  const handleArenaLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    if (width > 50 && height > 50) {
      setArenaDimensions({ width, height });
      initGameSession(width, height, currentLevel);
    }
  };

  // Touch Handlers for Sling-Drift Hook Action
  const handleTouchDown = () => {
    if (!isInitializedRef.current || gameStateRef.current !== GameState.PLAYING) return;

    isHoldingTouchRef.current = true;
    const currentCar = carStateRef.current;

    // Check if within reach of an anchor
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
      const releasedCar = driftPhysicsSystem.releaseHook(currentCar);
      carStateRef.current = releasedCar;
      setActiveHookAnchor(null);
      setCarRenderState({ ...releasedCar });

      // Perfect Drift feedback
      setPerfectDriftText('PERFECT DRIFT! +50');
      scoreAccumulatorRef.current += 50;
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

      // 1. Check Hook Connection
      if (isHoldingTouchRef.current && !car.isHooked) {
        const bestAnchor = driftPhysicsSystem.findBestAnchor(car.position, currentAnchors);
        if (bestAnchor) {
          car = driftPhysicsSystem.attachHook(car, bestAnchor);
          setActiveHookAnchor(bestAnchor);
          try {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          } catch {}
        }
      }

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
            if (updatedMarks.length > 40) updatedMarks.shift();
            skidMarksRef.current = updatedMarks;
            setSkidMarks([...updatedMarks]);
          }

          // Accumulate higher score while actively drifting
          scoreAccumulatorRef.current += deltaTime * 40;
        }
      } else {
        // Straight motion
        car = driftPhysicsSystem.updateStraightMotion(car, deltaTime);
        scoreAccumulatorRef.current += deltaTime * Config.gameplay.SCORE_PER_SECOND;
      }

      carStateRef.current = car;

      // 3. Track Boundary Collision Check
      const width = arenaWidthRef.current;
      const height = arenaHeightRef.current;
      const CAR_RADIUS = 12;

      if (
        car.position.x - CAR_RADIUS <= 6 ||
        car.position.x + CAR_RADIUS >= width - 6 ||
        car.position.y + CAR_RADIUS >= height + 10
      ) {
        triggerGameOver();
        return;
      }

      // 4. Finish Line Reached Check
      if (car.position.y <= finishLineYRef.current) {
        const finalScore = Math.floor(scoreAccumulatorRef.current);
        triggerLevelComplete(finalScore);
        return;
      }

      // 5. Update Score
      const currentScoreInt = Math.floor(scoreAccumulatorRef.current);
      setScore(currentScoreInt);

      // 6. Update Render State
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
        totalCoins: (existing?.totalCoins ?? 0) + (currentLevel.rewards?.coins ?? 150),
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
          totalCoins: existing?.totalCoins ?? 0,
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
    initGameSession(arenaWidthRef.current, arenaHeightRef.current, currentLevel);
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
        {/* Game HUD */}
        <GameHUD onPausePress={handlePause} />

        {/* Sling-Drift Track Container */}
        <View style={styles.canvasContainer}>
          <Card
            variant="neon"
            style={styles.canvasCard}
            onLayout={handleArenaLayout}
          >
            {arenaDimensions.width > 0 && arenaDimensions.height > 0 && (
              <>
                {/* Neon Finish Gate Banner */}
                <View
                  pointerEvents="none"
                  style={[
                    styles.finishGate,
                    {
                      top: finishLineYRef.current - 14,
                      width: arenaDimensions.width - 24,
                    },
                  ]}
                >
                  <Text style={styles.finishGateText}>🏁 FINISH LINE 🏁</Text>
                </View>

                {/* Tire Skid Marks */}
                <SkidMarks marks={skidMarks} />

                {/* Corner Drift Anchors */}
                {anchors.map((anchor) => (
                  <DriftAnchor
                    key={anchor.id}
                    anchor={anchor}
                    isActive={activeHookAnchor?.id === anchor.id}
                  />
                ))}

                {/* Laser Tether Cable between Car and Anchor */}
                {carRenderState.isHooked && activeHookAnchor && (
                  <LaserBeam
                    from={carRenderState.position}
                    to={activeHookAnchor.position}
                    color={activeHookAnchor.color || Colors.primary}
                  />
                )}

                {/* Cyberpunk Car Model */}
                <CyberCar
                  position={carRenderState.position}
                  angle={carRenderState.angle}
                  isHooked={carRenderState.isHooked}
                />

                {/* Perfect Drift Floating Toast */}
                {perfectDriftText && (
                  <View pointerEvents="none" style={styles.perfectToast}>
                    <Text style={styles.perfectToastText}>{perfectDriftText}</Text>
                  </View>
                )}

                {/* Full-screen Hold & Release Sling-Drift Touch Layer */}
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
    backgroundColor: '#090D16',
    borderWidth: 2,
    borderColor: Colors.primaryGlow,
    borderRadius: Radius.xl,
    overflow: 'hidden',
  },
  finishGate: {
    position: 'absolute',
    left: 12,
    height: 28,
    borderWidth: 1.5,
    borderColor: Colors.success,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 255, 102, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderStyle: 'dashed',
    zIndex: 30,
  },
  finishGateText: {
    fontSize: 11,
    fontWeight: Typography.weights.black,
    color: Colors.success,
    letterSpacing: Typography.letterSpacing.arcade,
  },
  perfectToast: {
    position: 'absolute',
    top: '25%',
    alignSelf: 'center',
    backgroundColor: 'rgba(255, 0, 127, 0.25)',
    borderColor: Colors.secondary,
    borderWidth: 1.5,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.full,
    zIndex: 200,
  },
  perfectToastText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.black,
    color: Colors.secondary,
    letterSpacing: Typography.letterSpacing.wide,
  },
});
