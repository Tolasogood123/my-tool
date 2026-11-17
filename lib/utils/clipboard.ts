export async function copyTextToClipboard(text: string): Promise<void> {
  if (!text) {
    throw new Error("There is nothing to copy yet.");
  }

  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();

  try {
    const copied = document.execCommand("copy");
    if (!copied) throw new Error("Copy failed.");
  } finally {
    document.body.removeChild(textarea);
  }
}
