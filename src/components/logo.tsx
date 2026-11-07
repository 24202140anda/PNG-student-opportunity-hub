import { Text, View } from "react-native";
import Svg, { Circle, Line, Path, Polygon, Rect } from "react-native-svg";
import { COLORS } from "../lib/constants";

type Props = { size?: number; showText?: boolean };

export default function Logo({ size = 96, showText = false }: Props) {
  return (
    <View style={{ alignItems: "center" }}>
      <Svg width={size} height={size} viewBox="0 0 1024 1024">
        <Rect width={1024} height={1024} rx={224} fill={COLORS.primary} />
        <Polygon points="512,230 872,392 512,554 152,392" fill="#FFFFFF" />
        <Path
          d="M296 500 L296 650 Q512 790 728 650 L728 500 L512 598 Z"
          fill="#DDF1E8"
        />
        <Line
          x1={842}
          y1={408}
          x2={842}
          y2={640}
          stroke="#F2B705"
          strokeWidth={22}
          strokeLinecap="round"
        />
        <Circle cx={842} cy={668} r={36} fill="#F2B705" />
        <Polygon
          points="440,716 584,716 584,886 512,828 440,886"
          fill="#F2B705"
        />
      </Svg>
      {showText && (
        <>
          <Text
            style={{
              fontSize: 22,
              fontWeight: "800",
              color: COLORS.text,
              marginTop: 10,
            }}
          >
            PNG Student Opportunity Hub
          </Text>
          <Text style={{ fontSize: 13, color: COLORS.muted, marginTop: 2 }}>
            Find. Save. Apply.
          </Text>
        </>
      )}
    </View>
  );
}
