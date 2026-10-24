import React from 'react';
import type { ArtworkTransform } from '../../types';

interface GarmentCanvasProps {
  garmentType: 'oversized_tee' | 'hoodie';
  garmentColor: string;
  viewSide: 'front' | 'back';
  customText: string;
  fontFamily: string;
  textColor: string;
  artworkUrl: string | null;
  artworkTransform: ArtworkTransform;
  onUpdateTransform: (updated: Partial<ArtworkTransform>) => void;
}

export const GarmentCanvas: React.FC<GarmentCanvasProps> = ({
  garmentType,
  garmentColor,
  viewSide,
  customText,
  fontFamily,
  textColor,
  artworkUrl,
  artworkTransform
}) => {
  // SVG Garment Paths
  // T-shirt silhouette
  const teeFrontPath =
    'M 120 40 L 170 30 Q 200 65 230 30 L 280 40 L 370 110 L 320 160 L 270 120 L 270 370 L 130 370 L 130 120 L 80 160 L 30 110 Z';
  const teeCollarPath =
    'M 170 30 Q 200 65 230 30 Q 200 55 170 30 Z';
  const teeBackCollarPath =
    'M 170 30 Q 200 42 230 30 Q 200 35 170 30 Z';

  // Hoodie silhouette
  const hoodieFrontPath =
    'M 115 50 L 155 35 Q 200 45 245 35 L 285 50 L 380 125 L 330 180 L 280 135 L 280 380 L 120 380 L 120 135 L 70 180 L 20 125 Z';
  const hoodiePouchPath =
    'M 150 290 L 250 290 L 265 350 L 135 350 Z';
  const hoodShapePath =
    'M 155 35 Q 120 -15 200 -20 Q 280 -15 245 35 Q 200 15 155 35 Z';

  const isHoodie = garmentType === 'hoodie';

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '460px',
        aspectRatio: '1 / 1.05',
        backgroundColor: '#121216',
        border: '1px solid var(--border-subtle)',
        borderRadius: '2px',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: 'var(--shadow-subtle)'
      }}
    >
      {/* Background Studio Lighting & Grid */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at 50% 30%, rgba(255,255,255,0.04) 0%, rgba(0,0,0,0.6) 80%)',
          pointerEvents: 'none'
        }}
      />

      <svg
        viewBox="0 0 400 400"
        style={{ width: '92%', height: '92%', filter: 'drop-shadow(0 15px 25px rgba(0,0,0,0.7))' }}
      >
        {/* Garment Base Silhouette */}
        <g id="garment-base">
          {/* Garment Body */}
          <path
            d={isHoodie ? hoodieFrontPath : teeFrontPath}
            fill={garmentColor}
            stroke="rgba(255, 255, 255, 0.12)"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />

          {/* Hoodie Hood shape */}
          {isHoodie && (
            <path
              d={hoodShapePath}
              fill={garmentColor}
              stroke="rgba(255, 255, 255, 0.15)"
              strokeWidth="1.5"
              filter="brightness(0.92)"
            />
          )}

          {/* Collar Details */}
          {!isHoodie && (
            <path
              d={viewSide === 'front' ? teeCollarPath : teeBackCollarPath}
              fill="rgba(0,0,0,0.25)"
              stroke="rgba(255,255,255,0.15)"
              strokeWidth="1.2"
            />
          )}

          {/* Hoodie Front Pouch Pocket */}
          {isHoodie && viewSide === 'front' && (
            <path
              d={hoodiePouchPath}
              fill="none"
              stroke="rgba(255, 255, 255, 0.18)"
              strokeWidth="1.5"
              strokeDasharray="3,3"
            />
          )}

          {/* Sleeve drop seams */}
          <path d="M 130 120 L 160 50" stroke="rgba(0,0,0,0.3)" strokeWidth="1.2" />
          <path d="M 270 120 L 240 50" stroke="rgba(0,0,0,0.3)" strokeWidth="1.2" />
        </g>

        {/* Printable Safe Area Bounding Box */}
        <g id="printable-canvas-bounds">
          <rect
            x="145"
            y={viewSide === 'front' ? (isHoodie ? '110' : '100') : '85'}
            width="110"
            height={viewSide === 'front' ? (isHoodie ? '150' : '180') : '210'}
            fill="none"
            stroke="rgba(197, 160, 89, 0.35)"
            strokeWidth="1"
            strokeDasharray="4,4"
          />
          <text
            x="200"
            y={viewSide === 'front' ? (isHoodie ? '104' : '94') : '79'}
            textAnchor="middle"
            fill="rgba(197, 160, 89, 0.5)"
            fontSize="8"
            letterSpacing="1"
            fontFamily="sans-serif"
          >
            PRINT ZONE ({viewSide.toUpperCase()})
          </text>
        </g>

        {/* Custom Artwork Graphic */}
        {artworkUrl && (
          <g
            transform={`translate(${200 + artworkTransform.x}, ${
              (viewSide === 'front' ? 190 : 180) + artworkTransform.y
            }) rotate(${artworkTransform.rotation}) scale(${artworkTransform.scale})`}
          >
            <image
              href={artworkUrl}
              x="-45"
              y="-45"
              width="90"
              height="90"
              preserveAspectRatio="xMidYMid meet"
              style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }}
            />
          </g>
        )}

        {/* Custom Typography */}
        {customText && (
          <text
            x="200"
            y={viewSide === 'front' ? (artworkUrl ? '245' : '185') : (artworkUrl ? '240' : '170')}
            textAnchor="middle"
            fill={textColor}
            fontFamily={fontFamily}
            fontSize="18"
            fontWeight="700"
            letterSpacing="2"
            style={{
              textTransform: 'uppercase',
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.6))',
              userSelect: 'none'
            }}
          >
            {customText}
          </text>
        )}
      </svg>

      {/* Garment Details Watermark */}
      <div
        style={{
          position: 'absolute',
          bottom: '0.75rem',
          left: '1rem',
          display: 'flex',
          flexDirection: 'column',
          fontSize: '0.65rem',
          color: 'var(--text-muted)',
          letterSpacing: '0.1em',
          textTransform: 'uppercase'
        }}
      >
        <span>{garmentType === 'oversized_tee' ? '240 GSM BOXY TEE' : '420 GSM HOODIE'}</span>
        <span style={{ color: 'var(--accent-gold)' }}>VIEW: {viewSide.toUpperCase()}</span>
      </div>
    </div>
  );
};
