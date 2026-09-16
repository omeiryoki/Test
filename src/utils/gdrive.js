/**
 * Google Drive Image Link Helper
 * Parses shared Google Drive URLs and converts them into direct image display URLs.
 */

export function extractGDriveFileId(urlStr) {
  if (!urlStr || typeof urlStr !== 'string') return null;

  const url = urlStr.trim();

  // Pattern 1: /file/d/FILE_ID/view or /file/d/FILE_ID/edit
  const matchD = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (matchD && matchD[1]) return matchD[1];

  // Pattern 2: ?id=FILE_ID or &id=FILE_ID
  const matchId = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (matchId && matchId[1]) return matchId[1];

  // Pattern 3: googleusercontent.com/d/FILE_ID
  const matchLh3 = url.match(/googleusercontent\.com\/d\/([a-zA-Z0-9_-]+)/);
  if (matchLh3 && matchLh3[1]) return matchLh3[1];

  return null;
}

export function formatImageUrl(urlInput) {
  if (!urlInput) return null;
  const trimmed = urlInput.trim();

  const fileId = extractGDriveFileId(trimmed);
  if (fileId) {
    // Return high-res thumbnail endpoint or lh3 googleusercontent URL
    return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;
  }

  // Check if it's a standard web image URL or base64 data URL
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('data:image/')) {
    return trimmed;
  }

  return null;
}

export function isGDriveUrl(urlInput) {
  return !!extractGDriveFileId(urlInput);
}
