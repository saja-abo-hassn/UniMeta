export type MascotState = "greeting" | "idle" | "typing" | "thinking" | "answered";

export type MascotAction =
  | { type: "OPEN_CHAT" }
  | { type: "CLOSE_CHAT" }
  | { type: "GREETING_TIMEOUT" }
  | { type: "USER_START_TYPING" }
  | { type: "USER_STOP_TYPING" }
  | { type: "SEND_MESSAGE" }
  | { type: "RECEIVE_ANSWER" }
  | { type: "ANSWER_TIMEOUT" }
  | { type: "ERROR" };

export function mascotReducer(state: MascotState, action: MascotAction): MascotState {
  switch (action.type) {
    case "OPEN_CHAT":
      return "greeting";
    case "CLOSE_CHAT":
      return "idle";
    case "GREETING_TIMEOUT":
      return state === "greeting" ? "idle" : state;
    case "USER_START_TYPING":
      return state === "idle" ? "typing" : state;
    case "USER_STOP_TYPING":
      return state === "typing" ? "idle" : state;
    case "SEND_MESSAGE":
      return "thinking";
    case "RECEIVE_ANSWER":
      return "answered";
    case "ANSWER_TIMEOUT":
      return state === "answered" ? "idle" : state;
    case "ERROR":
      return "idle";
    default:
      return state;
  }
}

export const MASCOT_PRELOAD_IMAGES = [
  "/mascot/peek.png",
  "/mascot/wave.png",
  "/mascot/think.png",
  "/mascot/book.png",
  "/mascot/head.png",
];

export function getImageConfig(state: MascotState) {
  switch (state) {
    case "greeting":
      return {
        src: "/mascot/wave.png",
        alt: "UniMeta AI Greeting",
        imgClass: "object-cover object-top scale-115 -translate-y-1 drop-shadow-xs",
      };
    case "idle":
      return {
        src: "/mascot/peek.png",
        alt: "UniMeta AI Peeking",
        imgClass: "object-contain object-bottom drop-shadow-xs",
      };
    case "typing":
      return {
        src: "/mascot/peek.png",
        alt: "UniMeta AI Listening",
        imgClass: "object-contain object-bottom drop-shadow-xs",
      };
    case "thinking":
      return {
        src: "/mascot/think.png",
        alt: "UniMeta AI Thinking",
        imgClass: "object-cover object-top scale-115 -translate-y-1 drop-shadow-xs",
      };
    case "answered":
      return {
        src: "/mascot/book.png",
        alt: "UniMeta AI Answered",
        imgClass: "object-cover object-top scale-115 -translate-y-1 drop-shadow-xs",
      };
  }
}

