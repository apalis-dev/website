import React from "react";
import {
  AbsoluteFill,
  Composition,
  interpolate,
  Sequence,
  useCurrentFrame,
} from "remotion";
import { HeroScene } from "./scenes/HeroScene";
import { TitleScene } from "./scenes/TitleScene";
import { HookScene } from "./scenes/HookScene";
import { ProblemScene } from "./scenes/ProblemScene";
import { IntroApalisScene } from "./scenes/IntroApalisScene";
import { PipelineScene } from "./scenes/PipelineScene";
import { UseCasesScene } from "./scenes/UseCasesScene";
import { WhoItsForScene } from "./scenes/WhoItsForScene";
import { DependencyInjectionScene } from "./scenes/DependencyInjectionScene";
import { ErrorHandlingScene } from "./scenes/ErrorHandlingScene";
import { BackendScene } from "./scenes/BackendScene";
import { WorkflowsScene } from "./scenes/WorkflowsScene";
import { IntegrationsScene } from "./scenes/IntegrationsScene";

const FADE = 10;

const FadeWrapper: React.FC<{
  durationInFrames: number;
  children: React.ReactNode;
  fadeIn?: boolean;
  fadeOut?: boolean;
}> = ({ durationInFrames, children, fadeIn = true, fadeOut = true }) => {
  const frame = useCurrentFrame();
  const fadeInOpacity = fadeIn
    ? interpolate(frame, [0, FADE], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 1;
  const fadeOutOpacity = fadeOut
    ? interpolate(frame, [durationInFrames - FADE, durationInFrames], [1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 1;
  return (
    <AbsoluteFill style={{ opacity: Math.min(fadeInOpacity, fadeOutOpacity) }}>
      {children}
    </AbsoluteFill>
  );
};

// Scene frame map
// Scene 1  (Hero):          0 –  200  (200 frames, ~6.7s)
// Scene 2  (Title):       200 –  400  (200 frames, ~6.7s)
// Scene 3  (Hook):        400 –  610  (210 frames, ~7s)
// Scene 4  (Problem):     610 –  790  (180 frames, ~6s)
// Scene 5  (IntroApalis): 790 – 1150  (360 frames, ~12s)
// Scene 6  (Pipeline):   1150 – 1360  (210 frames, ~7s)
// Scene 7  (UseCases):   1360 – 1570  (210 frames, ~7s)
// Scene 8  (DepInject):  1570 – 1840  (270 frames, ~9s)
// Scene 9  (ErrHandle):  1840 – 2110  (270 frames, ~9s)
// Scene 10 (Backend):    2110 – 2770  (660 frames, ~22s — 4 internal acts)
// Scene 11 (Workflows):  2770 – 3570  (800 frames, ~26.7s — 4 internal acts)
// Scene 12 (Integrations): 3570 – 4370 (800 frames, ~26.7s — 5 internal acts, 144f reading window each)
// Scene 13 (WhoItsFor):  4370 – 4550  (180 frames, ~6s)
// Total: 4550 frames @ 30 fps = ~152 seconds

const ApalisIntro: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0d0d0d",
        fontFamily:
          "system-ui, -apple-system, 'Segoe UI', Helvetica, Arial, sans-serif",
      }}
    >
      <Sequence from={0} durationInFrames={200}>
        <FadeWrapper durationInFrames={200} fadeIn={false}>
          <HeroScene />
        </FadeWrapper>
      </Sequence>

      <Sequence from={200} durationInFrames={200}>
        <FadeWrapper durationInFrames={200}>
          <TitleScene />
        </FadeWrapper>
      </Sequence>

      <Sequence from={400} durationInFrames={210}>
        <FadeWrapper durationInFrames={210}>
          <HookScene />
        </FadeWrapper>
      </Sequence>

      <Sequence from={610} durationInFrames={180}>
        <FadeWrapper durationInFrames={180}>
          <ProblemScene />
        </FadeWrapper>
      </Sequence>

      <Sequence from={790} durationInFrames={360}>
        <FadeWrapper durationInFrames={360}>
          <IntroApalisScene />
        </FadeWrapper>
      </Sequence>

      <Sequence from={1150} durationInFrames={210}>
        <FadeWrapper durationInFrames={210}>
          <PipelineScene />
        </FadeWrapper>
      </Sequence>

      <Sequence from={1360} durationInFrames={210}>
        <FadeWrapper durationInFrames={210}>
          <UseCasesScene />
        </FadeWrapper>
      </Sequence>

      <Sequence from={1570} durationInFrames={270}>
        <FadeWrapper durationInFrames={270}>
          <DependencyInjectionScene />
        </FadeWrapper>
      </Sequence>

      <Sequence from={1840} durationInFrames={270}>
        <FadeWrapper durationInFrames={270}>
          <ErrorHandlingScene />
        </FadeWrapper>
      </Sequence>

      <Sequence from={2110} durationInFrames={660}>
        <FadeWrapper durationInFrames={660}>
          <BackendScene />
        </FadeWrapper>
      </Sequence>

      <Sequence from={2770} durationInFrames={800}>
        <FadeWrapper durationInFrames={800}>
          <WorkflowsScene />
        </FadeWrapper>
      </Sequence>

      <Sequence from={3570} durationInFrames={800}>
        <FadeWrapper durationInFrames={800}>
          <IntegrationsScene />
        </FadeWrapper>
      </Sequence>

      <Sequence from={4370} durationInFrames={180}>
        <FadeWrapper durationInFrames={180} fadeOut={false}>
          <WhoItsForScene />
        </FadeWrapper>
      </Sequence>
    </AbsoluteFill>
  );
};

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="ApalisIntro"
      component={ApalisIntro}
      durationInFrames={4550}
      fps={30}
      width={1920}
      height={1080}
    />
  );
};
