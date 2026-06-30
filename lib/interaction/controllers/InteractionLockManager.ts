import type {
  InteractionLock,
  InteractionLockReason,
} from "../types/locks";

export type LockListener = (
  locked: boolean,
  activeLock: InteractionLock | null,
) => void;

export class InteractionLockManager {
  private locks = new Map<string, InteractionLock>();

  private listeners =
    new Set<LockListener>();

  acquire(
    reason: InteractionLockReason,
    priority = 0,
  ): string {
    const id = crypto.randomUUID();

    this.locks.set(id, {
      id,
      reason,
      priority,
      createdAt: Date.now(),
    });

    this.notify();

    return id;
  }

  release(id: string): void {
    if (
      !this.locks.has(id)
    ) {
      return;
    }

    this.locks.delete(id);

    this.notify();
  }

  releaseByReason(
    reason: InteractionLockReason,
  ): void {
    for (const [
      id,
      lock,
    ] of this.locks) {
      if (
        lock.reason ===
        reason
      ) {
        this.locks.delete(
          id,
        );
      }
    }

    this.notify();
  }

  clear(): void {
    this.locks.clear();
    this.notify();
  }

  isLocked(): boolean {
    return (
      this.locks.size >
      0
    );
  }

  getActiveLock(): InteractionLock | null {
  if (this.locks.size === 0) {
    return null;
  }

  const sortedLocks = [
    ...this.locks.values(),
  ].sort(
    (a, b) =>
      b.priority - a.priority,
  );

  return sortedLocks[0] ?? null;
}

  subscribe(
    listener: LockListener,
  ): () => void {
    this.listeners.add(
      listener,
    );

    return () =>
      this.listeners.delete(
        listener,
      );
  }

  private notify(): void {
    const active =
      this.getActiveLock();

    const locked =
      active !== null;

    for (const listener of
      this.listeners) {
      listener(
        locked,
        active,
      );
    }
  }
}

export const
  interactionLockManager =
    new InteractionLockManager();