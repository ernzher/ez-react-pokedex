import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'

interface State {
    loading: boolean,
    pokemons: {
        id: number,
        name: string,
        height: {
            m: number,
            foot: string
        }, 
        weight: {
            kg: number,
            lbs: number
        }, 
        img: string,
        types: string[],
        abilities: string[],
        stats: {
            stat_name: string,
            base_stat: number
        }[]
    }[],
    pokemonSpecies: {
        species_name: string,
        egg_groups: string[],
        habitat: string,
        growth_rate: string,
        description: string
    }
    hasMore: boolean,
    query: string,
}

export interface Pokemon {
    id: number,
    name: string,
    height: {
        m: number,
        foot: string
    }, 
    weight: {
        kg: number,
        lbs: number
    }, 
    img: string,
    types: string[],
    abilities: string[],
    stats: {
        stat_name: string,
        base_stat: number
    }[]
    species_name: string,
    egg_groups: string[],
    habitat: string,
    growth_rate: string,
    description: string
}

const usePokemons = (offset?: number, pageNumber?: number) => {

    const [loading, setLoading] = useState<State["loading"]>(false)
    const [pokemons, setPokemons] = useState<State["pokemons"]>([])
    const [hasMore, setHasMore] = useState<State["hasMore"]>(true)
    const [query, setQuery] = useState<State["query"]>("")

    const convertToPounds = (kg: number): number => Math.round(kg * 2.205)

    const convertToFoot = ( meters: number ) : string => {
        let foot = meters * 3.28084
        let footStr = Math.ceil(foot * 10).toString()       
        switch(footStr.length) {
            case 2: return `${footStr.charAt(0)} ' ${footStr.charAt(1)}''`; 
            case 3: return `${footStr.substring(0,2)} ' ${footStr.charAt(2)}''`; 
            default: return `${footStr.substring(0,3)} ' ${footStr.charAt(3)}''`; 
        }
    }

    const toCapitalCase = ( text: string ): string => text.charAt(0).toUpperCase() + (text.length > 1 && text.slice(1))

    const processString = (text: string): string => text.replace(/\f|\n/g,' ')

    const fetchPokemons = async () => {
        try {
            const { data } = await axios.get(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=20`);  
            return data
        } catch (error) {
            return null
        }
    }

    const fetchPokemonsFromQuery = async (query: string) => {
        try {
            const { data } = await axios.get(`/pokemons/search?name=${query}&page=${pageNumber}&pageSize=20`);  
            return data
        } catch (error) {
            return null
        }
    }

    const getPokemonData = async(idOrName: any) => {
        const { data } = await axios.get(`https://pokeapi.co/api/v2/pokemon/${idOrName}`);   
        return {
            id: data.id,
            name: toCapitalCase(data.name),
            height: {
                m: data.height/10,
                foot: convertToFoot(data.height/10)
            } ,
            weight: {
                kg: data.weight/10,
                lbs: convertToPounds(data.weight/10)
            },
            img: data.sprites.other.dream_world.front_default,
            types: data.types.map((type: any) => type.type.name),
            abilities: data.abilities.map((ability: any) => toCapitalCase(ability.ability.name)),
            stats: data.stats.map((stat: any) => {
                return {
                    stat_name: stat.stat.name, 
                    base_stat: stat.base_stat
                } 
            })
        } 
    }

    const getPokemonDetailData = async (idOrName: any) => {
        const pokemonData = await getPokemonData(idOrName);
        const { data } = await axios.get(`https://pokeapi.co/api/v2/pokemon-species/${idOrName}`);   
        return {
            ...pokemonData,
            species_name: data.genera.find((genus: any) => genus.language.name === "en").genus,
            egg_groups: data.egg_groups.map((egg_group: any) => toCapitalCase(egg_group.name)),
            habitat: toCapitalCase(data.habitat.name),
            growth_rate: toCapitalCase(data.growth_rate.name),
            description: processString(data.flavor_text_entries.find((flavor_text_entry: any) => flavor_text_entry.language.name === "en").flavor_text)
        }  
    }

    const getPokemonList = async (query ?: string) => {
        let list: State["pokemons"] = []
        if (!query) {
            const data = await fetchPokemons();   
            data &&     
            data.results.forEach(async (result: any) => {
                const pokemonData = await getPokemonData(result.name);     
                pokemonData && list.push(pokemonData)
            })
        } else {
            const dataFromQuery = await fetchPokemonsFromQuery(query);     
            dataFromQuery &&
            dataFromQuery.pokemons.forEach(async (pokemon: any) => {
                const pokemonDataFromQuery = await getPokemonData(pokemon.id);
                pokemonDataFromQuery && list.push(pokemonDataFromQuery)
            })
        }
        return list
    }
    
    const searchPokemon = (query: string) => {
        setQuery(query);
        setPokemons([])
        setHasMore(true)
        setLoading(true);

        const loadPokemonFromQuery = async() => {
            
            //if integer is passed as the query, search as pokemon id
            if (Number.isInteger(parseInt(query))) {
                const pokemonData = await getPokemonData(parseInt(query)) 
                setTimeout(() => {
                    pokemonData && setPokemons([pokemonData])
                    setHasMore(false)
                    setLoading(false)
                }, 1000)      
                return;
            } 
            //else search as pokemon name
            const pokemonList = await getPokemonList(query)            
            setTimeout(()=>{
                pokemonList.sort((a, b) => a.id - b.id)
                setPokemons(pokemonList)
                if (pokemonList.length < 20) setHasMore(false)
                setLoading(false)
            }, 1000)
        }      
        loadPokemonFromQuery();
    }   
     
    useEffect(() => {
        setHasMore(true)
        setLoading(true);
        const loadMorePokemon = async() => {
            const pokemonList = await (query ? getPokemonList(query) : getPokemonList())
            setTimeout(()=>{
                pokemonList.sort((a, b) => a.id - b.id)
                setPokemons([...pokemons,...pokemonList])
                if (pokemonList.length < 20) setHasMore(false)
                setLoading(false)
            }, 1000)
        }      
        loadMorePokemon();
        
    },[offset, pageNumber])

    return {loading, pokemons, hasMore, query, searchPokemon, getPokemonData, getPokemonDetailData}
}

export default usePokemons