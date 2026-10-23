import type { Question } from '../types';
import { questions as defaultAiQuestions } from '../data/questions';

const STORAGE_KEY = 'ar_quiz_custom_questions_v1';
const PACK_KEY = 'ar_quiz_active_pack_v1';

export const ENGLISH_GRAMMAR_PACK: Question[] = [
  {
    id: 1,
    category: 'English Grammar',
    difficulty: 'Beginner',
    question: 'You should ___________ some vitamins and get some rest.',
    options: {
      A: 'has',
      B: 'having',
      C: 'take',
      D: 'took',
    },
    correctAnswer: 'C',
    explanation: "After modal verbs like 'should', we use the base form of the verb ('take').",
  },
  {
    id: 2,
    category: 'English Grammar',
    difficulty: 'Beginner',
    question: 'She ___________ to school by bus every morning.',
    options: {
      A: 'goes',
      B: 'go',
      C: 'going',
      D: 'gone',
    },
    correctAnswer: 'A',
    explanation: "Third-person singular subjects ('she') take verbs ending in -s or -es in the simple present tense ('goes').",
  },
  {
    id: 3,
    category: 'English Grammar',
    difficulty: 'Intermediate',
    question: 'If it rains tomorrow, we ___________ the picnic in the park.',
    options: {
      A: 'cancelled',
      B: 'will cancel',
      C: 'cancelling',
      D: 'had cancelled',
    },
    correctAnswer: 'B',
    explanation: "In a first conditional sentence (real possibility), the main clause uses 'will' + base verb.",
  },
  {
    id: 4,
    category: 'English Grammar',
    difficulty: 'Intermediate',
    question: 'Neither of the students ___________ ready for the presentation.',
    options: {
      A: 'were',
      B: 'are',
      C: 'is',
      D: 'being',
    },
    correctAnswer: 'C',
    explanation: "'Neither' is singular and grammatically takes a singular verb ('is').",
  },
  {
    id: 5,
    category: 'English Grammar',
    difficulty: 'Intermediate',
    question: 'By next year, they ___________ the new bridge across the river.',
    options: {
      A: 'finish',
      B: 'will finish',
      C: 'will have finished',
      D: 'have finished',
    },
    correctAnswer: 'C',
    explanation: "'By next year' signals a future completed action, requiring the future perfect tense ('will have finished').",
  },
  {
    id: 6,
    category: 'English Grammar',
    difficulty: 'Beginner',
    question: 'I have known him ___________ we were children.',
    options: {
      A: 'for',
      B: 'since',
      C: 'during',
      D: 'until',
    },
    correctAnswer: 'B',
    explanation: "'Since' is used to refer to a specific starting point in time in the past.",
  },
  {
    id: 7,
    category: 'English Grammar',
    difficulty: 'Intermediate',
    question: 'The cake was made ___________ fresh organic ingredients.',
    options: {
      A: 'with',
      B: 'by',
      C: 'from',
      D: 'in',
    },
    correctAnswer: 'A',
    explanation: "We say 'made with' when referring to the ingredients of food or drink.",
  },
  {
    id: 8,
    category: 'English Grammar',
    difficulty: 'Advanced',
    question: 'Hardly ___________ entered the room when the lights went out.',
    options: {
      A: 'he had',
      B: 'had he',
      C: 'he has',
      D: 'did he',
    },
    correctAnswer: 'B',
    explanation: "Negative adverbs like 'Hardly' at the beginning of a sentence require subject-auxiliary inversion ('had he').",
  },
];

export const MINECRAFT_PACK: Question[] = [
  {
    id: 1,
    category: 'Minecraft Trivia',
    difficulty: 'Beginner',
    question: 'What tool is required to mine Diamond Ore and collect diamonds?',
    options: {
      A: 'Wooden Pickaxe',
      B: 'Stone Pickaxe',
      C: 'Iron Pickaxe',
      D: 'Golden Pickaxe',
    },
    correctAnswer: 'C',
    explanation: 'You need an Iron Pickaxe (or Diamond/Netherite) to mine Diamond Ore. Stone or Wood will destroy the block!',
  },
  {
    id: 2,
    category: 'Minecraft Trivia',
    difficulty: 'Beginner',
    question: 'Which hostile mob hisses and explodes when it gets near you?',
    options: {
      A: 'Zombie',
      B: 'Skeleton',
      C: 'Creeper',
      D: 'Enderman',
    },
    correctAnswer: 'C',
    explanation: 'Creepers silently approach players and hiss for about 1.5 seconds before exploding.',
  },
  {
    id: 3,
    category: 'Minecraft Trivia',
    difficulty: 'Beginner',
    question: 'What blocks do you need to construct a Nether Portal frame?',
    options: {
      A: 'Bedrock',
      B: 'Obsidian',
      C: 'Crying Obsidian',
      D: 'Blackstone',
    },
    correctAnswer: 'B',
    explanation: 'A Nether Portal is made using a minimum of 10 blocks of Obsidian and ignited with Flint and Steel.',
  },
  {
    id: 4,
    category: 'Minecraft Trivia',
    difficulty: 'Intermediate',
    question: 'What happens if you try to sleep in a Bed in the Nether or the End?',
    options: {
      A: 'You skip to daytime',
      B: 'The bed explodes violently',
      C: 'You get teleported back to spawn',
      D: 'You take poison damage',
    },
    correctAnswer: 'B',
    explanation: 'Beds explode with huge destructive power when used in any dimension other than the Overworld!',
  },
  {
    id: 5,
    category: 'Minecraft Trivia',
    difficulty: 'Beginner',
    question: 'What item do you feed to Cows and Sheep to breed them?',
    options: {
      A: 'Carrots',
      B: 'Wheat',
      C: 'Apples',
      D: 'Seeds',
    },
    correctAnswer: 'B',
    explanation: 'Feeding Wheat to two cows or sheep makes them enter love mode and produce a baby.',
  },
  {
    id: 6,
    category: 'Minecraft Trivia',
    difficulty: 'Intermediate',
    question: 'Which item dropped by Endermen is combined with Blaze Powder to find Strongholds?',
    options: {
      A: 'Ender Pearl',
      B: 'Eye of Ender',
      C: 'End Stone',
      D: 'Echo Shard',
    },
    correctAnswer: 'A',
    explanation: 'Endermen drop Ender Pearls, which craft Eyes of Ender when combined with Blaze Powder.',
  },
  {
    id: 7,
    category: 'Minecraft Trivia',
    difficulty: 'Intermediate',
    question: 'Which of these mobs does NOT burn in direct sunlight?',
    options: {
      A: 'Zombie',
      B: 'Skeleton',
      C: 'Phantom',
      D: 'Creeper',
    },
    correctAnswer: 'D',
    explanation: 'Creepers and Spiders are immune to daylight burning, whereas Zombies, Skeletons, and Phantoms burn.',
  },
  {
    id: 8,
    category: 'Minecraft Trivia',
    difficulty: 'Advanced',
    question: 'What is the ancient material found deep in the Nether used to upgrade Diamond gear to Netherite?',
    options: {
      A: 'Nether Quartz',
      B: 'Nether Gold Ore',
      C: 'Ancient Debris',
      D: 'Magma Block',
    },
    correctAnswer: 'C',
    explanation: 'Ancient Debris is smelted into Netherite Scraps, which are crafted with Gold into Netherite Ingots.',
  },
  {
    id: 9,
    category: 'Minecraft Trivia',
    difficulty: 'Beginner',
    question: 'What is the final boss mob found on the main island in the End dimension?',
    options: {
      A: 'The Wither',
      B: 'The Warden',
      C: 'The Ender Dragon',
      D: 'The Elder Guardian',
    },
    correctAnswer: 'C',
    explanation: 'The Ender Dragon is the legendary final boss residing in the End dimension.',
  },
  {
    id: 10,
    category: 'Minecraft Trivia',
    difficulty: 'Intermediate',
    question: 'How many Obsidian blocks are required for the minimum frame of a Nether Portal?',
    options: {
      A: '8',
      B: '10',
      C: '12',
      D: '14',
    },
    correctAnswer: 'B',
    explanation: 'A 4x5 portal without the four corner blocks requires exactly 10 Obsidian blocks.',
  },
];

export const PRESET_PACKS: { name: string; id: string; description: string; getQuestions: () => Question[] }[] = [
  {
    id: 'minecraft',
    name: '⛏️ Minecraft Trivia (Fun)',
    description: 'Basic fun trivia about tools, mobs, portals, and dimensions.',
    getQuestions: () => MINECRAFT_PACK,
  },
  {
    id: 'english-grammar',
    name: '📚 English Grammar (Demo)',
    description: 'Matches the classroom AR quiz in the screenshot with modal verbs and tenses.',
    getQuestions: () => ENGLISH_GRAMMAR_PACK,
  },
  {
    id: 'ai-literacy',
    name: '🤖 AI Literacy Challenge',
    description: '40 questions on Prompt Engineering, Responsible AI, and Data Privacy.',
    getQuestions: () => defaultAiQuestions,
  },
];

export async function loadInitialQuestions(): Promise<{ packId: string; questions: Question[] }> {
  const savedPack = localStorage.getItem(PACK_KEY) || 'minecraft';
  const savedCustom = localStorage.getItem(STORAGE_KEY);

  if (savedCustom) {
    try {
      const parsed = JSON.parse(savedCustom);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return { packId: 'custom', questions: parsed };
      }
    } catch (e) {
      console.warn('Failed to parse saved custom questions:', e);
    }
  }

  // Try fetching public/questions.json
  try {
    const res = await fetch('/questions.json');
    if (res.ok) {
      const json = await res.json();
      if (Array.isArray(json) && json.length > 0) {
        return { packId: savedPack, questions: json };
      }
    }
  } catch (err) {
    console.warn('Could not fetch /questions.json, falling back to local pack:', err);
  }

  // Fallback to English Grammar pack
  const pack = PRESET_PACKS.find((p) => p.id === savedPack) || PRESET_PACKS[0];
  return { packId: pack.id, questions: pack.getQuestions() };
}

export function saveCustomQuestions(questions: Question[], packId: string = 'custom') {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(questions));
    localStorage.setItem(PACK_KEY, packId);
  } catch (err) {
    console.error('Failed to save questions to localStorage:', err);
  }
}

export function exportQuestionsToJson(questions: Question[], filename = 'ar_quiz_questions.json') {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(questions, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', filename);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}
