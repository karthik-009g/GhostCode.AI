export type ShotMood =
	| "arrival"
	| "reveal"
	| "assemble"
	| "breach"
	| "hijack";

export interface CameraShot {
	id: string;
	mood: ShotMood;
	position: [number, number, number];
	target: [number, number, number];
	fov: number;
	duration: number;
	damping: number;
}

