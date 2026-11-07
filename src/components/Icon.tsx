import { ColorValue } from "react-native";
import Svg, { Circle, Line, Path, Rect } from "react-native-svg";

export type IconName =
  | "search"
  | "bookmark"
  | "bookmark-filled"
  | "pin"
  | "briefcase"
  | "bell"
  | "user"
  | "shield";

type Props = { name: IconName; size?: number; color?: ColorValue };

export default function Icon({ name, size = 20, color = "#1B1F23" }: Props) {
  const p = {
    stroke: color,
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    fill: "none",
  };
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      {name === "search" && (
        <>
          <Circle cx={11} cy={11} r={8} {...p} />
          <Line x1={21} y1={21} x2={16.65} y2={16.65} {...p} />
        </>
      )}
      {name === "bookmark" && (
        <Path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" {...p} />
      )}
      {name === "bookmark-filled" && (
        <Path
          d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"
          {...p}
          fill={color}
        />
      )}
      {name === "pin" && (
        <>
          <Path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" {...p} />
          <Circle cx={12} cy={10} r={3} {...p} />
        </>
      )}
      {name === "briefcase" && (
        <>
          <Rect x={2} y={7} width={20} height={14} rx={2} {...p} />
          <Path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" {...p} />
        </>
      )}
      {name === "bell" && (
        <>
          <Path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" {...p} />
          <Path d="M13.73 21a2 2 0 0 1-3.46 0" {...p} />
        </>
      )}
      {name === "user" && (
        <>
          <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" {...p} />
          <Circle cx={12} cy={7} r={4} {...p} />
        </>
      )}
      {name === "shield" && (
        <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" {...p} />
      )}
    </Svg>
  );
}
