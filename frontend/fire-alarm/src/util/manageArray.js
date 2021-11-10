const distance = (p1, p2) => {
  let dx = p2.x - p1.x;
  dx *= dx;
  let dy = p2.y - p1.y;
  dy *= dy;
  return Math.sqrt(dx + dy);
};

const getPoints = (x, y, r) => {
  const ret = [];
  for (let j = x - r; j <= x + r; j++)
    for (let k = y - r; k <= y + r; k++)
      if (distance({ x: j, y: k }, { x: x, y: y }) <= r)
        ret.push({ x: j, y: k });
  return ret;
};

const getPointsRect = (x, y, r) => {
  const ret = [];
  r -= 1;
  const rx = Math.ceil(r / 2);
  const ry = r - rx;

  for (let j = x - rx; j <= x + ry; j++)
    for (let k = y - rx; k <= y + ry; k++) ret.push({ x: j, y: k });
  return ret;
};

export { getPoints, getPointsRect };
