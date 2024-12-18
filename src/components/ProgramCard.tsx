import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Program, TranslatedProgram, Currency } from "@/types/program";
import { formatCurrency } from "@/utils/currency";
import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import { useRef } from "react";
import { ProgramDetails } from "./programs/ProgramDetails";
import { SwipeIndicator } from "./programs/SwipeIndicator";
import { useCardAnimation } from "./programs/useCardAnimation";

interface ProgramCardProps {
  program: Program;
  translatedProgram: TranslatedProgram;
  timesAvailableText: string;
  bookButtonText: string;
  onBook: (programId: number) => void;
  currency: Currency;
  language: string;
  isCentered?: boolean;
}

export function ProgramCard({
  program,
  translatedProgram,
  timesAvailableText,
  bookButtonText,
  onBook,
  currency,
  language,
  isCentered = false
}: ProgramCardProps) {
  const isMobile = useIsMobile();
  const cardRef = useRef<HTMLDivElement>(null);
  const { controls, dragStarted, handleDragStart, handleDrag, handleDragEnd } = useCardAnimation(cardRef);

  return (
    <div className="relative perspective-1200" ref={cardRef}>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 1 }}
        animate={controls}
        whileHover={!isMobile ? { 
          y: -5,
          scale: isCentered ? 1.05 : 1,
          rotateY: [-1, 1],
          transition: {
            rotateY: {
              repeat: Infinity,
              repeatType: "reverse",
              duration: 2
            }
          }
        } : {}}
        transition={{ 
          duration: 0.4,
          type: "spring",
          stiffness: 300,
          damping: 25
        }}
        drag={isMobile ? "x" : false}
        dragConstraints={{ left: -100, right: 100 }}
        dragElastic={0.1}
        onDragStart={() => handleDragStart()}
        onDrag={(event, info) => handleDrag()}
        onDragEnd={(e, info) => handleDragEnd(e.target as HTMLElement, info)}
        style={{ 
          transformStyle: "preserve-3d",
          perspective: "1200px",
          scale: isCentered ? 1.05 : 1,
          zIndex: isCentered ? 10 : 1,
        }}
        whileDrag={{
          scale: 0.98,
          transition: { 
            duration: 0.3,
            ease: "easeOut"
          }
        }}
        className="rounded-2xl overflow-hidden touch-pan-y"
      >
        <Card className={`
          group relative overflow-hidden bg-white/90 backdrop-blur-sm 
          border border-gray-100 hover:border-primary/20 
          transition-all duration-300 hover:shadow-xl rounded-2xl 
          min-h-[520px] flex flex-col
          ${isCentered ? 'shadow-xl border-primary/30' : ''}
        `}>
          {isMobile && !dragStarted && (
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent"
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: [0.3, 0, 0.3],
                x: ["-100%", "100%", "-100%"],
                transition: {
                  repeat: Infinity,
                  duration: 3,
                  ease: "easeInOut"
                }
              }}
            />
          )}
          
          <CardHeader className="p-0">
            <div className="relative overflow-hidden aspect-video rounded-t-2xl">
              <img
                src={program.image}
                alt={translatedProgram.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </CardHeader>
          <CardContent className="p-6 flex-grow">
            <CardTitle className="text-xl mb-3 font-display text-accent group-hover:text-primary transition-colors duration-300">
              {translatedProgram.title}
            </CardTitle>
            <CardDescription className="mb-4 line-clamp-3 text-accent/80">
              {translatedProgram.description}
            </CardDescription>
            <ProgramDetails
              duration={program.duration}
              location={program.location}
              timesAvailableText={timesAvailableText}
            />
          </CardContent>
          <CardFooter className="p-6 flex flex-col items-center gap-3 border-t border-gray-100">
            <span className="text-lg font-semibold text-primary">
              {formatCurrency(program.price, currency)}/fő
            </span>
            <Button 
              variant="default"
              onClick={() => onBook(program.id)}
              className="w-full bg-primary hover:bg-primary/90 text-white transition-all duration-300 hover:shadow-lg"
            >
              {bookButtonText}
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}