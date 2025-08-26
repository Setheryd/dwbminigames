'use client';

import { Game } from '@/types/game';
import Image from 'next/image';
import Link from 'next/link';
import { Star, Clock } from 'lucide-react';
import { createOptimalLayout, LayoutRow } from '@/lib/imageUtils';
import { motion } from 'framer-motion';
import styles from './GameGrid.module.css';

interface GameGridProps {
  games: Game[];
  title?: string;
  showLabels?: boolean;
  maxItems?: number;
}

export default function GameGrid({ games, title, showLabels = false, maxItems = 24 }: GameGridProps) {
  const layoutRows = createOptimalLayout(games, maxItems);

  const getRowLayoutClass = (row: LayoutRow) => {
    switch (row.type) {
      case 'triple':
        return styles.triple;
      case 'quad':
        return styles.quad;
      case 'quint':
        return styles.quint;
      case 'sext':
        return styles.sext;
      case 'mixed':
        return styles.mixed;
      default:
        return styles.triple;
    }
  };

  const getItemLayoutClass = (item: any, row: LayoutRow) => {
    if (row.type === 'mixed' && row.items.length === 2) {
      if (item.dimensions.orientation === 'portrait') {
        return styles.portrait;
      } else {
        return styles.landscape;
      }
    }
    return styles.landscape;
  };

  return (
    <div className={styles.gameGridContainer}>
      {title && (
        <h2 className="text-xl font-bold mb-4 px-4">{title}</h2>
      )}

      <div className={styles.gameGridWrapper}>
        {layoutRows.map((row, rowIndex) => (
          <motion.div
            key={rowIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: rowIndex * 0.1 }}
            className={`${styles.gameGridRow} ${getRowLayoutClass(row)}`}
            style={{ height: `${row.height}px` }}
          >
            {row.items.map((item, itemIndex) => (
              <motion.div
                key={`${item.id}-${itemIndex}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: rowIndex * 0.1 + itemIndex * 0.05 }}
                className={`${styles.gameGridItem} ${getItemLayoutClass(item, row)}`}
              >
                <Link
                  href={`/games/${item.id}`}
                  className={styles.gameGridLink}
                >
                  {/* Game Labels */}
                  {showLabels && (
                    <>
                      {games.find(g => g.id === item.id)?.isRecent && (
                        <div className={`${styles.gameGridLabel} ${styles.gameGridLabelUpdated}`}>
                          New
                        </div>
                      )}
                      {games.find(g => g.id === item.id)?.isPopular && (
                        <div className={`${styles.gameGridLabel} ${styles.gameGridLabelTopRated}`}>
                          Popular
                        </div>
                      )}
                      {games.find(g => g.id === item.id)?.isBest && (
                        <div className={`${styles.gameGridLabel} ${styles.gameGridLabelTopRated}`}>
                          Top Rated
                        </div>
                      )}
                    </>
                  )}

                  {/* Game Title */}
                  <div className={styles.gameGridTitle}>
                    {item.title}
                  </div>

                  {/* Game Image */}
                  <div className={styles.gameGridImageContainer}>
                    <Image
                      src={item.thumbnail}
                      alt={item.title}
                      fill
                      className={styles.gameGridImage}
                      loading={rowIndex < 2 ? 'eager' : 'lazy'}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>

                  {/* Game Meta Info */}
                  <div className={styles.gameGridMeta}>
                    <div className={styles.gameGridMetaContent}>
                      <Star className="w-3 h-3 text-yellow-400" />
                      <span>{games.find(g => g.id === item.id)?.highScore.toLocaleString() || '0'}</span>
                      <span>•</span>
                      <Clock className="w-3 h-3" />
                      <span>{games.find(g => g.id === item.id)?.estimatedPlayTime || '5-15 min'}</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
