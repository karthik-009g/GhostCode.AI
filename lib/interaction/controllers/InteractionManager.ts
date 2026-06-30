import type {
  InteractionEvent,
} from "../types/events";

import type {
  ReplayFrame,
  ReplayState,
} from "../types/replay";

export class ReplayController {
  private frames:
    ReplayFrame[] = [];

  private state: ReplayState =
    {
      playing:
        false,

      paused:
        false,

      speed: 1,

      currentFrame: 0,
    };

  private startTime = 0;

  record(
    event: InteractionEvent,
  ): void {
    this.frames.push({
      frame:
        this.frames.length,

      time:
        performance.now(),

      event,
    });
  }

  play(
    speed = 1,
  ): void {
    this.state.playing =
      true;

    this.state.paused =
      false;

    this.state.speed =
      speed;

    this.startTime =
      performance.now();
  }

  pause(): void {
    this.state.paused =
      true;
  }

  stop(): void {
    this.state =
      {
        playing:
          false,

        paused:
          false,

        speed: 1,

        currentFrame: 0,
      };
  }

  seek(
    frame: number,
  ): void {
    this.state.currentFrame =
      Math.max(
        0,
        Math.min(
          frame,
          this.frames
            .length -
            1,
        ),
      );
  }

  update():
    | ReplayFrame
    | null {
    if (
      !this.state
        .playing ||
      this.state.paused
    ) {
      return null;
    }

    const frame =
      this.frames[
        this.state
          .currentFrame
      ];

    if (!frame) {
      this.stop();
      return null;
    }

    this.state
      .currentFrame++;

    return frame;
  }

  clear(): void {
    this.frames = [];
    this.stop();
  }

  getFrames():
    readonly ReplayFrame[] {
    return this.frames;
  }

  getState():
    Readonly<ReplayState> {
    return this.state;
  }

  get frameCount(): number {
    return this.frames
      .length;
  }
}

export const
  replayController =
    new ReplayController();