import { Search as SearchIcon } from 'lucide-react';
import { Input } from '../ui/input';

type Props = {
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
};
export default function SearchBar({ placeholder, value, onChange }: Props) {
  return (
    <div className="relative w-full max-w-sm">
      <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
      <Input
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-9 h-9"
        type="search"
      />
    </div>
  );
}
