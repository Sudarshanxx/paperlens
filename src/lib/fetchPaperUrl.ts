// src/lib/fetchPaperUrl.ts

export async function fetchTextFromUrl(url: string): Promise<string> {
  // Handle arXiv URLs - convert to abs page to get abstract + metadata
  const arxivMatch = url.match(
    /arxiv\.org\/(abs|pdf)\/([0-9]{4}\.[0-9]+|[a-z\-]+\/[0-9]+)/i
  );
  if (arxivMatch) {
    const paperId = arxivMatch[2];
    // Try to get the abstract page text
    const absUrl = `https://arxiv.org/abs/${paperId}`;
    const res = await fetch(absUrl, {
      headers: { "User-Agent": "PaperLens/1.0 (research tool)" },
    });
    if (!res.ok) throw new Error(`Failed to fetch arXiv page: ${res.status}`);
    const html = await res.text();
    // Extract abstract text
    const abstractMatch = html.match(
      /blockquote class="abstract[^"]*"[^>]*>([\s\S]*?)<\/blockquote>/i
    );
    const titleMatch = html.match(/<h1[^>]*class="[^"]*title[^"]*"[^>]*>([\s\S]*?)<\/h1>/i);
    const abstract = abstractMatch
      ? abstractMatch[1].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()
      : "";
    const title = titleMatch
      ? titleMatch[1].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()
      : "";
    return `${title}\n\n${abstract}`;
  }

  // Generic URL: just fetch and strip HTML
  const res = await fetch(url, {
    headers: { "User-Agent": "PaperLens/1.0 (research tool)" },
  });
  if (!res.ok) throw new Error(`Failed to fetch URL: ${res.status}`);
  const html = await res.text();
  // Basic HTML strip
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .slice(0, 30000)
    .trim();
}
