export type InteractionLockReason =
  | "cinematic"
  | "ghost"
  | "loading"
  | "modal"
  | "replay"
  | "debug";

export interface InteractionLock {
  id: string;

  reason:
    InteractionLockReason;

  priority: number;

  createdAt: number;
}