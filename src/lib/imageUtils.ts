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
  type: 'single' | 'double' | 'triple' | 'mixed';
}

export function createOptimalLayout(games: any[], maxItems: number = 24): LayoutRow[] {
  const availableGames = games.slice(0, maxItems);
  const rows: LayoutRow[] = [];
  let currentRow: LayoutItem[] = [];
  let currentRowHeight = 0;
  let usedThumbnails = new Set<string>();

  // Helper function to get a unique thumbnail
  function getUniqueThumbnail(): string {
    const allThumbnails = Object.keys(thumbnailDimensions);
    for (const thumbnail of allThumbnails) {
      const fullPath = `/Thumbnails/${thumbnail}`;
      if (!usedThumbnails.has(fullPath)) {
        usedThumbnails.add(fullPath);
        return fullPath;
      }
    }
    // If all thumbnails are used, reset and start over
    usedThumbnails.clear();
    const firstThumbnail = allThumbnails[0];
    usedThumbnails.add(`/Thumbnails/${firstThumbnail}`);
    return `/Thumbnails/${firstThumbnail}`;
  }

  for (let i = 0; i < availableGames.length; i++) {
    const game = availableGames[i];
    const thumbnail = getUniqueThumbnail();
    const dimensions = getImageDimensionsFromPath(thumbnail);
    
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

    // Determine layout based on aspect ratio
    if (dimensions.orientation === 'portrait') {
      // Portrait images (9:16) - can be stacked with 2 landscape images
      if (currentRow.length === 0) {
        // Start new row with portrait
        currentRow = [item];
        currentRowHeight = 300; // Base height for portrait
      } else if (currentRow.length === 1 && currentRow[0].dimensions.orientation === 'landscape') {
        // Add portrait to existing landscape
        currentRow.push(item);
        currentRowHeight = Math.max(currentRowHeight, 300);
      } else {
        // Start new row
        if (currentRow.length > 0) {
          rows.push({
            items: currentRow,
            height: currentRowHeight,
            type: currentRow.length === 1 ? 'single' : 'mixed'
          });
        }
        currentRow = [item];
        currentRowHeight = 300;
      }
    } else {
      // Landscape images (16:9)
      if (currentRow.length === 0) {
        // Start new row with landscape
        currentRow = [item];
        currentRowHeight = 200; // Base height for landscape
      } else if (currentRow.length === 1) {
        if (currentRow[0].dimensions.orientation === 'portrait') {
          // Add landscape to existing portrait
          currentRow.push(item);
          currentRowHeight = Math.max(currentRowHeight, 200);
        } else {
          // Add second landscape
          currentRow.push(item);
          currentRowHeight = 200;
        }
      } else if (currentRow.length === 2) {
        // Add third landscape
        currentRow.push(item);
        currentRowHeight = 200;
      } else {
        // Start new row
        rows.push({
          items: currentRow,
          height: currentRowHeight,
          type: currentRow.length === 1 ? 'single' : currentRow.length === 2 ? 'double' : 'triple'
        });
        currentRow = [item];
        currentRowHeight = 200;
      }
    }

    // If we have 3 items in a row, start a new row
    if (currentRow.length >= 3) {
      rows.push({
        items: currentRow,
        height: currentRowHeight,
        type: currentRow.length === 1 ? 'single' : currentRow.length === 2 ? 'double' : 'triple'
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
      type: currentRow.length === 1 ? 'single' : currentRow.length === 2 ? 'double' : 'triple'
    });
  }

  return rows;
}
