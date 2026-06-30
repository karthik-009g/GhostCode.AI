import type {
  InteractionEvent,
} from "./events";

export interface ReplayFrame {
  frame: number;

  time: number;

  event:
    InteractionEvent;
}

export interface ReplayState {
  playing: boolean;

  paused: boolean;

  speed: number;

  currentFrame: number;
}