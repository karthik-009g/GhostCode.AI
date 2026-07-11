import type { CameraShot } from "./Shot";

export function clamp01(value: number) {
	return Math.max(0, Math.min(1, value));
}

export function easeInOutCubic(value: number) {
	const t = clamp01(value);
	return t < 0.5
		? 4 * t * t * t
		: 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function lerpShot(
	from: CameraShot,
	to: CameraShot,
	t: number,
): CameraShot {
	const alpha = easeInOutCubic(t);

	return {
		id: `${from.id}-${to.id}`,
		mood: alpha < 0.5 ? from.mood : to.mood,
		position: [
			from.position[0] + (to.position[0] - from.position[0]) * alpha,
			from.position[1] + (to.position[1] - from.position[1]) * alpha,
			from.position[2] + (to.position[2] - from.position[2]) * alpha,
		],
		target: [
			from.target[0] + (to.target[0] - from.target[0]) * alpha,
			from.target[1] + (to.target[1] - from.target[1]) * alpha,
			from.target[2] + (to.target[2] - from.target[2]) * alpha,
		],
		fov: from.fov + (to.fov - from.fov) * alpha,
		duration: from.duration + (to.duration - from.duration) * alpha,
		damping: from.damping + (to.damping - from.damping) * alpha,
	};
}

export function sampleTimeline(
	shots: CameraShot[],
	progress: number,
) {
	if (shots.length === 0) {
		return null;
	}

	if (shots.length === 1) {
		return shots[0] ?? null;
	}

	const normalized = clamp01(progress);
	const segment = normalized * (shots.length - 1);
	const leftIndex = Math.floor(segment);
	const rightIndex = Math.min(shots.length - 1, leftIndex + 1);
	const localT = segment - leftIndex;

	const left = shots[leftIndex];
	const right = shots[rightIndex];

	if (!left || !right) {
		return null;
	}

	return lerpShot(left, right, localT);
}

