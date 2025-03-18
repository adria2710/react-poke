import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [search, setSearch] = useState("");
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const handleChange = (e) => {
    setSearch(e.target.value.trim().toLowerCase());
  };
  useEffect(() => {
    if (search.length < 2) {
      setPokemon(null);
      setError("");
      return;
    }
    setLoading(true);
    setError("");
    fetch(`https://pokeapi.co/api/v2/pokemon/${search}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Pokémon no encontrado");
        }
        return res.json();
      })
      .then((data) => {
        setPokemon({
          name: data.name,
          image: data.sprites.front_default,
          id: data.id,
          type: data.types.map((t) => t.type.name).join(", "),
          weight: data.weight / 10, 
          height: data.height / 10, 
        });
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setPokemon(null);
        setLoading(false);
      });
  }, [search]);

  return (
    <div className="App">
      <h1>Buscador de Pokémon</h1>
      <input
        type="text"
        placeholder="Escribe el nombre de un Pokémon..."
        value={search}
        onChange={handleChange}
      />

      {loading && <p>Cargando...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {pokemon && (
        <div className="pokemon-card">
          <h2>
            {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)} (#{pokemon.id})
          </h2>
          <img src={pokemon.image} alt={pokemon.name} />
          <p><strong>Tipo:</strong> {pokemon.type}</p>
          <p><strong>Peso:</strong> {pokemon.weight} kg</p>
          <p><strong>Altura:</strong> {pokemon.height} m</p>
        </div>
      )}
    </div>
  );
}

export default App;