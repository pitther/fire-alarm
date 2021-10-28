const componentToHex = (c) => {
    let hex = c.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
}

const rgbToHex = (r, g, b) => {
    return '0x' + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

const pickRGB = (color1, color2, weight) => {
    const w1 = weight;
    const w2 = 1 - w1;
    return [Math.round(color1[0] * w1 + color2[0] * w2),
        Math.round(color1[1] * w1 + color2[1] * w2),
        Math.round(color1[2] * w1 + color2[2] * w2)];
}

export {pickRGB,rgbToHex}