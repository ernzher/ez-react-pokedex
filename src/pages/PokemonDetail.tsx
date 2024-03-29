import React from "react";
import { useState, useEffect } from "react";
import { Link as ReactRouterLink, useParams } from "react-router-dom";
import usePokemons from "../hooks/usePokemons";
import {
  Box,
  Flex,
  Text,
  HStack,
  Image,
  VStack,
  Button,
  Link,
  useColorModeValue,
} from "@chakra-ui/react";
import About from "../components/details/About";
import Stats from "../components/details/Stats";
import Moves from "../components/details/Moves";
import TypeBadge from "../components/common/TypeBadge";
import { Helmet } from "react-helmet-async";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import Evolutions from "../components/details/Evolutions";
import { renderGender } from "../utils/helper";
import { getPokemonDetailData } from "../api/fetch";
import { useRecoilState } from "recoil";
import {
  activeCategoryState,
  pokemonDetailsState,
} from "../atoms/pokemonDetails";

const PokemonDetail = () => {
  const containerBgColor = useColorModeValue(
    "whiteAlpha.600",
    "blackAlpha.600"
  );
  const activeCategoryColor = useColorModeValue("black", "white");
  const inactiveCategoryColor = useColorModeValue(
    "blackAlpha.500",
    "whiteAlpha.500"
  );
  const convtainerBoxShadow = useColorModeValue("dark-lg", "none");

  const { id } = useParams();
  const [pokemon, setPokemon] = useRecoilState(pokemonDetailsState);
  const [activeCategory, setActiveCategory] =
    useRecoilState(activeCategoryState);

  useEffect(() => {
    const getPokemon = async () => {
      const data = await getPokemonDetailData(id);
      data && setPokemon(data);
    };
    getPokemon();
  }, [id]);

  const renderCategory = (category: string) => {
    switch (category) {
      case "about":
        return <About />;
      case "stats":
        return <Stats />;
      case "moves":
        return <Moves />;
      case "evolutions":
        return <Evolutions />;
    }
  };

  return (
    <Box>
      <Helmet>
        <meta charSet="utf-8" />
        <title>{`${pokemon && pokemon.name} | Pokédex`} </title>
      </Helmet>
      {pokemon && (
        <Box
          fontFamily="Roboto Mono"
          bgGradient={`linear(to-b, transparent, type.${pokemon.types[0]}, transparent )`}
          position="relative"
          h="70%"
        >
          <Flex
            p={{ base: 5, md: 10 }}
            justifyContent="space-between"
            alignItems="center"
          >
            <VStack align="left">
              <Flex alignItems="center" fontSize={{ base: "2xl", md: "4xl" }}>
                <Text fontWeight={1000} pr={1}>
                  {pokemon.name.replace(/-f|-m/g, "")}{" "}
                </Text>
                {renderGender(pokemon.gender)}
              </Flex>
              <HStack spacing={3}>
                {pokemon.types.map((type, index) => (
                  <TypeBadge type={type} key={index} />
                ))}
              </HStack>
            </VStack>
            <Text fontSize={{ base: "lg", md: "xl" }}>
              #{" "}
              {pokemon.id.toLocaleString("en-US", { minimumIntegerDigits: 3 })}
            </Text>
          </Flex>
          <Box
            left="50%"
            top={{ base: 32, md: 16 }}
            transform="translateX(-50%)"
            position="absolute"
            zIndex={20}
          >
            <Image src={pokemon.img} h={[150, 170, 200]} />
          </Box>
          <Box h={{ base: 110, md: 38 }}></Box>
          <Box
            borderTopRadius={30}
            bgColor={containerBgColor}
            minH="90vh"
            pt={20}
            position="relative"
            boxShadow={convtainerBoxShadow}
          >
            {pokemon.prevAndNext.prev_id && (
              <Link
                position="absolute"
                top={0}
                left={0}
                py={8}
                px={5}
                as={ReactRouterLink}
                to={`/pokemon/${pokemon.prevAndNext.prev_id}`}
              >
                <ChevronLeftIcon
                  boxSize={{ base: 10, md: 14 }}
                  color={inactiveCategoryColor}
                  _hover={{
                    color: activeCategoryColor,
                    transform: "scale(1.2)",
                    transition: "all .5s",
                  }}
                />
              </Link>
            )}
            {pokemon.prevAndNext.next_id && (
              <Link
                position="absolute"
                top={0}
                right={0}
                py={8}
                px={5}
                as={ReactRouterLink}
                to={`/pokemon/${pokemon.prevAndNext.next_id}`}
              >
                <ChevronRightIcon
                  boxSize={{ base: 10, md: 14 }}
                  color={inactiveCategoryColor}
                  _hover={{
                    color: activeCategoryColor,
                    transform: "scale(1.2)",
                    transition: "all .5s",
                  }}
                />
              </Link>
            )}
            <Flex p={5} justifyContent="space-around" alignItems="center">
              <Button
                w={[20, 32, 40, 52]}
                fontSize={{ base: "sm", md: "lg" }}
                letterSpacing={1.1}
                color={
                  activeCategory === "about"
                    ? activeCategoryColor
                    : inactiveCategoryColor
                }
                variant={activeCategory === "about" ? "" : "unstyled"}
                fontWeight={activeCategory === "about" ? "bold" : ""}
                borderBottom={
                  activeCategory === "about"
                    ? `2px ${activeCategoryColor} solid`
                    : ""
                }
                onClick={() => setActiveCategory("about")}
                _hover={{ color: activeCategoryColor }}
              >
                About
              </Button>
              <Button
                w={[20, 32, 40, 52]}
                fontSize={{ base: "sm", md: "lg" }}
                letterSpacing={1.1}
                color={
                  activeCategory === "stats"
                    ? activeCategoryColor
                    : inactiveCategoryColor
                }
                variant={activeCategory === "stats" ? "" : "unstyled"}
                fontWeight={activeCategory === "stats" ? "bold" : ""}
                borderBottom={
                  activeCategory === "stats"
                    ? `2px ${activeCategoryColor} solid`
                    : ""
                }
                onClick={() => setActiveCategory("stats")}
                _hover={{ color: activeCategoryColor }}
              >
                Stats
              </Button>
              <Button
                w={[20, 32, 40, 52]}
                fontSize={{ base: "sm", md: "lg" }}
                letterSpacing={1.1}
                color={
                  activeCategory === "evolutions"
                    ? activeCategoryColor
                    : inactiveCategoryColor
                }
                variant={activeCategory === "evolutions" ? "" : "unstyled"}
                fontWeight={activeCategory === "evolutions" ? "bold" : ""}
                borderBottom={
                  activeCategory === "evolutions"
                    ? `2px ${activeCategoryColor} solid`
                    : ""
                }
                onClick={() => setActiveCategory("evolutions")}
                _hover={{ color: activeCategoryColor }}
              >
                Evolutions
              </Button>
              <Button
                w={[20, 32, 40, 52]}
                fontSize={{ base: "sm", md: "lg" }}
                letterSpacing={1.1}
                color={
                  activeCategory === "moves"
                    ? activeCategoryColor
                    : inactiveCategoryColor
                }
                variant={activeCategory === "moves" ? "" : "unstyled"}
                fontWeight={activeCategory === "moves" ? "bold" : ""}
                borderBottom={
                  activeCategory === "moves"
                    ? `2px ${activeCategoryColor} solid`
                    : ""
                }
                onClick={() => setActiveCategory("moves")}
                _hover={{ color: activeCategoryColor }}
              >
                Moves
              </Button>
            </Flex>
            <Box px={{ base: 5, md: 10 }} py={{ base: 0, md: 5 }}>
              {renderCategory(activeCategory)}
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default PokemonDetail;
