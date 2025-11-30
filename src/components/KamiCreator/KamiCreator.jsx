import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { KamiPreview } from './Preview';
import { getKamiAssets } from './utils';
import {
  BG_MAP,
  BODY_MAP,
  COLOR_MAP,
  FACE_MAP,
  HANDS_MAP,
} from './constants';

const bodies = Object.keys(BODY_MAP).sort();
const faces = Object.keys(FACE_MAP).sort();
const hands = Object.keys(HANDS_MAP).sort();
const colors = Object.keys(COLOR_MAP).sort();
const backgrounds = Object.keys(BG_MAP).sort();

export const KamiCreator = ({ onClose }) => {
  const [selectedBody, setSelectedBody] = useState(bodies[0]);
  const [selectedFace, setSelectedFace] = useState(faces[0]);
  const [selectedHand, setSelectedHand] = useState(hands[0]);
  const [selectedColor, setSelectedColor] = useState(colors[0]);
  const [selectedBackground, setSelectedBackground] = useState(backgrounds[0]);

  const [topText, setTopText] = useState('');
  const [bottomText, setBottomText] = useState('');

  const indices = {
    background: selectedBackground,
    body: selectedBody,
    color: selectedColor,
    face: selectedFace,
    hand: selectedHand,
  };

  const randomize = () => {
    const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];
    setSelectedBody(randomItem(bodies));
    setSelectedFace(randomItem(faces));
    setSelectedHand(randomItem(hands));
    setSelectedColor(randomItem(colors));
    setSelectedBackground(randomItem(backgrounds));
  };

  const exportImage = async () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1000; // High resolution
    canvas.height = 1000;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Disable smoothing for pixel art
    ctx.imageSmoothingEnabled = false;

    const assets = getKamiAssets(indices);
    const layers = [
      assets.bg,
      assets.shadow,
      assets.body,
      assets.headBase,
      assets.head,
      assets.hands,
    ].filter(Boolean);

    const loadImage = (src) =>
      new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.onload = () => resolve(img);
        img.onerror = () => {
          console.warn(`Failed to load image: ${src}`);
          resolve(null);
        };
        img.src = src;
      });

    try {
      // Draw layers in order
      for (const src of layers) {
        const img = await loadImage(src);
        if (img) {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        }
      }

      const drawCanvasText = (text, position) => {
        const clean = text?.trim();
        if (!clean) return;

        const fontSize = getCanvasFontSize(clean);
        const lineHeight = fontSize * 1.1;
        const maxWidth = canvas.width - 120;

        ctx.font = `${fontSize}px "Press Start 2P", monospace`;
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.lineWidth = Math.max(4, fontSize * 0.15);
        ctx.strokeStyle = 'black';
        ctx.lineJoin = 'round';
        ctx.textBaseline = 'middle';

        const lines = wrapText(ctx, clean, maxWidth);
        if (!lines.length) return;

        const centerX = canvas.width / 2;
        if (position === 'top') {
          let y = 80;
          lines.forEach((line) => {
            ctx.strokeText(line, centerX, y);
            ctx.fillText(line, centerX, y);
            y += lineHeight;
          });
        } else {
          const totalHeight = lineHeight * lines.length;
          let y = canvas.height - 80 - totalHeight + lineHeight / 2;
          lines.forEach((line) => {
            ctx.strokeText(line, centerX, y);
            ctx.fillText(line, centerX, y);
            y += lineHeight;
          });
        }
      };

      drawCanvasText(topText, 'top');
      drawCanvasText(bottomText, 'bottom');

      // Download
      const link = document.createElement('a');
      link.download = 'kamigotchi.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (e) {
      console.error('Failed to export image', e);
    }
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>&times;</CloseButton>
        <Header>Kami Creator</Header>
        
          <Container>
            <PreviewColumn>
              <PreviewWrapper>
                <PreviewBox>
                  <KamiPreview indices={indices} topText={topText} bottomText={bottomText} />
                </PreviewBox>
                <TextInput
                  placeholder='Top Text'
                  value={topText}
                  onChange={(e) => setTopText(e.target.value)}
                />
                <TextInput
                  placeholder='Bottom Text'
                  value={bottomText}
                  onChange={(e) => setBottomText(e.target.value)}
                />
                <ExportButton onClick={exportImage}>Export PNG</ExportButton>
              </PreviewWrapper>
            </PreviewColumn>

            <ControlsColumn>
            <Section>
              <Label>Background</Label>
              <Select
                value={selectedBackground}
                onChange={(e) => setSelectedBackground(e.target.value)}
              >
                {backgrounds.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </Select>
            </Section>
            <Section>
              <Label>Body</Label>
              <Select
                value={selectedBody}
                onChange={(e) => setSelectedBody(e.target.value)}
              >
                {bodies.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </Select>
            </Section>
            <Section>
              <Label>Color</Label>
              <Select
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
              >
                {colors.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </Select>
            </Section>
            <Section>
              <Label>Head</Label>
              <Select
                value={selectedFace}
                onChange={(e) => setSelectedFace(e.target.value)}
              >
                {faces.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </Select>
            </Section>
            <Section>
              <Label>Hand</Label>
              <Select
                value={selectedHand}
                onChange={(e) => setSelectedHand(e.target.value)}
              >
                {hands.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </Select>
            </Section>
            <RandomButton onClick={randomize}>Randomize</RandomButton>
          </ControlsColumn>
        </Container>
      </ModalContent>
    </ModalOverlay>
  );
};

const getCanvasFontSize = (text) => {
  const base = 80;
  const min = 34;
  const len = text.length;
  if (len <= 20) return base;
  if (len >= 90) return min;
  const ratio = (len - 20) / (90 - 20);
  return base - ratio * (base - min);
};

const wrapText = (ctx, text, maxWidth) => {
  const lines = [];
  const paragraphs = text.split(/\n/);

  paragraphs.forEach((paragraph) => {
    const words = paragraph.split(/\s+/);
    let currentLine = '';
    words.forEach((word) => {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      if (ctx.measureText(testLine).width > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    });
    if (currentLine) lines.push(currentLine);
  });

  return lines.length ? lines : [text];
};

// Modal Styles
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
`;

const ModalContent = styled.div`
  background: #fff;
  width: 90vw;
  height: 90vh;
  max-width: 800px;
  border: 4px solid #000;
  border-radius: 10px;
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 8px 8px 0 rgba(0,0,0,0.5);
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 15px;
  background: none;
  border: none;
  font-size: 30px;
  cursor: pointer;
  z-index: 10;
  line-height: 1;
  
  &:hover {
    color: red;
  }
`;

const Header = styled.div`
  padding: 15px;
  background: #ffcc00;
  border-bottom: 3px solid #000;
  font-family: 'Press Start 2P', monospace;
  font-size: 20px;
  text-align: center;
  text-transform: uppercase;
`;

const Container = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;
  padding: 20px;
  gap: 20px;
  overflow: hidden;
  justify-content: center;
  @media (max-width: 768px) {
    flex-direction: column;
    overflow-y: auto;
  }
`;

const PreviewColumn = styled.div`
  flex: 1.2;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 0;
  overflow-y: auto;
`;

const PreviewWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  max-width: 440px;
  height: 100%;
  
  @media (max-height: 800px) {
    max-width: 300px;
  }
`;

const PreviewBox = styled.div`
  border: 3px solid black;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #000;
  overflow: hidden;
  position: relative;
  width: 100%;
  aspect-ratio: 1;
`;

const ControlsColumn = styled.div`
  flex: 0.8;
  display: flex;
  flex-direction: column;
  gap: 15px;
  overflow-y: auto;
  padding-right: 5px;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-family: 'Press Start 2P', monospace;
  font-size: 12px;
  color: #333;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const Select = styled.select`
  padding: 10px;
  font-family: 'Press Start 2P', monospace;
  font-size: 10px;
  border: 3px solid black;
  border-radius: 5px;
  background: white;
  outline: none;
  cursor: pointer;
  box-shadow: 3px 3px 0 rgba(0,0,0,0.2);

  &:hover {
    background: #f9f9f9;
    transform: translate(-1px, -1px);
    box-shadow: 4px 4px 0 rgba(0,0,0,0.2);
  }
  &:active {
    transform: translate(2px, 2px);
    box-shadow: 1px 1px 0 rgba(0,0,0,0.2);
  }
`;

const RandomButton = styled.button`
  margin-top: auto;
  padding: 12px;
  font-family: 'Press Start 2P', monospace;
  font-size: 12px;
  background: #ffcc00;
  border: 3px solid black;
  border-radius: 5px;
  cursor: pointer;
  box-shadow: 3px 3px 0 rgba(0,0,0,0.2);
  text-transform: uppercase;
  font-weight: bold;
  
  &:hover {
    background: #ffe066;
    transform: translate(-1px, -1px);
    box-shadow: 4px 4px 0 rgba(0,0,0,0.2);
  }
  
  &:active {
    transform: translate(2px, 2px);
    box-shadow: 1px 1px 0 rgba(0,0,0,0.2);
  }
`;

const ExportButton = styled(RandomButton)`
  margin-top: auto;
  background: #66ccff;
  width: 100%;
  &:hover {
    background: #99ddff;
  }
`;

const TextInput = styled.input`
  padding: 8px;
  font-family: 'Press Start 2P', monospace;
  font-size: 10px;
  border: 3px solid black;
  border-radius: 5px;
  outline: none;
  box-shadow: inset 2px 2px 0 rgba(0,0,0,0.1);
  width: 100%;
  
  &:focus {
    background: #fffbe6;
  }
`;
