// Create a new file, e.g., DailyInsightCard.tsx

"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button"; // Assuming you use shadcn/ui
import { Lightbulb, BrainCircuit, BookText, Puzzle, RotateCcw } from "lucide-react";

// You can expand this list or fetch it from an API
const dailyInsights = [
  // --- Riddles ---
  {
    type: "Riddle",
    icon: <BrainCircuit className="h-5 w-5" />,
    question: "I have cities, but no houses. I have mountains, but no trees. I have water, but no fish. What am I?",
    answer: "A map.",
  },
  {
    type: "Riddle",
    icon: <BrainCircuit className="h-5 w-5" />,
    question: "What has to be broken before you can use it?",
    answer: "An egg.",
  },
  {
    type: "Riddle",
    icon: <BrainCircuit className="h-5 w-5" />,
    question: "What is full of holes but still holds water?",
    answer: "A sponge.",
  },
  {
    type: "Riddle",
    icon: <BrainCircuit className="h-5 w-5" />,
    question: "What question can you never answer yes to?",
    answer: "Are you asleep yet?",
  },
  {
    type: "Riddle",
    icon: <BrainCircuit className="h-5 w-5" />,
    question: "What is always in front of you but can’t be seen?",
    answer: "The future.",
  },
    {
    type: "Riddle",
    icon: <BrainCircuit className="h-5 w-5" />,
    question: "What can you keep after giving to someone?",
    answer: "Your word.",
  },
  {
    type: "Riddle",
    icon: <BrainCircuit className="h-5 w-5" />,
    question: "I have branches, but no fruit, trunk or leaves. What am I?",
    answer: "A bank.",
  },
  {
    type: "Riddle",
    icon: <BrainCircuit className="h-5 w-5" />,
    question: "What can’t be put in a saucepan?",
    answer: "Its lid.",
  },

  // --- Fun Facts ---
  {
    type: "Fun Fact",
    icon: <Lightbulb className="h-5 w-5" />,
    question: "What is the phenomenon that allows geckos to stick to surfaces?",
    answer: "Van der Waals force - a weak intermolecular force that occurs when molecules are very close together.",
  },
  {
    type: "Fun Fact",
    icon: <Lightbulb className="h-5 w-5" />,
    question: "The human brain generates about 12-25 watts of electricity. What can this power?",
    answer: "This is enough to power a low-wattage LED light bulb.",
  },
  {
    type: "Fun Fact",
    icon: <Lightbulb className="h-5 w-5" />,
    question: "How long is a day on Venus compared to its year?",
    answer: "A day on Venus (243 Earth days) is longer than its year (225 Earth days).",
  },
  {
    type: "Fun Fact",
    icon: <Lightbulb className="h-5 w-5" />,
    question: "An octopus has three of what vital organ?",
    answer: "Three hearts. Two pump blood through the gills, and one pumps it to the rest of the body.",
  },
  {
    type: "Fun Fact",
    icon: <Lightbulb className="h-5 w-5" />,
    question: "What food is known to never spoil?",
    answer: "Honey. Archaeologists have found pots of honey in ancient Egyptian tombs that are over 3,000 years old and still edible.",
  },
  {
    type: "Fun Fact",
    icon: <Lightbulb className="h-5 w-5" />,
    question: "Botanically speaking, bananas are classified as a type of what?",
    answer: "A berry. Conversely, strawberries are not technically berries.",
  },
    {
    type: "Fun Fact",
    icon: <Lightbulb className="h-5 w-5" />,
    question: "How much taller can the Eiffel Tower be during the summer?",
    answer: "Up to 15 cm taller due to the thermal expansion of its iron structure.",
  },
  {
    type: "Fun Fact",
    icon: <Lightbulb className="h-5 w-5" />,
    question: "What animal's fingerprints are so indistinguishable from humans' that they have been confused at a crime scene?",
    answer: "A koala's.",
  },

  // --- Vocabulary Words ---
  {
    type: "Vocabulary Word",
    icon: <BookText className="h-5 w-5" />,
    question: "What does the word 'ephemeral' mean?",
    answer: "Lasting for a very short time. E.g., 'The beauty of the cherry blossoms is ephemeral.'",
  },
  {
    type: "Vocabulary Word",
    icon: <BookText className="h-5 w-5" />,
    question: "What does the word 'ubiquitous' mean?",
    answer: "Present, appearing, or found everywhere. E.g., 'Smartphones have become ubiquitous in modern society.'",
  },
  {
    type: "Vocabulary Word",
    icon: <BookText className="h-5 w-5" />,
    question: "What does the word 'mellifluous' mean?",
    answer: "Sweet or musical; pleasant to hear. E.g., 'She had a mellifluous voice that soothed the audience.'",
  },
  {
    type: "Vocabulary Word",
    icon: <BookText className="h-5 w-5" />,
    question: "What does the word 'serendipity' mean?",
    answer: "The occurrence of events by chance in a happy or beneficial way. E.g., 'Discovering the old bookshop was a moment of pure serendipity.'",
  },
  {
    type: "Vocabulary Word",
    icon: <BookText className="h-5 w-5" />,
    question: "What does 'pulchritudinous' mean?",
    answer: "Having great physical beauty. E.g., 'The sunset over the ocean was pulchritudinous.'",
  },
    {
    type: "Vocabulary Word",
    icon: <BookText className="h-5 w-5" />,
    question: "What does the word 'epiphany' mean?",
    answer: "A moment of sudden and great revelation or realization. E.g., 'He had an epiphany that changed his perspective on life.'",
  },

  // --- Logical Puzzles ---
  {
    type: "Logical Puzzle",
    icon: <Puzzle className="h-5 w-5" />,
    question: "A farmer has 17 sheep and all but 9 die. How many are left?",
    answer: "9 are left.",
  },
  {
    type: "Logical Puzzle",
    icon: <Puzzle className="h-5 w-5" />,
    question: "What comes next in the sequence: 1, 4, 9, 16, 25, ...?",
    answer: "36. (They are the squares of consecutive numbers: 1², 2², 3², etc.)",
  },
  {
    type: "Logical Puzzle",
    icon: <Puzzle className="h-5 w-5" />,
    question: "If you are running a race and you pass the person in 2nd place, what place are you in?",
    answer: "You are in 2nd place.",
  },
  {
    type: "Logical Puzzle",
    icon: <Puzzle className="h-5 w-5" />,
    question: "Which is heavier: a ton of bricks or a ton of feathers?",
    answer: "Neither. They both weigh a ton.",
  },
  {
    type: "Logical Puzzle",
    icon: <Puzzle className="h-5 w-5" />,
    question: "A man is looking at a portrait. Someone asks him whose portrait he is looking at. He replies, 'Brothers and sisters I have none, but that man's father is my father's son.' Who is in the portrait?",
    answer: "His son.",
  },
  {
    type: "Logical Puzzle",
    icon: <Puzzle className="h-5 w-5" />,
    question: "What is the next letter in this sequence: J, F, M, A, M, J, ...?",
    answer: "J. (The letters are the first letter of the months of the year: January, February, March...)",
  },
];


const DailyInsightCard = () => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [insight, setInsight] = useState(dailyInsights[0]);

  // Select a random insight when the component mounts
  useEffect(() => {
    setInsight(dailyInsights[Math.floor(Math.random() * dailyInsights.length)]);
  }, []);

  const handleFlip = () => setIsFlipped(!isFlipped);
  
  const handleNewCard = (e:any) => {
    e.stopPropagation(); // Prevent the card from flipping when getting a new one
    setIsFlipped(false);
    // Ensure the new insight is different from the current one
    let newInsight = insight;
    while (newInsight.question === insight.question) {
        newInsight = dailyInsights[Math.floor(Math.random() * dailyInsights.length)];
    }
    setInsight(newInsight);
  }

  return (
    <div className="w-full max-w-lg mx-auto h-56 [perspective:1000px]">
      <motion.div
        className="relative h-full w-full [transform-style:preserve-3d]"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Front of the Card */}
        <div className="absolute h-full w-full rounded-2xl border bg-card p-6 shadow-lg [backface-visibility:hidden] flex flex-col justify-between">
            <div className="flex items-center justify-between text-muted-foreground">
                <div className="flex items-center gap-2 text-sm font-medium">
                    {insight.icon}
                    <span>{insight.type}</span>
                </div>
                 <Button variant="ghost" size="icon" onClick={handleNewCard} className="h-8 w-8">
                    <RotateCcw className="h-4 w-4" />
                </Button>
            </div>
            <p className="flex-1 flex items-center justify-center text-center text-lg font-semibold text-card-foreground">
                {insight.question}
            </p>
            <Button onClick={handleFlip} className="w-full">
                Reveal Answer
            </Button>
        </div>

        {/* Back of the Card */}
        <div className="absolute h-full w-full rounded-2xl border bg-secondary p-6 shadow-lg [backface-visibility:hidden] [transform:rotateY(180deg)] flex flex-col justify-between">
            <div className="flex items-center gap-2 text-sm font-medium text-secondary-foreground">
                {insight.icon}
                <span>Answer</span>
            </div>
            <p className="flex-1 flex items-center justify-center text-center text-2xl font-bold text-secondary-foreground">
                {insight.answer}
            </p>
            <Button onClick={handleFlip} variant="secondary" className="w-full">
                Flip Back
            </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default DailyInsightCard;