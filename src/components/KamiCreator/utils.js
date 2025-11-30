import {
  BG_MAP,
  BG_RAW_MAP,
  BODY_MAP,
  COLOR_ASCII_PATHS,
  COLOR_ASCII_RAW,
  COLOR_MAP,
  COLOR_PATHS,
  COLOR_RAW,
  FACE_MAP,
  FACE_RAW_MAP,
  HANDS_MAP,
  SHADOW_FILE_MAP,
  SHADOW_FOLDER_MAP,
} from './constants';

export const getKamiAssets = (indices) => {
  const { background, body, color, face, hand } = indices;

  const colorIdx = COLOR_MAP[color] ?? 0;

  // Background
  const bgFolder = BG_MAP[background] || 'default_green';
  const bgFile = BG_RAW_MAP[background] || 'default_green';
  const bgPath = `/parts/bg/bg_${bgFolder}/bg_${bgFile}_0000.png`;

  // Shadow
  const shadowFolder = SHADOW_FOLDER_MAP[colorIdx] || 'default_green';
  const shadowFile = SHADOW_FILE_MAP[colorIdx] || 'shadow_default_green';
  const shadowPath = `/parts/shadow/${shadowFolder}/bg_${shadowFile}_0000.png`;

  // Body
  const bodyFolder = BODY_MAP[body] || 'default';
  const colorFolder = COLOR_PATHS[colorIdx] || 'default_green';
  const colorFile = COLOR_RAW[colorIdx] || 'default_green';
  
  let bodyPath = '';
  if (bodyFolder === 'tank') {
    bodyPath = `/parts/body/body_tank/body_tank_0000.png`;
  } else {
    bodyPath = `/parts/body/body_${bodyFolder}/${colorFolder}/body_${bodyFolder}_${colorFile}_0000.png`;
  }

  // Hands
  const handsFolder = HANDS_MAP[hand] || 'default';
  let handsPath = '';
  if (handsFolder === 'fairy_wings' || handsFolder === 'gun' || handsFolder === 'van_de_graaf_generator' || handsFolder === 'wings') {
    // These hands don't have color variants
    handsPath = `/parts/hands/hands_${handsFolder}/hands_${handsFolder}_0000.png`;
  } else {
    handsPath = `/parts/hands/hands_${handsFolder}/${colorFolder}/hands_${handsFolder}_${colorFile}_0000.png`;
  }

  // Head (Face)
  const headFolder = FACE_MAP[face] || 'ascii/1';
  const headFile = FACE_RAW_MAP[face] || 'ascii_1';

  let headPath = '';
  let headBase = '';

  // Determine if the head is an overlay that needs a base
  // This includes ASCII faces and "face_" prefixed folders (like Insectoid)
  const isOverlay = 
    headFolder.startsWith('ascii/') || 
    headFolder.startsWith('face_') || 
    face?.includes('Insectoid') ||
    face?.includes('N+B');

  if (isOverlay) {
    headBase = `/parts/head/head_default/${colorFolder}/head_default_${colorFile}_0000.png`;

    const asciiColorFolder = COLOR_ASCII_PATHS[colorIdx] || 'default';
    const asciiColorFile = COLOR_ASCII_RAW[colorIdx] || 'default';

    if (headFolder.startsWith('ascii/')) {
      if (asciiColorFolder === 'default') {
        if (headFile === 'ascii_3') {
             headPath = `/parts/head/${headFolder}/head_${headFile}_purple_0000.png`;
        } else {
             headPath = `/parts/head/${headFolder}/head_${headFile}_0000.png`;
        }
      } else {
        headPath = `/parts/head/${headFolder}/${asciiColorFolder}/head_${headFile}_${asciiColorFile}_0000.png`;
      }
    } else {
      if (headFolder === 'face_nuts_and_bolts' && !asciiColorFolder.startsWith('1_bit')) {
         headPath = `/parts/head/${headFolder}/head_${headFile}_0000.png`;
      } else {
         headPath = `/parts/head/${headFolder}/${colorFolder}/head_${headFile}_${colorFile}_0000.png`;
      }
    }
  } else {
    headPath = `/parts/head/${headFolder}/${colorFolder}/head_${headFile}_${colorFile}_0000.png`;
  }

  return {
    bg: bgPath,
    shadow: shadowPath,
    body: bodyPath,
    head: headPath,
    headBase: headBase || null,
    hands: handsPath,
  };
};
