export function play(source: string) {
  const audio = new Audio(source);
  audio.play().catch((error) => {
    console.error("Error playing audio:", error);
  });
}

export function preload(source: string) {
  const audio = new Audio(source);
  audio.preload = "auto";
  audio.load();
}

export function init() {
  preload("/dice-roll.mp3");
  preload("/error.mp3");
  preload("/notify.mp3");
}
