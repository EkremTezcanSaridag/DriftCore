import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  LayoutChangeEvent,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { ScreenContainer } from '../components/ui/ScreenContainer';
import { GameHUD } from '../components/game/GameHUD';
import { PauseModal } from '../components/game/PauseModal';
import { GameOverModal } from '../components/game/GameOverModal';
import { Core } from '../components/game/Core';
import { Obstacle } from '../components/game/Obstacle';
import { Card } from '../components/ui/Card';
import { Colors } from '../constants/colors';
import { Radius } from '../constants/spacing';
import { Config } from '../constants/config';
import { useGameStore } from '../store/useGameStore';
import { GameState, Vector2D, BoundingBox } from '../types/game';
import { mainGameEngine } from '../game/core/GameEngine';
import { collisionSystem } from '../game/systems/CollisionSystem';
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

  // Arena dimensions measured on layout
  const [arenaDimensions, setArenaDimensions] = useState<{
    width: number;
    height: number;
  }>({ width: 0, height: 0 });

  // Game state from Zustand store
  const {
    gameState,
    score,
    highScore,
    setGameState,
    setScore,
    setHighScore,
  } = useGameStore();

  // New High Score Flag for current session
  const [isNewHighScore, setIsNewHighScore] = useState(false);

  // Core Render Position State (synced from ref per frame for smooth 60 FPS)
  const [coreRenderPos, setCoreRenderPos] = useState<Vector2D>({ x: 0, y: 0 });
  const [coreTrail, setCoreTrail] = useState<Vector2D[]>([]);

  // Static Obstacles list
  const [obstacles, setObstacles] = useState<BoundingBox[]>([]);

  // Mutable refs for high-frequency game engine tick updates
  const corePosRef = useRef<Vector2D>({ x: 0, y: 0 });
  const dirIndexRef = useRef<number>(0); // 0: UP, 1: RIGHT, 2: DOWN, 3: LEFT
  const scoreAccumulatorRef = useRef<number>(0);
  const trailRef = useRef<Vector2D[]>([]);
  const obstaclesRef = useRef<BoundingBox[]>([]);
  const arenaWidthRef = useRef<number>(0);
  const arenaHeightRef = useRef<number>(0);
  const gameStateRef = useRef<GameState>(GameState.READY);

  // Sync gameState ref
  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

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
    (width: number, height: number) => {
      if (width <= 0 || height <= 0) return;

      arenaWidthRef.current = width;
      arenaHeightRef.current = height;

      // Start Core at exact center of Arena
      const centerPos = { x: width / 2, y: height / 2 };
      corePosRef.current = { ...centerPos };
      dirIndexRef.current = 0; // Initial Direction: UP
      scoreAccumulatorRef.current = 0;
      trailRef.current = [];

      // Calculate 3 static geometric obstacles responsive to arena size
      const obsList: BoundingBox[] = [
        {
          x: Math.round(width * 0.18),
          y: Math.round(height * 0.22),
          width: Math.max(60, Math.round(width * 0.25)),
          height: Math.max(35, Math.round(height * 0.08)),
        },
        {
          x: Math.round(width * 0.62),
          y: Math.round(height * 0.42),
          width: Math.max(45, Math.round(width * 0.2)),
          height: Math.max(70, Math.round(height * 0.16)),
        },
        {
          x: Math.round(width * 0.25),
          y: Math.round(height * 0.7),
          width: Math.max(80, Math.round(width * 0.35)),
          height: Math.max(35, Math.round(height * 0.07)),
        },
      ];

      obstaclesRef.current = obsList;
      setObstacles(obsList);
      setCoreRenderPos(centerPos);
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
      initGameSession(width, height);
    }
  };

  // Tap Control: Turn Core 90 degrees Clockwise
  const handleTapTurn = () => {
    if (gameStateRef.current !== GameState.PLAYING) return;

    // Trigger subtle haptic feedback
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // Haptics unavailable on non-mobile platforms
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

      // 4. Update React Render State for Smooth Graphics
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

  // Trigger Game Over
  const triggerGameOver = () => {
    mainGameEngine.stop();
    setGameState(GameState.GAME_OVER);

    const finalScore = Math.floor(scoreAccumulatorRef.current);
    const currentBest = useGameStore.getState().highScore;

    if (finalScore > currentBest) {
      setIsNewHighScore(true);
      setHighScore(finalScore);

      // Persist to Storage
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
    initGameSession(arenaWidthRef.current, arenaHeightRef.current);
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
                  {/* Obstacles Rendering */}
                  {obstacles.map((obs, idx) => (
                    <Obstacle key={`obs-${idx}`} bounds={obs} />
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
