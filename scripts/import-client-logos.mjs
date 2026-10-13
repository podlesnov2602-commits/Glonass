// Verified image URLs from the existing site's "Наши клиенты" section.
// Runs on GitHub only; vendor images become part of this repository.
import { mkdir, writeFile, access } from 'node:fs/promises';
const sources = [
  {
    "path": "assets/clients/client-1.jpg",
    "url": "https://glonass-navi.kz/wp-content/uploads/2024/09/1-2.jpg"
  },
  {
    "path": "assets/clients/client-2.jpg",
    "url": "https://glonass-navi.kz/wp-content/uploads/2024/09/2-1.jpg"
  },
  {
    "path": "assets/clients/client-3.jpg",
    "url": "https://glonass-navi.kz/wp-content/uploads/2024/09/3-1.jpg"
  },
  {
    "path": "assets/clients/client-4.jpg",
    "url": "https://glonass-navi.kz/wp-content/uploads/2024/09/4-1.jpg"
  },
  {
    "path": "assets/clients/client-5.jpg",
    "url": "https://glonass-navi.kz/wp-content/uploads/2024/09/5.jpg"
  },
  {
    "path": "assets/clients/client-6.jpg",
    "url": "https://glonass-navi.kz/wp-content/uploads/2024/09/6.jpg"
  },
  {
    "path": "assets/clients/client-7.jpg",
    "url": "https://glonass-navi.kz/wp-content/uploads/2024/09/9.jpg"
  }
];
await mkdir('assets/clients', { recursive: true });
for (const {path, url} of sources) {
  try { await access(path); continue; } catch {}
  const response = await fetch(url, { signal: AbortSignal.timeout(45000) });
  if (!response.ok) throw new Error('Logo request failed: ' + response.status + ' ' + url);
  const bytes = Buffer.from(await response.arrayBuffer());
  if (bytes.length > 3000000 || bytes[0] !== 0xff || bytes[1] !== 0xd8) throw new Error('Invalid JPEG: ' + url);
  await writeFile(path, bytes);
  console.log('Imported ' + path + ': ' + bytes.length + ' bytes');
}
