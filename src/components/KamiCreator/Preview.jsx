import { useState } from 'react';
import styled from 'styled-components';
import { getKamiAssets } from './utils';

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

const getPreviewFontSize = (text) => {
  const base = 2.2;
  const min = 0.9;
  const len = text.length;
  if (len <= 12) return base;
  if (len >= 90) return min;
  const ratio = (len - 12) / (90 - 12);
  return clamp(base - ratio * (base - min), min, base);
};

const sanitizeText = (text) => text?.trim() ?? '';

export const KamiPreview = ({ indices, topText, bottomText }) => {
  // Client-side composition
  const ClientPreview = () => {
    const assets = getKamiAssets(indices);
    
    const renderPreviewText = (text, position) => {
      const clean = sanitizeText(text);
      if (!clean) return null;
      const size = getPreviewFontSize(clean);
      return position === 'top' ? (
        <TopText size={size}>{clean}</TopText>
      ) : (
        <BottomText size={size}>{clean}</BottomText>
      );
    };

    return (
      <LayerContainer>
        <Layer src={assets.bg} alt="bg" />
        <Layer src={assets.shadow} alt="shadow" />
        <Layer src={assets.body} alt="body" />
        {/* Render Base Head if it exists (for ASCII) */}
        {assets.headBase && <Layer src={assets.headBase} alt="headBase" />}
        <Layer src={assets.head} alt="head" />
        <Layer src={assets.hands} alt="hands" />

        {renderPreviewText(topText, 'top')}
        {renderPreviewText(bottomText, 'bottom')}
      </LayerContainer>
    );
  };

  return (
    <Container>
      <ClientPreview />
    </Container>
  );
};

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #000;
  overflow: hidden;
`;

const LayerContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const Layer = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  image-rendering: pixelated;
`;

const TextOverlay = styled.div`
  position: absolute;
  width: 100%;
  text-align: center;
  font-family: 'Press Start 2P', monospace;
  color: white;
  text-shadow: 2px 2px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;
  pointer-events: none;
  z-index: 5;
  font-size: ${({ size }) => size}vw;
  padding: 0 1.2vw;
  white-space: pre-wrap;
  word-break: break-word;
  line-height: 1.1;
`;

const TopText = styled(TextOverlay)`
  top: 5%;
`;

const BottomText = styled(TextOverlay)`
  bottom: 5%;
`;

