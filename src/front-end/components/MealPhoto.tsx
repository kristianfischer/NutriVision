import React, { useMemo } from "react";
import { Image } from "expo-image";
import { StyleSheet, View, ImageSourcePropType } from "react-native";

export type MealPhotoType = {
  layer2?: ImageSourcePropType;

  /** Style props */
  hotpotPosition?: string;
  hotpotWidth?: number | string;
  hotpotHeight?: number | string;
  hotpotTop?: number | string;
  hotpotLeft?: number | string;
  layer2IconHeight?: number | string;
  layer2IconWidth?: number | string;
  layer2IconTop?: number | string;
  layer2IconRight?: number | string;
  layer2IconBottom?: number | string;
  layer2IconLeft?: number | string;
  frameViewTop?: number | string;
  frameViewRight?: number | string;
  frameViewBottom?: number | string;
  frameViewLeft?: number | string;
};

const getStyleValue = (key: string, value: string | number | undefined) => {
  if (value === undefined) return;
  return { [key]: value === "unset" ? undefined : value };
};
const MealPhoto = ({ // props for UI design
  layer2,
  hotpotPosition,
  hotpotWidth,
  hotpotHeight,
  hotpotTop,
  hotpotLeft,
  layer2IconHeight,
  layer2IconWidth,
  layer2IconTop,
  layer2IconRight,
  layer2IconBottom,
  layer2IconLeft,
  frameViewTop,
  frameViewRight,
  frameViewBottom,
  frameViewLeft,
}: MealPhotoType) => {
  const hotpotStyle = useMemo(() => {
    return {
      ...getStyleValue("position", hotpotPosition),
      ...getStyleValue("width", hotpotWidth),
      ...getStyleValue("height", hotpotHeight),
      ...getStyleValue("top", hotpotTop),
      ...getStyleValue("left", hotpotLeft),
    };
  }, [hotpotPosition, hotpotWidth, hotpotHeight, hotpotTop, hotpotLeft]);

  const layer2IconStyle = useMemo(() => {
    return {
      ...getStyleValue("height", layer2IconHeight),
      ...getStyleValue("width", layer2IconWidth),
      ...getStyleValue("top", layer2IconTop),
      ...getStyleValue("right", layer2IconRight),
      ...getStyleValue("bottom", layer2IconBottom),
      ...getStyleValue("left", layer2IconLeft),
    };
  }, [
    layer2IconHeight,
    layer2IconWidth,
    layer2IconTop,
    layer2IconRight,
    layer2IconBottom,
    layer2IconLeft,
  ]);

  const frameViewStyle = useMemo(() => {
    return {
      ...getStyleValue("top", frameViewTop),
      ...getStyleValue("right", frameViewRight),
      ...getStyleValue("bottom", frameViewBottom),
      ...getStyleValue("left", frameViewLeft),
    };
  }, [frameViewTop, frameViewRight, frameViewBottom, frameViewLeft]);

  return ( // returns photo or image from database
    <View style={[styles.hotpot, hotpotStyle]}>
      <Image
        style={[styles.layer2Icon, styles.layer2IconPosition, layer2IconStyle]}
        contentFit="cover"
        source={layer2}
      />
      <View
        style={[styles.hotpotChild, styles.layer2IconPosition, frameViewStyle]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  layer2IconPosition: {
    position: "absolute",
    overflow: "hidden",
  },
  layer2Icon: {
    height: "51.67%",
    width: "78.33%",
    top: "24.44%",
    right: "10.56%",
    bottom: "23.89%",
    left: "11.11%",
    maxWidth: "100%",
    maxHeight: "100%",
  },
  hotpotChild: {
    height: "100%",
    width: "100%",
    top: "98.33%",
    right: "-10.56%",
    bottom: "-98.33%",
    left: "10.56%",
  },
  hotpot: {
    width: 180,
    height: 180,
    overflow: "hidden",
  },
});

export default MealPhoto;
