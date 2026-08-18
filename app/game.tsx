import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
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
import { Core } from '../components/game/Core';
import { Obstacle } from '../components/game/Obstacle';
import { Card } from '../components/ui/Card';
import { Colors } from '../constants/colors';
import { Radius } from '../constants/spacing';
import { Config } from '../constants/config';
import { useGameStore } from '../store/useGameStore';
import { useLevelStore } from '../store/useLevelStore';
import { GameState, Vector2D, BoundingBox } from '../types/game';
import { ILevel } from '../types/level';
import { mainGameEngine } from '../game/core/GameEngine';
import { collisionSystem } from '../game/systems/CollisionSystem';
import { LevelRegistry } from '../game/levels/LevelRegistry';
import { saveService } from '../services/SaveService';

// Heading directions in 90 degree clockwise rotation order: UP -> RIGHT -> DOWN -> LEFT
const DIRECTIONS: Vector2D[] = [
  { x: 0, y: -1 }, // UP
  { x: 1, y: 0 },  // RIGHT
  { x: 0, y: 1 },  // DOWN
  { x: -1, y: 0 }, // LEFT
];

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

  // Core Render Position State
  const [coreRenderPos, setCoreRenderPos] = useState<Vector2D>({ x: 0, y: 0 });
  const [coreTrail, setCoreTrail] = useState<Vector2D[]>([]);

  // Static Obstacles list
  const [obstacles, setObstacles] = useState<{ bounds: BoundingBox; color?: string }[]>([]);

  // Mutable refs for high-frequency game engine tick updates
  const corePosRef = useRef<Vector2D>({ x: 0, y: 0 });
  const dirIndexRef = useRef<number>(0); // 0: UP, 1: RIGHT, 2: DOWN, 3: LEFT
  const scoreAccumulatorRef = useRef<number>(0);
  const trailRef = useRef<Vector2D[]>([]);
  const obstaclesRef = useRef<BoundingBox[]>([]);
  const arenaWidthRef = useRef<number>(0);
  const arenaHeightRef = useRef<number>(0);
  const gameStateRef = useRef<GameState>(GameState.READY);
  const currentLevelRef = useRef<ILevel>(currentLevel);

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

  // Initialize Obstacles once Arena dimensions are measured
  const initGameSession = useCallback(
    (width: number, height: number, level: ILevel) => {
      if (width <= 0 || height <= 0) return;

      arenaWidthRef.current = width;
      arenaHeightRef.current = height;

      // Start Core at level initial position ratio
      const startRatio = level.startPosRatio || { x: 0.5, y: 0.82 };
      const startPos = {
        x: Math.round(width * startRatio.x),
        y: Math.round(height * startRatio.y),
      };

      corePosRef.current = { ...startPos };
      dirIndexRef.current = level.startDirectionIndex ?? 0; // Default UP
      scoreAccumulatorRef.current = 0;
      trailRef.current = [];

      // Calculate deterministic static obstacles from level data
      const relObstacles = level.obstacles || [];
      const calculatedObstacles = relObstacles.map((rel) => ({
        bounds: {
          x: Math.round(width * rel.xRatio),
          y: Math.round(height * rel.yRatio),
          width: Math.max(20, Math.round(width * rel.widthRatio)),
          height: Math.max(20, Math.round(height * rel.heightRatio)),
        },
        color: rel.color,
      }));

      obstaclesRef.current = calculatedObstacles.map((o) => o.bounds);
      setObstacles(calculatedObstacles);
      setCoreRenderPos(startPos);
      setCoreTrail([]);
      setScore(0);
      setIsNewHighScore(false);
      setGameState(GameState.PLAYING);
    },
    [setScore, setGameState]
  );

  // Handle Arena Layout Measurement
  const handleArenaLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    if (width > 0 && height > 0) {
      setArenaDimensions({ width, height });
      initGameSession(width, height, currentLevel);
    }
  };

  // Tap Control: Turn Core 90 degrees Clockwise
  const handleTapTurn = () => {
    if (gameStateRef.current !== GameState.PLAYING) return;

    // Trigger subtle haptic feedback
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // Haptics fallback
    }

    // Turn 90 degrees clockwise (UP -> RIGHT -> DOWN -> LEFT -> UP)
    dirIndexRef.current = (dirIndexRef.current + 1) % DIRECTIONS.length;
  };

  // Main Game Loop Subscriber Tick
  useEffect(() => {
    const updateTick = (deltaTime: number) => {
      if (gameStateRef.current !== GameState.PLAYING) return;

      const speed = Config.gameplay.CORE_SPEED;
      const radius = Config.gameplay.CORE_RADIUS;
      const currentDir = DIRECTIONS[dirIndexRef.current];

      // Update Core Position
      const newPos = {
        x: corePosRef.current.x + currentDir.x * speed * deltaTime,
        y: corePosRef.current.y + currentDir.y * speed * deltaTime,
      };

      corePosRef.current = newPos;

      // Update Trail
      const newTrail = [...trailRef.current, { ...newPos }];
      if (newTrail.length > 5) {
        newTrail.shift();
      }
      trailRef.current = newTrail;

      // 1. Collision Check: Arena Boundaries
      const outOfBounds = collisionSystem.checkCircleOutOfBounds(
        newPos,
        radius,
        arenaWidthRef.current,
        arenaHeightRef.current
      );

      if (outOfBounds) {
        triggerGameOver();
        return;
      }

      // 2. Collision Check: Static Obstacles
      for (const obstacle of obstaclesRef.current) {
        const hit = collisionSystem.checkCircleAABBCollision(
          newPos,
          radius,
          obstacle
        );
        if (hit) {
          triggerGameOver();
          return;
        }
      }

      // 3. Accumulate Score over survival time
      scoreAccumulatorRef.current += deltaTime * Config.gameplay.SCORE_PER_SECOND;
      const currentScoreInt = Math.floor(scoreAccumulatorRef.current);
      setScore(currentScoreInt);

      // 4. Level Completion Condition Check
      const targetScore = currentLevelRef.current.completionScore ?? 200;
      if (currentScoreInt >= targetScore) {
        triggerLevelComplete(currentScoreInt);
        return;
      }

      // 5. Update React Render State for Smooth Graphics
      setCoreRenderPos({ ...newPos });
      setCoreTrail([...newTrail]);
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
    setGameState(GameState.LEVEL_COMPLETE);

    // Unlock Level 2 & award 3 stars for Level 1
    unlockLevel('level_02');
    updateLevelStars(activeLevelId, 3);

    const currentBest = useGameStore.getState().highScore;
    let newBest = currentBest;

    if (finalScore > currentBest) {
      setIsNewHighScore(true);
      setHighScore(finalScore);
      newBest = finalScore;
    }

    // Persist completion state to SaveService
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
        totalCoins: (existing?.totalCoins ?? 0) + (currentLevel.rewards?.coins ?? 100),
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
    } catch {
      // Haptics fallback
    }
  };

  // Trigger Game Over
  const triggerGameOver = () => {
    mainGameEngine.stop();
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
    } catch {
      // Haptics fallback
    }
  };

  // Pause / Resume Handlers
  const handlePause = () => {
    mainGameEngine.stop();
    setGameState(GameState.PAUSED);
  };

  const handleResume = () => {
    setGameState(GameState.PLAYING);
    mainGameEngine.start();
  };

  const handleRestart = () => {
    initGameSession(arenaWidthRef.current, arenaHeightRef.current, currentLevel);
    mainGameEngine.start();
  };

  const handleMainMenu = () => {
    mainGameEngine.stop();
    setGameState(GameState.IDLE);
    router.replace('/');
  };

  return (
    <ScreenContainer contentStyle={styles.noPadding}>
      <View style={styles.container}>
        {/* Game HUD */}
        <GameHUD onPausePress={handlePause} />

        {/* Game Arena Container */}
        <View style={styles.canvasContainer}>
          <Pressable
            style={styles.tapArea}
            onPress={handleTapTurn}
          >
            <Card
              variant="neon"
              style={styles.canvasCard}
              onLayout={handleArenaLayout}
            >
              {arenaDimensions.width > 0 && arenaDimensions.height > 0 && (
                <>
                  {/* Deterministic Level Obstacles Rendering */}
                  {obstacles.map((obs, idx) => (
                    <Obstacle key={`obs-${idx}`} bounds={obs.bounds} color={obs.color} />
                  ))}

                  {/* Core Player Rendering */}
                  <Core
                    position={coreRenderPos}
                    radius={Config.gameplay.CORE_RADIUS}
                    trail={coreTrail}
                  />
                </>
              )}
            </Card>
          </Pressable>
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
  tapArea: {
    flex: 1,
  },
  canvasCard: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary,
    borderWidth: 2,
    borderColor: Colors.primaryGlow,
    borderRadius: Radius.xl,
    overflow: 'hidden',
  },
});
