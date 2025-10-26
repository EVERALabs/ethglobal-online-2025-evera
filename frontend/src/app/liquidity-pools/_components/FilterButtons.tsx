import React from 'react';

interface FilterOption {
  id: string;
  label: string;
}

interface FilterButtonsProps {
  options: FilterOption[];
  selected: string;
  onSelect: (id: string) => void;
}

export const FilterButtons: React.FC<FilterButtonsProps> = ({
  options,
  selected,
  onSelect,
}) => {
  return (
    <div className="flex flex-wrap gap-3">
      {options.map((option) => (
        <button
          key={option.id}
          onClick={() => onSelect(option.id)}
          className={`px-6 py-2.5 rounded-full font-semibold transition-all ${
            selected === option.id
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/50'
              : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};

