export function play(source: string) {
  const audio = new Audio(source);
  audio.play().catch((error) => {
    console.error("Error playing audio:", error);
  });
}
