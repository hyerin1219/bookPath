import { Button } from './button';

interface ISearchBoxProps {
    value: string;
    onChange: (value: string) => void;
    onClick: () => void;
    placeholder?: string;
    disabled?: boolean;
    className?: string;
}

export default function SearchBox({ value, onChange, onClick, placeholder, className }: ISearchBoxProps) {
    return (
        <div className={`${className} flex items-center gap-3 bg-white border border-gray-300 rounded-xl px-3 py-2 focus-within:shadow-md transition-shadow`}>
            <input value={value} onChange={(e) => onChange(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && onClick()} type="text" className="flex-1 bg-transparent focus:outline-none" placeholder={placeholder ?? '검색어를 입력해보세요.'} />

            <Button variant="search" onClick={onClick}>
                검색
            </Button>
        </div>
    );
}
