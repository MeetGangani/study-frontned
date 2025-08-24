"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Moon, Sun } from "lucide-react";

const CompactMinimalistClock = () => {
  const [time, setTime] = useState(new Date());
  const [quote, setQuote] = useState("");

  const quotes = [
    "Time is the best teacher ✨",
    "Every second is a chance to grow 🌱",
    "Make each moment count 💫",
    "Learning never stops 📚",
    "Time + Focus = Success 🎯",
    "Embrace the present moment 🌟",
    "Time flies, memories last 🕊️",
    "Create your own destiny ⭐",
    "Small steps lead to big changes ⏳",
    "Invest time wisely, reap success 💰",
    "The best time to start is now ⏰",
    "Time waits for no one, use it well ⏳",
    "Knowledge grows with time 📖",
    "Stay consistent, time will reward you 🏆",
    "The clock keeps ticking, keep moving 🔄",
    "Dream big, act now 🚀",
    "Moments become milestones 🌈",
    "Time is precious, don't waste it 🕰️",
    "One second can change everything 💡",
    "Every effort adds up over time 📊",
    "Keep learning, keep growing 🌍",
    "The more you invest in learning, the richer you become 🎓",
    "Every challenge teaches something new ⚡",
    "Make today better than yesterday 🌅",
    "Success is built over time, not overnight 🏗️",
    "A focused mind wins the race 🏁",
    "Growth takes time, but it's worth it 🌳",
    "Learn, apply, and improve 🔄",
    "Use time wisely, regret nothing ⌛",
    "Every second is an opportunity 🎯",
    "Be patient, time rewards effort 🕰️",
    "Your time is your most valuable asset 💎",
    "Stay disciplined, success follows ⏳",
    "The more you practice, the better you become 🏋️‍♂️",
    "Value time like gold 🏆",
    "Keep chasing knowledge 📚",
    "Time used wisely leads to greatness 🌟",
    "The right time is always now 🚀",
    "Don't just pass time, make it count 🎯",
    "Today's learning is tomorrow's success 📘",
    "Keep moving, keep improving 🏃‍♂️",
    "The best investment? Your time and effort 💡",
    "Time teaches lessons that books can't 📖",
    "The future belongs to those who prepare now 🔮",
    "Smart work and time management = success 🎯",
    "A moment spent learning is never wasted ⌚",
    "Every sunrise brings new possibilities 🌅",
    "Persistence + Time = Mastery 🔥",
    "Time unlocks doors to success 🚪",
    "Great things take time, stay patient 🌍",
    "Keep going, keep growing 📈",
    "Learn something new every day 🎓",
    "Time shapes your destiny 🔄",
    "Act now, don't wait for the perfect moment ⏳",
    "Build your dreams, one moment at a time 🌠",
    "A productive today creates a successful tomorrow ☀️",
    "The journey of success starts with time well spent 🛤️",
    "Make every second a stepping stone to greatness 🏆",
    "Control your time, control your future 🚀",
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
    const quoteTimer = setInterval(() => {
      setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
    }, 30000);

    return () => {
      clearInterval(timer);
      clearInterval(quoteTimer);
    };
  }, []);

  const getIndianTime = () => {
    const options = {
      timeZone: "Asia/Kolkata",
      hour: "2-digit" as "2-digit",
      minute: "2-digit" as "2-digit",
      hour12: true,
    };
    const timeString = time.toLocaleTimeString("en-US", options);
    return timeString.split(/[: ]/);
  };

  const getIndianDate = () => {
    const options = {
      timeZone: "Asia/Kolkata",
      weekday: "short" as "short",
      month: "short" as "short",
      day: "numeric" as "numeric",
    };
    return time.toLocaleDateString("en-US", options);
  };

  const [hours, minutes, meridian] = getIndianTime();
  const isNight = Number.parseInt(hours) >= 6 && meridian === "PM";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-lg mx-auto h-48" // Fixed height constraint
    >
      <div className="h-full rounded-2xl border bg-card p-4 shadow-lg backdrop-blur-sm dark:bg-card dark:shadow-2xl dark:shadow-primary/20 flex flex-col">
        
        {/* Compact Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <motion.div
              className="p-1.5 rounded-lg bg-secondary dark:bg-secondary/20"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1 }}
            >
              {isNight ? (
                <Moon className="w-4 h-4 text-blue-600" />
              ) : (
                <Sun className="w-4 h-4 text-yellow-600" />
              )}
            </motion.div>
            <div className="text-xs text-muted-foreground">
              {getIndianDate()}
            </div>
          </div>
          <div className="text-xs font-mono text-muted-foreground">
            IST
          </div>
        </div>

        {/* Compact Time Display */}
        <div className="flex-1 flex items-center justify-center">
          <motion.div
            className="text-center"
            animate={{
              textShadow: "0 0 10px hsl(var(--primary) / 0.3)",
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          >
            <div className="flex items-baseline justify-center text-4xl md:text-5xl font-mono font-bold text-primary dark:text-primary tracking-wide">
              <span>{hours}</span>
              <motion.span 
                className="animate-pulse mx-1"
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                :
              </motion.span>
              <span>{minutes}</span>
              <span className="ml-2 text-lg font-semibold text-muted-foreground dark:text-muted-foreground">
                {meridian}
              </span>
            </div>
          </motion.div>
        </div>

        {/* Compact Quote */}
        <AnimatePresence mode="wait">
          <motion.div
            key={quote}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.4 }}
            className="mb-3"
          >
            <div className="text-xs italic text-center p-2 rounded-xl bg-secondary/50 dark:bg-secondary text-secondary-foreground dark:text-secondary-foreground line-clamp-2">
              {quote}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Compact Progress Bar */}
        <motion.div
          className="h-1.5 rounded-full overflow-hidden bg-secondary dark:bg-secondary/20"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="h-full rounded-full bg-primary dark:bg-primary"
            style={{
              width: `${(Number.parseInt(minutes) / 60) * 100}%`,
            }}
            animate={{
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
            }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default CompactMinimalistClock;
