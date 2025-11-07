import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
}

const Logo = ({ className, size = 48, showText = false }: LogoProps) => {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        {/* Cercle principal avec bordure épaisse */}
        <circle
          cx="50"
          cy="50"
          r="45"
          stroke="currentColor"
          strokeWidth="5"
          className="text-primary"
        />
        
        {/* Forme intérieure - trois segments verticaux avec base plate */}
        {/* Segment gauche */}
        <rect
          x="28"
          y="50"
          width="12"
          height="18"
          rx="6"
          fill="currentColor"
          className="text-primary"
        />
        <rect
          x="28"
          y="40"
          width="12"
          height="10"
          rx="5"
          fill="currentColor"
          className="text-primary"
        />
        
        {/* Segment central (plus haut) */}
        <rect
          x="44"
          y="45"
          width="12"
          height="23"
          rx="6"
          fill="currentColor"
          className="text-primary"
        />
        <rect
          x="44"
          y="35"
          width="12"
          height="10"
          rx="5"
          fill="currentColor"
          className="text-primary"
        />
        
        {/* Segment droit */}
        <rect
          x="60"
          y="50"
          width="12"
          height="18"
          rx="6"
          fill="currentColor"
          className="text-primary"
        />
        <rect
          x="60"
          y="40"
          width="12"
          height="10"
          rx="5"
          fill="currentColor"
          className="text-primary"
        />
        
        {/* Base horizontale connectant les segments */}
        <rect
          x="28"
          y="60"
          width="44"
          height="4"
          rx="2"
          fill="currentColor"
          className="text-primary"
        />
        
        {/* Rayons en haut - trois lignes solides */}
        <line
          x1="50"
          y1="5"
          x2="50"
          y2="12"
          stroke="currentColor"
          strokeWidth="5"
          strokeLinecap="round"
          className="text-primary"
        />
        <line
          x1="32"
          y1="10"
          x2="38"
          y2="16"
          stroke="currentColor"
          strokeWidth="5"
          strokeLinecap="round"
          className="text-primary"
        />
        <line
          x1="68"
          y1="10"
          x2="62"
          y2="16"
          stroke="currentColor"
          strokeWidth="5"
          strokeLinecap="round"
          className="text-primary"
        />
      </svg>
      
      {showText && (
        <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Shora-Bot
        </span>
      )}
    </div>
  );
};

export default Logo;

