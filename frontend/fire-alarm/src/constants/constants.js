import { DashboardFilled, FireOutlined, FormatPainterFilled, SoundFilled } from '@ant-design/icons';

const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 400;

const CANVAS_GRADIENT_COLOR_1 = [0, 255, 0];
const CANVAS_GRADIENT_COLOR_2 = [255, 0, 0];

const SUCCESSFUL_COLOR = '#87d068';
const UNSUCCESSFUL_COLOR = '#f50';

const LOADING_ICON = <FireOutlined style={{ fontSize: 40, color: 'red' }} spin />;
const FIRE_ICON = <FireOutlined style={{ fontSize: 15 }} />;
const NOISE_ICON = <DashboardFilled style={{ fontSize: 15 }} />;
const CANVAS_ICON = <FormatPainterFilled style={{ fontSize: 15 }} />;
const ALARM_ICON = <SoundFilled style={{ fontSize: 15 }} />;

export {
  SUCCESSFUL_COLOR,
  UNSUCCESSFUL_COLOR,
  CANVAS_GRADIENT_COLOR_2,
  CANVAS_GRADIENT_COLOR_1,
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  LOADING_ICON,
  FIRE_ICON,
  NOISE_ICON,
  CANVAS_ICON,
  ALARM_ICON
};