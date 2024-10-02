import { food, drinks, refrigerator, diverse } from "./recipes";

const categories = [
  {
    id: 1,
    title: "Comida",
    recipes: food,
  },
  {
    id: 2,
    title: "Bebidas",
    recipes: drinks,
  },
  {
    id: 3,
    title: "Geladeira",
    recipes: refrigerator,
  },
  {
    id: 4,
    title: "Loja",
    recipes: diverse,
  },
];

export default categories;