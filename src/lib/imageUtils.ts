export interface ImageDimensions {
  width: number;
  height: number;
  aspectRatio: number;
  orientation: 'landscape' | 'portrait' | 'square';
}

// Pre-defined image dimensions for the available thumbnails
export const thumbnailDimensions: Record<string, ImageDimensions> = {
  '12312312312weqwew3123.png': { width: 1920, height: 1080, aspectRatio: 16/9, orientation: 'landscape' },
  '8ZxiKr9.jpeg': { width: 1080, height: 1920, aspectRatio: 9/16, orientation: 'portrait' },
  '34234234.jpg': { width: 1920, height: 1080, aspectRatio: 16/9, orientation: 'landscape' },
  '34342342.jpeg': { width: 1080, height: 1920, aspectRatio: 9/16, orientation: 'portrait' },
  'ABDUCXTION.jpg': { width: 1920, height: 1080, aspectRatio: 16/9, orientation: 'landscape' },
  'ASpiring.jpg': { width: 1080, height: 1920, aspectRatio: 9/16, orientation: 'portrait' },
  'dead piccalo.jpg': { width: 1920, height: 1080, aspectRatio: 16/9, orientation: 'landscape' },
  'king kong.jpg': { width: 1080, height: 1920, aspectRatio: 9/16, orientation: 'portrait' },
  'ph1.jpg': { width: 1920, height: 1080, aspectRatio: 16/9, orientation: 'landscape' },
  'ph2.jpg': { width: 1080, height: 1920, aspectRatio: 9/16, orientation: 'portrait' },
  'ph3.jpg': { width: 1920, height: 1080, aspectRatio: 16/9, orientation: 'landscape' },
  'ph4.jpg': { width: 1080, height: 1920, aspectRatio: 9/16, orientation: 'portrait' },
  'ph5.jpg': { width: 1920, height: 1080, aspectRatio: 16/9, orientation: 'landscape' },
  'PITO.jpg': { width: 1080, height: 1920, aspectRatio: 9/16, orientation: 'portrait' },
  'Powerr.jpg': { width: 1920, height: 1080, aspectRatio: 16/9, orientation: 'landscape' },
  'Squishy.jpg': { width: 1080, height: 1920, aspectRatio: 9/16, orientation: 'portrait' },
  'Untitled (3).png': { width: 1920, height: 1080, aspectRatio: 16/9, orientation: 'landscape' },
  'Untitled (14).png': { width: 1080, height: 1920, aspectRatio: 9/16, orientation: 'portrait' },
  'WhatsApp Image 2024-10-10222 at 18.11.45_bf26d145.jpg': { width: 1920, height: 1080, aspectRatio: 16/9, orientation: 'landscape' },
  'WhatsApp Image 2024-10-16 at 18.15.08_3a7498b7.jpg': { width: 1080, height: 1920, aspectRatio: 9/16, orientation: 'portrait' },
  'WhatsApp Image 2024-10-16 at 18.33315.10_804590e3.jpg': { width: 1920, height: 1080, aspectRatio: 16/9, orientation: 'landscape' },
  'WhatsApp Image 2024-10-24 at 19.39.16_df0ad8ererer8.jpg': { width: 1080, height: 1920, aspectRatio: 9/16, orientation: 'portrait' },
  'WhatsApp Image 2024-10-27 at 17.47.4339_6e2ace75.jpg': { width: 1920, height: 1080, aspectRatio: 16/9, orientation: 'landscape' },
  'WhatsApp Image 2024-11-01 at 18.45.36weqwew_f722efeb.jpg': { width: 1080, height: 1920, aspectRatio: 9/16, orientation: 'portrait' },
};

export function getImageDimensions(filename: string): ImageDimensions {
  return thumbnailDimensions[filename] || { width: 1920, height: 1080, aspectRatio: 16/9, orientation: 'landscape' };
}

export function getImageDimensionsFromPath(path: string): ImageDimensions {
  const filename = path.split('/').pop() || '';
  return getImageDimensions(filename);
}

export interface LayoutItem {
  id: string;
  title: string;
  thumbnail: string;
  dimensions: ImageDimensions;
  width: number;
  height: number;
  row: number;
  col: number;
}

export interface LayoutRow {
  items: LayoutItem[];
  height: number;
  type: 'triple' | 'quad' | 'quint' | 'sext' | 'mixed';
}

// Helper function to shuffle an array with a deterministic seed
function shuffleArrayWithSeed<T>(array: T[], seed: number): T[] {
  const shuffled = [...array];
  let currentSeed = seed;

  // Simple deterministic random number generator
  const random = () => {
    currentSeed = (currentSeed * 9301 + 49297) % 233280;
    return currentSeed / 233280;
  };

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    // Use temporary variable to avoid TypeScript destructuring issues
    const temp = shuffled[i]!;
    shuffled[i] = shuffled[j]!;
    shuffled[j] = temp;
  }
  return shuffled;
}

// Helper function to shuffle an array (for backward compatibility)
function _shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    // Use temporary variable to avoid TypeScript destructuring issues
    const temp = shuffled[i]!;
    shuffled[i] = shuffled[j]!;
    shuffled[j] = temp;
  }
  return shuffled;
}

interface Game {
  id: string;
  title: string;
  thumbnail?: string;
}

export function createOptimalLayout(games: Game[], maxItems: number = 24): LayoutRow[] {
  // Use a deterministic seed for consistent server/client rendering
  const seed = games.length + maxItems; // Simple deterministic seed
  const shuffledGames = shuffleArrayWithSeed(games, seed);
  const availableGames = shuffledGames.slice(0, maxItems);
  const rows: LayoutRow[] = [];
  let currentRow: LayoutItem[] = [];
  let currentRowHeight = 0;
  const usedThumbnails = new Set<string>();

  // Helper function to get a unique thumbnail with deterministic selection
  let thumbnailIndex = 0;
  function getUniqueThumbnail(): string {
    const allThumbnails = Object.keys(thumbnailDimensions);
    const availableThumbnails = allThumbnails.filter(thumbnail => {
      const fullPath = `/Thumbnails/${thumbnail}`;
      return !usedThumbnails.has(fullPath);
    });

    if (availableThumbnails.length === 0) {
      // If all thumbnails are used, reset and start over
      usedThumbnails.clear();
      thumbnailIndex = 0;
      return getUniqueThumbnail();
    }

    // Deterministically select from available thumbnails
    const selectedThumbnail = availableThumbnails[thumbnailIndex % availableThumbnails.length];
    const fullPath = `/Thumbnails/${selectedThumbnail}`;
    usedThumbnails.add(fullPath);
    thumbnailIndex++;
    return fullPath;
  }

  for (let i = 0; i < availableGames.length; i++) {
    const game = availableGames[i];

    if (!game) continue;

    // Determine the thumbnail to use, preferring the game's own if provided
    const thumbnail = game.thumbnail || getUniqueThumbnail();
    const dimensions = getImageDimensionsFromPath(thumbnail);

    // Now determine if this orientation works with our current row
    let shouldStartNewRow = false;

    if (currentRow.length === 0) {
      // First item in row - any orientation works
      shouldStartNewRow = false;
    } else if (currentRow.length === 1) {
      // Always add to row if we only have 1 item (need at least 3)
      shouldStartNewRow = false;
    } else if (currentRow.length === 2) {
      // Always add to row if we only have 2 items (need at least 3)
      shouldStartNewRow = false;
    } else if (currentRow.length === 3) {
      const hasPortrait = currentRow.some(item => item.dimensions.orientation === 'portrait');
      if (hasPortrait) {
        // Row has portrait + landscapes, can add more landscapes
        if (dimensions.orientation === 'landscape') {
          shouldStartNewRow = false;
        } else {
          // Got portrait, start new row
          shouldStartNewRow = true;
        }
      } else {
        // Row has 3 landscapes, can add more landscapes or portrait
        shouldStartNewRow = false;
      }
    } else if (currentRow.length === 4) {
      const hasPortrait = currentRow.some(item => item.dimensions.orientation === 'portrait');
      if (hasPortrait) {
        // Row has portrait + landscapes, can add more landscapes
        if (dimensions.orientation === 'landscape') {
          shouldStartNewRow = false;
        } else {
          // Got portrait, start new row
          shouldStartNewRow = true;
        }
      } else {
        // Row has 4 landscapes, can add more landscapes or portrait
        shouldStartNewRow = false;
      }
    } else if (currentRow.length === 5) {
      const hasPortrait = currentRow.some(item => item.dimensions.orientation === 'portrait');
      if (hasPortrait) {
        // Row has portrait + landscapes, can add one more landscape
        if (dimensions.orientation === 'landscape') {
          shouldStartNewRow = false;
        } else {
          // Got portrait, start new row
          shouldStartNewRow = true;
        }
      } else {
        // Row has 5 landscapes, can add one more landscape or portrait
        shouldStartNewRow = false;
      }
    } else {
      // Row is full (6 items), start new row
      shouldStartNewRow = true;
    }

    // If we need to start a new row, do it first
    // But only if we have at least 3 items (minimum requirement)
    if (shouldStartNewRow && currentRow.length >= 3) {
      rows.push({
        items: currentRow,
        height: currentRowHeight,
        type: currentRow.length === 3 ? 'triple' :
              currentRow.length === 4 ? 'quad' :
              currentRow.length === 5 ? 'quint' : 'sext',
      });
      currentRow = [];
      currentRowHeight = 0;
    }

    const item: LayoutItem = {
      id: game.id,
      title: game.title,
      thumbnail,
      dimensions,
      width: 0,
      height: 0,
      row: rows.length,
      col: currentRow.length,
    };

    // Add the item to the current row
    currentRow.push(item);

    // Update row height based on the new item
    if (dimensions.orientation === 'portrait') {
      currentRowHeight = Math.max(currentRowHeight, 300);
    } else {
      currentRowHeight = Math.max(currentRowHeight, 200);
    }

    // If we have 6 items in a row, start a new row (for normal window sizes)
    if (currentRow.length >= 6) {
      rows.push({
        items: currentRow,
        height: currentRowHeight,
        type: currentRow.length === 3 ? 'triple' :
              currentRow.length === 4 ? 'quad' :
              currentRow.length === 5 ? 'quint' : 'sext',
      });
      currentRow = [];
      currentRowHeight = 0;
    }
  }

  // Add remaining items (only if we have at least 3 items)
  if (currentRow.length >= 3) {
    rows.push({
      items: currentRow,
      height: currentRowHeight,
      type: currentRow.length === 3 ? 'triple' :
            currentRow.length === 4 ? 'quad' :
            currentRow.length === 5 ? 'quint' : 'sext',
    });
  }

  return rows;
}
