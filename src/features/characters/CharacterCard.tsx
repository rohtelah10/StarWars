// src/features/characters/CharacterCard.tsx
import React from "react";
import type { Character } from "./characterSlice";

interface CharacterCardProps {
  character: Character;
  onClick: () => void;
}

// 🎨 Species-based accent colors
const speciesColors = [
  "bg-blue-500",
  "bg-green-500",
  "bg-purple-500",
  "bg-orange-500",
  "bg-pink-500",
  "bg-yellow-500",
];

const getRandomColor = () =>
  speciesColors[Math.floor(Math.random() * speciesColors.length)];

const CharacterCard: React.FC<CharacterCardProps> = ({ character, onClick }) => {
  const imageUrl = `https://picsum.photos/seed/${character.name}/300/200`;
  const colorClass = getRandomColor();

  return (
    <div
      className={`rounded-xl shadow-md overflow-hidden hover:scale-105 transition-transform cursor-pointer ${colorClass}`}
      onClick={onClick}
    >
      <img src={imageUrl} alt={character.name} className="w-full h-40 object-cover" />
      <div className="p-4 text-white">
        <h3 className="text-lg font-bold">{character.name}</h3>
        <p className="text-sm opacity-90">
          Birth Year: {character.birth_year || "Unknown"}
        </p>
      </div>
    </div>
  );
};

export default CharacterCard;
