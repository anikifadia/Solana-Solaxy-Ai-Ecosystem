import React from 'react';
import HERO_SHEET_URL from '../assets/images/solaxy_mascot_hero_1783437956325.jpg';
import POSES_SHEET_URL from '../assets/images/solaxy_mascot_poses_1783437972677.jpg';

export type SlicedAssetKey =
  // 1024x1024 Sheet (solaxy_mascot_hero_1783437956325.jpg)
  | 'main-pose'
  | 'logo-beyond'
  | 'logo-white'
  | 'special-badge'
  | 'button-presale'
  | 'app-icon'
  | 'detail-helmet'
  | 'detail-jacket'
  | 'detail-cape'
  // Icons from 1024x1024 Sheet (UNIQUE ICONS row)
  | 'icon-fast'
  | 'icon-secure'
  | 'icon-scalable'
  | 'icon-community'
  | 'icon-innovative'
  | 'icon-rocket'
  | 'icon-decentralized'
  | 'icon-futuristic'
  | 'icon-solana'
  | 'icon-appicon-mini'
  // 1376x768 Poses Sheet (solaxy_mascot_poses_1783437972677.jpg)
  // Row 1 (5 Large Cards)
  | 'pose-large-thumbs-up'
  | 'pose-large-laptop-planet'
  | 'pose-large-standing-shield'
  | 'pose-large-hoverboard'
  | 'pose-large-meditating'
  // Row 2 (8 Chibis)
  | 'chibi-wave'
  | 'chibi-confused'
  | 'chibi-swirl'
  | 'chibi-tablet'
  | 'chibi-heart'
  | 'chibi-idea'
  | 'chibi-shades'
  | 'chibi-laptop'
  // Row 3 (6 Medium Cards)
  | 'card-speed'
  | 'card-security'
  | 'card-innovation'
  | 'card-explorer'
  | 'card-community'
  | 'card-builder';

interface SlicedAssetProps {
  asset: SlicedAssetKey;
  className?: string;
  style?: React.CSSProperties;
}

interface AssetConfig {
  url: string;
  size: string;      // background-size
  position: string;  // background-position
  aspectRatio: string; // for layout sizing
}

const ASSETS_MAP: Record<SlicedAssetKey, AssetConfig> = {
  // === 1024x1024 Sheet ===
  'main-pose': {
    url: HERO_SHEET_URL,
    size: '379.2% 325%',
    position: '1.99% 15.51%',
    aspectRatio: 'aspect-[270/315]'
  },
  'logo-beyond': {
    url: HERO_SHEET_URL,
    size: '640% 787.7%',
    position: '77.54% 12.3%',
    aspectRatio: 'aspect-[160/130]'
  },
  'logo-white': {
    url: HERO_SHEET_URL,
    size: '682.7% 2925.7%',
    position: '77.23% 33.87%',
    aspectRatio: 'aspect-[150/35]'
  },
  'special-badge': {
    url: HERO_SHEET_URL,
    size: '538.9% 499.5%',
    position: '72.54% 92.79%',
    aspectRatio: 'aspect-[190/205]'
  },
  'button-presale': {
    url: HERO_SHEET_URL,
    size: '682.7% 2925.7%',
    position: '93.24% 91.0%',
    aspectRatio: 'aspect-[150/35]'
  },
  'app-icon': {
    url: HERO_SHEET_URL,
    size: '1280% 1280%',
    position: '93.75% 35.48%',
    aspectRatio: 'aspect-square'
  },
  'detail-helmet': {
    url: HERO_SHEET_URL,
    size: '975.2% 930.9%',
    position: '72.36% 66.74%',
    aspectRatio: 'aspect-[105/110]'
  },
  'detail-jacket': {
    url: HERO_SHEET_URL,
    size: '1024% 930.9%',
    position: '83.87% 66.74%',
    aspectRatio: 'aspect-[100/110]'
  },
  'detail-cape': {
    url: HERO_SHEET_URL,
    size: '1024% 930.9%',
    position: '95.23% 66.74%',
    aspectRatio: 'aspect-[100/110]'
  },

  // === UNIQUE ICONS ===
  'icon-fast': {
    url: HERO_SHEET_URL,
    size: '1137.8% 1137.8%',
    position: '2.67% 81.9%',
    aspectRatio: 'aspect-square'
  },
  'icon-secure': {
    url: HERO_SHEET_URL,
    size: '1137.8% 1137.8%',
    position: '14.45% 81.9%',
    aspectRatio: 'aspect-square'
  },
  'icon-scalable': {
    url: HERO_SHEET_URL,
    size: '1137.8% 1137.8%',
    position: '26.23% 81.9%',
    aspectRatio: 'aspect-square'
  },
  'icon-community': {
    url: HERO_SHEET_URL,
    size: '1137.8% 1137.8%',
    position: '38.0% 81.9%',
    aspectRatio: 'aspect-square'
  },
  'icon-innovative': {
    url: HERO_SHEET_URL,
    size: '1137.8% 1137.8%',
    position: '49.78% 81.9%',
    aspectRatio: 'aspect-square'
  },
  'icon-rocket': {
    url: HERO_SHEET_URL,
    size: '1137.8% 1137.8%',
    position: '2.67% 93.68%',
    aspectRatio: 'aspect-square'
  },
  'icon-decentralized': {
    url: HERO_SHEET_URL,
    size: '1137.8% 1137.8%',
    position: '14.45% 93.68%',
    aspectRatio: 'aspect-square'
  },
  'icon-futuristic': {
    url: HERO_SHEET_URL,
    size: '1137.8% 1137.8%',
    position: '26.23% 93.68%',
    aspectRatio: 'aspect-square'
  },
  'icon-solana': {
    url: HERO_SHEET_URL,
    size: '1137.8% 1137.8%',
    position: '38.0% 93.68%',
    aspectRatio: 'aspect-square'
  },
  'icon-appicon-mini': {
    url: HERO_SHEET_URL,
    size: '1137.8% 1137.8%',
    position: '49.78% 93.68%',
    aspectRatio: 'aspect-square'
  },

  // === 1376x768 Sheet - Row 1 ===
  'pose-large-thumbs-up': {
    url: POSES_SHEET_URL,
    size: '500% 284.4%',
    position: '0% 14.05%',
    aspectRatio: 'aspect-[275/270]'
  },
  'pose-large-laptop-planet': {
    url: POSES_SHEET_URL,
    size: '500% 284.4%',
    position: '24.97% 14.05%',
    aspectRatio: 'aspect-[275/270]'
  },
  'pose-large-standing-shield': {
    url: POSES_SHEET_URL,
    size: '500% 284.4%',
    position: '49.95% 14.05%',
    aspectRatio: 'aspect-[275/270]'
  },
  'pose-large-hoverboard': {
    url: POSES_SHEET_URL,
    size: '500% 284.4%',
    position: '74.93% 14.05%',
    aspectRatio: 'aspect-[275/270]'
  },
  'pose-large-meditating': {
    url: POSES_SHEET_URL,
    size: '500% 284.4%',
    position: '100% 14.05%',
    aspectRatio: 'aspect-[275/270]'
  },

  // === 1376x768 Sheet - Row 2 ===
  'chibi-wave': {
    url: POSES_SHEET_URL,
    size: '800% 590.7%',
    position: '0% 59.56%',
    aspectRatio: 'aspect-[172/130]'
  },
  'chibi-confused': {
    url: POSES_SHEET_URL,
    size: '800% 590.7%',
    position: '14.28% 59.56%',
    aspectRatio: 'aspect-[172/130]'
  },
  'chibi-swirl': {
    url: POSES_SHEET_URL,
    size: '800% 590.7%',
    position: '28.57% 59.56%',
    aspectRatio: 'aspect-[172/130]'
  },
  'chibi-tablet': {
    url: POSES_SHEET_URL,
    size: '800% 590.7%',
    position: '42.85% 59.56%',
    aspectRatio: 'aspect-[172/130]'
  },
  'chibi-heart': {
    url: POSES_SHEET_URL,
    size: '800% 590.7%',
    position: '57.14% 59.56%',
    aspectRatio: 'aspect-[172/130]'
  },
  'chibi-idea': {
    url: POSES_SHEET_URL,
    size: '800% 590.7%',
    position: '71.42% 59.56%',
    aspectRatio: 'aspect-[172/130]'
  },
  'chibi-shades': {
    url: POSES_SHEET_URL,
    size: '800% 590.7%',
    position: '85.71% 59.56%',
    aspectRatio: 'aspect-[172/130]'
  },
  'chibi-laptop': {
    url: POSES_SHEET_URL,
    size: '800% 590.7%',
    position: '100% 59.56%',
    aspectRatio: 'aspect-[172/130]'
  },

  // === 1376x768 Sheet - Row 3 ===
  'card-speed': {
    url: POSES_SHEET_URL,
    size: '600.8% 365.7%',
    position: '0% 92.29%',
    aspectRatio: 'aspect-[229/210]'
  },
  'card-security': {
    url: POSES_SHEET_URL,
    size: '600.8% 365.7%',
    position: '19.96% 92.29%',
    aspectRatio: 'aspect-[229/210]'
  },
  'card-innovation': {
    url: POSES_SHEET_URL,
    size: '600.8% 365.7%',
    position: '39.93% 92.29%',
    aspectRatio: 'aspect-[229/210]'
  },
  'card-explorer': {
    url: POSES_SHEET_URL,
    size: '600.8% 365.7%',
    position: '59.89% 92.29%',
    aspectRatio: 'aspect-[229/210]'
  },
  'card-community': {
    url: POSES_SHEET_URL,
    size: '600.8% 365.7%',
    position: '79.86% 92.29%',
    aspectRatio: 'aspect-[229/210]'
  },
  'card-builder': {
    url: POSES_SHEET_URL,
    size: '600.8% 365.7%',
    position: '99.82% 92.29%',
    aspectRatio: 'aspect-[229/210]'
  }
};

export default function SlicedAsset({ asset, className = '', style = {} }: SlicedAssetProps) {
  const cfg = ASSETS_MAP[asset];
  if (!cfg) return null;

  return (
    <div
      className={`relative inline-block overflow-hidden bg-no-repeat select-none ${cfg.aspectRatio} ${className}`}
      style={{
        backgroundImage: `url(${cfg.url})`,
        backgroundSize: cfg.size,
        backgroundPosition: cfg.position,
        ...style
      }}
      referrerPolicy="no-referrer"
    />
  );
}
