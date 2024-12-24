export function saveToFile(filename: string, data: string) {
  const file = new File([data], `${filename}.json`, { type: "text/json" });
  const link = document.createElement("a");
  link.style.display = "none";
  link.href = URL.createObjectURL(file);
  link.download = file.name;
  document.body.appendChild(link);
  link.click();

  setTimeout(() => {
    URL.revokeObjectURL(link.href);
    document.body.removeChild(link);
  }, 0);
}

export function loadFromFile(
  fileTypes: string | null = null
): Promise<string | null> {
  return new Promise((resolve) => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    if (fileTypes !== null) {
      input.setAttribute("accept", fileTypes);
    }
    input.style.display = "none";
    document.body.appendChild(input);

    input.onchange = async function () {
      if (!input.files) return;
      const file = input.files[0];
      const data = await file.arrayBuffer();
      resolve(String.fromCharCode(...new Uint8Array(data)));
    };
    input.onabort = function () {
      document.body.removeChild(input);
      resolve(null);
    };
    input.oncancel = function () {
      document.body.removeChild(input);
      resolve(null);
    };
    input.click();
  });
}
