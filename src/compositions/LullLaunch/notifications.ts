import { AppId } from "./apps";

// Shared between Problem (the pile-up) and Solution (the merge) so the
// cards keep their exact positions across the cut — a match-cut.
// x/y are card centers in the 1920x1080 frame.
export const NOTIFICATIONS: {
  app: AppId;
  message: string;
  x: number;
  y: number;
  rot: number;
}[] = [
  { app: "slack", message: "#design · 14 new messages", x: 1310, y: 250, rot: -4 },
  { app: "gmail", message: "Re: Re: Re: Q3 numbers (urgent?)", x: 1500, y: 420, rot: 3 },
  { app: "whatsapp", message: "Mom: Call me when you're free", x: 1220, y: 560, rot: -2 },
  { app: "github", message: "CI failed on main · 3 checks", x: 1560, y: 690, rot: 5 },
  { app: "googlecalendar", message: "Standup starts in 5 min", x: 1270, y: 830, rot: -5 },
  { app: "discord", message: "@everyone — raid starts now", x: 1480, y: 170, rot: 6 },
  { app: "instagram", message: "sarah.designs liked your photo", x: 1150, y: 390, rot: 4 },
  { app: "notion", message: "Alex mentioned you in Roadmap", x: 1590, y: 540, rot: -6 },
  { app: "zoom", message: "“Weekly sync” has started", x: 1360, y: 700, rot: 2 },
  { app: "x", message: "Your post is getting attention", x: 1540, y: 900, rot: -3 },
  { app: "telegram", message: "124 unread in Founders Chat", x: 1180, y: 960, rot: 5 },
  { app: "messenger", message: "Jordan sent a photo", x: 1420, y: 300, rot: -1 },
];

// Frame (relative to Problem scene) each card lands. Accelerates.
export const cardDelay = (i: number) => 14 + Math.round(i * 5.2 - i * i * 0.13);
