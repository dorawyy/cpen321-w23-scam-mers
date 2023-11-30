// ChatGPT usage: NO
function createColor(R, G, B) {
    // Ensure that A, R, G, and B are within the 0-255 range
  
    // A = Math.min(255, Math.max(0, A));
    R = Math.min(255, Math.max(0, R));
    G = Math.min(255, Math.max(0, G));
    B = Math.min(255, Math.max(0, B));
  
    // Create the color in the specified format
    const color = (255 & 0xff) << 24 | (R & 0xff) << 16 | (G & 0xff) << 8 | (B & 0xff); // Always set Opacity to 255
    return color;
  }
  
  const availableColors = []
  availableColors.push(createColor(0x7f,0x06,0x38)); //maroon
  availableColors.push(createColor(0x5e,0x4f,0xa2)); //purple
  availableColors.push(createColor(0x5c,0xb3,0x98)); //teal
  availableColors.push(createColor(0x3f,0x3f,0x3f)); //gray
  availableColors.push(createColor(0xf5,0xf2,0x47)); //yellow
  availableColors.push(createColor(0xf2,0x63,0x13)); //orange
  availableColors.push(createColor(0xe9,0x52,0xeb)); //pink
  availableColors.push(createColor(0x78,0xfa,0x66)); //green
  availableColors.push(createColor(0x32,0x88,0xbd)); //blue
  availableColors.push(createColor(0xdd,0x0e,0x26)); //red

export default availableColors;