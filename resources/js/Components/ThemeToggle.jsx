import { useTheme } from '@/Contexts/ThemeContext';
import { Moon, Sun } from 'lucide-react'; // Assuming you use Lucide icons

export default function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded-lg transition-colors duration-200
                       hover:bg-gray-100 dark:hover:bg-gray-800
                       text-gray-500 dark:text-gray-400"
            aria-label="Toggle Dark Mode"
        >
            {theme === 'light' ? (
                <Moon className="w-5 h-5" />
            ) : (
                <Sun className="w-5 h-5" />
            )}
        </button>
    );
}
