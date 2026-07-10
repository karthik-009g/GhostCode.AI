import type { CameraShot } from "./Shot";

export const GHOST_INTRO_SHOTS: CameraShot[] = [
	{
		id: "arrival-street",
		mood: "arrival",
		position: [0, 1.72, 18],
		target: [0, 1.55, -28],
		fov: 49,
		duration: 2.8,
		damping: 5.2,
	},
	{
		id: "core-reveal",
		mood: "reveal",
		position: [1.2, 1.84, 16.5],
		target: [0.4, 2.1, -54],
		fov: 47,
		duration: 2.2,
		damping: 4.8,
	},
	{
		id: "district-assemble",
		mood: "assemble",
		position: [-1.6, 1.76, 15.2],
		target: [0.2, 2.0, -88],
		fov: 46,
		duration: 2.4,
		damping: 4.4,
	},
	{
		id: "breach",
		mood: "breach",
		position: [0.8, 1.82, 13.6],
		target: [1.2, 2.3, -116],
		fov: 44,
		duration: 2.0,
		damping: 4.2,
	},
	{
		id: "ghost-hijack",
		mood: "hijack",
		position: [0.2, 1.68, 12.6],
		target: [2.4, 2.0, -132],
		fov: 43,
		duration: 1.6,
		damping: 5.4,
	},
];

export function getCameraShotForProgress(progress: number) {
	const clamped = Math.max(0, Math.min(1, progress));
	const index = Math.min(
		GHOST_INTRO_SHOTS.length - 1,
		Math.floor(clamped * GHOST_INTRO_SHOTS.length),
	);

	return GHOST_INTRO_SHOTS[index];
}

