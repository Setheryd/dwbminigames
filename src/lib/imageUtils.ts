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
  'WhatsApp Image 2024-11-01 at 18.45.36weqwew_f722efeb.jpg': { width: 1080, height: 1920, aspectRatio: 9/16, orientation: 'portrait' }
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
  type: 'single' | 'double' | 'triple' | 'quad' | 'quint' | 'sext' | 'mixed';
}

// Helper function to shuffle an array
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function createOptimalLayout(games: any[], maxItems: number = 24): LayoutRow[] {
  // Shuffle the games array for more variety
  const shuffledGames = shuffleArray(games);
  const availableGames = shuffledGames.slice(0, maxItems);
  const rows: LayoutRow[] = [];
  let currentRow: LayoutItem[] = [];
  let currentRowHeight = 0;
  let usedThumbnails = new Set<string>();

  // Helper function to get a unique thumbnail with randomization
  function getUniqueThumbnail(): string {
    const allThumbnails = Object.keys(thumbnailDimensions);
    const availableThumbnails = allThumbnails.filter(thumbnail => {
      const fullPath = `/Thumbnails/${thumbnail}`;
      return !usedThumbnails.has(fullPath);
    });

    if (availableThumbnails.length === 0) {
      // If all thumbnails are used, reset and start over
      usedThumbnails.clear();
      return getUniqueThumbnail();
    }

    // Randomly select from available thumbnails
    const randomIndex = Math.floor(Math.random() * availableThumbnails.length);
    const selectedThumbnail = availableThumbnails[randomIndex];
    const fullPath = `/Thumbnails/${selectedThumbnail}`;
    usedThumbnails.add(fullPath);
    return fullPath;
  }



  for (let i = 0; i < availableGames.length; i++) {
    const game = availableGames[i];
    
    // First, get a random thumbnail to see what orientation we actually have
    const thumbnail = getUniqueThumbnail();
    const dimensions = getImageDimensionsFromPath(thumbnail);
    
    // Now determine if this orientation works with our current row
    let shouldStartNewRow = false;
    
    if (currentRow.length === 0) {
      // First item in row - any orientation works
      shouldStartNewRow = false;
    } else if (currentRow.length === 1) {
      if (currentRow[0].dimensions.orientation === 'portrait') {
        // Current row has portrait, we can add landscape
        if (dimensions.orientation === 'landscape') {
          shouldStartNewRow = false;
        } else {
          // Got another portrait, start new row
          shouldStartNewRow = true;
        }
      } else {
        // Current row has landscape, we can add either
        shouldStartNewRow = false;
      }
    } else if (currentRow.length === 2) {
      const hasPortrait = currentRow.some(item => item.dimensions.orientation === 'portrait');
      if (hasPortrait) {
        // Row has portrait + landscape, can add another landscape
        if (dimensions.orientation === 'landscape') {
          shouldStartNewRow = false;
        } else {
          // Got portrait, start new row
          shouldStartNewRow = true;
        }
      } else {
        // Row has 2 landscapes, can add more landscapes or portrait
        shouldStartNewRow = false;
      }
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
    if (shouldStartNewRow && currentRow.length > 0) {
      rows.push({
        items: currentRow,
        height: currentRowHeight,
        type: currentRow.length === 1 ? 'single' : 
              currentRow.length === 2 ? 'double' : 
              currentRow.length === 3 ? 'triple' :
              currentRow.length === 4 ? 'quad' :
              currentRow.length === 5 ? 'quint' : 'sext'
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
      col: currentRow.length
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
        type: currentRow.length === 1 ? 'single' : 
              currentRow.length === 2 ? 'double' : 
              currentRow.length === 3 ? 'triple' :
              currentRow.length === 4 ? 'quad' :
              currentRow.length === 5 ? 'quint' : 'sext'
      });
      currentRow = [];
      currentRowHeight = 0;
    }
  }

  // Add remaining items
  if (currentRow.length > 0) {
    rows.push({
      items: currentRow,
      height: currentRowHeight,
      type: currentRow.length === 1 ? 'single' : 
            currentRow.length === 2 ? 'double' : 
            currentRow.length === 3 ? 'triple' :
            currentRow.length === 4 ? 'quad' :
            currentRow.length === 5 ? 'quint' : 'sext'
    });
  }

  return rows;
}
