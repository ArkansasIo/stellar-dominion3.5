
import * as fs from 'node:fs';

type Category = {
  name: string;
  subCategories: string[];
};

type Research = {
  id: string;
  name: string;
  description: string;
  category: string;
  subCategory: string;
  class: string;
  subClass: string;
  type: string;
  subType: string;
};

const categories: Category[] = [
  { name: 'Physics', subCategories: [] },
  { name: 'Chemistry', subCategories: [] },
  { name: 'Biology', subCategories: [] },
  { name: 'Computer Science', subCategories: [] },
  { name: 'Engineering', subCategories: [] },
  { name: 'Mathematics', subCategories: [] },
  { name: 'Medicine', subCategories: [] },
  { name: 'Astronomy', subCategories: [] },
  { name: 'Geology', subCategories: [] },
  { name: 'Psychology', subCategories: [] },
  { name: 'Sociology', subCategories: [] },
  { name: 'Economics', subCategories: [] },
  { name: 'Political Science', subCategories: [] },
  { name: 'History', subCategories: [] },
  { name: 'Art', subCategories: [] },
  { name: 'Music', subCategories: [] },
  { name: 'Literature', subCategories: [] },
  { name: 'Philosophy', subCategories: [] },
  { name: 'Religion', subCategories: [] },
  { name: 'Mythology', subCategories: [] },
  { name: 'Linguistics', subCategories: [] },
  { name: 'Anthropology', subCategories: [] },
  { name: 'Archaeology', subCategories: [] },
  { name: 'Law', subCategories: [] },
  { name: 'Education', subCategories: [] },
  { name: 'Agriculture', subCategories: [] },
  { name: 'Environmental Science', subCategories: [] },
  { name: 'Materials Science', subCategories: [] },
  { name: 'Robotics', subCategories: [] },
  { name: 'Artificial Intelligence', subCategories: [] },
  { name: 'Genetics', subCategories: [] },
  { name: 'Quantum Mechanics', subCategories: [] },
  { name: 'Astrophysics', subCategories: [] },
  { name: 'Cosmology', subCategories: [] },
  { name: 'Nanoscience', subCategories: [] },
  { name: 'Biotechnology', subCategories: [] },
  { name: 'Neuroscience', subCategories: [] },
  { name: 'Cognitive Science', subCategories: [] },
  { name: 'Data Science', subCategories: [] },
  { name: 'Information Theory', subCategories: [] },
  { name: 'Game Theory', subCategories: [] },
  { name: 'Cybernetics', subCategories: [] }
];

const researches: Research[] = [];

for (let i = 0; i < 900; i++) {
  const category = categories[Math.floor(Math.random() * categories.length)];
  researches.push({
    id: `research-${i}`,
    name: `Research ${i}`,
    description: `This is the description for research ${i}`,
    category: category.name,
    subCategory: `SubCategory ${i}`,
    class: `Class ${i}`,
    subClass: `SubClass ${i}`,
    type: `Type ${i}`,
    subType: `SubType ${i}`
  });
}

const content = `
import { Research } from './research';

export const researches: Research[] = ${JSON.stringify(researches, null, 2)};
`;

fs.writeFileSync('researches.ts', content);
