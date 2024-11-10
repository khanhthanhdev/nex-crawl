import { useEffect, useState } from 'react';
import Link from 'next/link';
import {cn} from '../lib/utils';
import {SquareDashedMousePointer} from 'lucide-react';

interface LogoProps {
  fontSize?: string;
  iconSize?: number;
}

const Logo: React.FC<LogoProps> = ({ fontSize, iconSize }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <Link
      href="/"
      className={cn(
        "text-2xl font-extrabold flex items-center gap-2",
        fontSize
      )}
    >
      <div className="rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 p-2">
        {isClient && <SquareDashedMousePointer size={iconSize} className="stroke-white" />}
      </div>
      <div>
        <span className="bg-gradient-to-r from-emerald-500 to-emerald-600 bg-clip-text text-transparent">
          Nex
        </span>
        <span className="text-stone-700 dark:text-stone-300">
          Crawl
        </span>
      </div>
    </Link>
  );
};

export default Logo;
