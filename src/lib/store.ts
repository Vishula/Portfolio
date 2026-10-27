import { create } from "zustand";
import type { CatState } from "@/components/cat/machine";

export type Rect = { x: number; y: number; w: number; h: number };

/** What the cat sequence needs from the tank engine. */
export type TankApi = {
  pickBait(): { x: number; y: number } | null;
  setBait(x: number, y: number, angle: number): void;
  catchBait(): void;
  releaseBait(): void;
  ripple(x: number, y: number, strength: number): void;
  sendMessageFish(x: number, y: number): void;
};

type TankStore = {
  buttonRect: Rect | null;
  plate: Rect | null;
  reading: boolean;
  calm: boolean;
  reduced: boolean;
  lowPower: boolean;
  tank: TankApi | null;
  catState: CatState;
  catchTick: number; // bumps when a catch lands on the button
  catchNowTick: number; // bumps when the visitor clicks Resume mid-chase
  set: (p: Partial<Omit<TankStore, "set">>) => void;
};

export const useTank = create<TankStore>((set) => ({
  buttonRect: null,
  plate: null,
  reading: false,
  calm: false,
  reduced: false,
  lowPower: false,
  tank: null,
  catState: "sleeping",
  catchTick: 0,
  catchNowTick: 0,
  set: (p) => set(p),
}));
