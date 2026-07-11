"use client";

import { useEffect } from "react";

import { getCameraShotForProgress } from "./CameraPath";

import { useAnimationStore } from "@/stores/animation.store";
import { useCameraStore } from "@/stores/camera.store";
import { useSceneStore } from "@/stores/scene.store";

interface DirectorProps {
	scrollProgress: number;
}

function getIntroStage(progress: number) {
	if (progress < 0.12) return "particles";
	if (progress < 0.28) return "core-reveal";
	if (progress < 0.52) return "modules-assemble";
	if (progress < 0.76) return "connections-grow";
	if (progress < 0.92) return "ghosts-activate";
	return "complete";
}

export function Director({ scrollProgress }: DirectorProps) {
	const setIntroStage = useAnimationStore(
		(state) => state.setIntroStage,
	);

	const setIntroProgress = useAnimationStore(
		(state) => state.setIntroProgress,
	);

	const setActiveShot = useCameraStore(
		(state) => state.setActiveShot,
	);

	const setMode = useCameraStore(
		(state) => state.setMode,
	);

	const setTransitionProgress = useCameraStore(
		(state) => state.setTransitionProgress,
	);

	const setIsAnimating = useCameraStore(
		(state) => state.setIsAnimating,
	);

	const setCameraLocked = useCameraStore(
		(state) => state.setCameraLocked,
	);

	const setGhostHijack = useCameraStore(
		(state) => state.setGhostHijack,
	);

	const setGhostAttack = useSceneStore(
		(state) => state.setGhostAttack,
	);

	useEffect(() => {
		const stage = getIntroStage(scrollProgress);

		setIntroStage(stage);
		setIntroProgress(scrollProgress);
		setTransitionProgress(scrollProgress);
		setIsAnimating(stage !== "complete");
		setCameraLocked(stage !== "complete");

		const shot = getCameraShotForProgress(scrollProgress);
		setActiveShot(
			shot
				? {
						...shot,
						easing: "easeInOut",
					}
				: null,
		);

		const ghostHijack = stage === "ghosts-activate";
		setGhostHijack(ghostHijack);
		setMode(ghostHijack ? "ghost" : "cinematic");

		setGhostAttack(
			ghostHijack,
			ghostHijack ? "ghostA" : null,
		);
	}, [
		scrollProgress,
		setActiveShot,
		setCameraLocked,
		setGhostAttack,
		setGhostHijack,
		setIntroProgress,
		setIntroStage,
		setIsAnimating,
		setMode,
		setTransitionProgress,
	]);

	return null;
}

