import React from "react";
import { Img, staticFile } from "remotion";

// Real on-screen promos, taken from taiv.tv
export const PROMOS = {
  gameDay: "taiv/img/venue.webp", // purple "Game Day · $8 wings"
  happyHour: "taiv/img/happy-hour.webp",
  taco: "taiv/img/taco.webp",
  trivia: "taiv/img/trivia.webp",
  gameDayDark: "taiv/img/game-day.webp",
  pizza: "taiv/img/pizza.webp",
  coffee: "taiv/img/coffee-fresh.webp",
  fuel: "taiv/img/fuel-rewards.webp",
  brand: "taiv/img/advertiser.webp",
} as const;

export const Promo: React.FC<{ src: string; style?: React.CSSProperties }> = ({ src, style }) => (
  <Img
    src={staticFile(src)}
    style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", ...style }}
  />
);
