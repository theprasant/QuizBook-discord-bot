export interface TextChunk {
  index: number;
  text: string;
}

export function chunkText(text: string, chunkSize = 900, overlap = 150): TextChunk[] {
  const words = text.replace(/\s+/g, " ").trim().split(" ").filter(Boolean);

  if (words.length === 0) {
    return [];
  }

  const chunks: TextChunk[] = [];
  const step = Math.max(1, chunkSize - overlap);

  for (let start = 0; start < words.length; start += step) {
    const chunkWords = words.slice(start, start + chunkSize);
    chunks.push({
      index: chunks.length,
      text: chunkWords.join(" "),
    });

    if (start + chunkSize >= words.length) {
      break;
    }
  }

  return chunks;
}
