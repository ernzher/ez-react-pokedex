import React from "react";
import { Box, Text } from "@chakra-ui/react";

type TypeBadgeProps = {
  type: string;
};

const TypeBadge = ({ type }: TypeBadgeProps) => {
  const font_color = (type: string): string => {
    switch (type) {
      case "grass":
      case "psychic":
      case "electric":
      case "fire":
      case "ice":
      case "flying":
      case "fairy":
      case "steel":
        return "black";
      default:
        return "white";
    }
  };
  return (
    <Box
      px={1}
      w={[14, 16, 20]}
      bgColor={`type.${type}`}
      textAlign="center"
      borderRadius={5}
      fontFamily="Roboto Mono"
    >
      <Text color={font_color(type)} fontSize={["x-small", "xs"]}>
        {type}
      </Text>
    </Box>
  );
};

export default TypeBadge;
