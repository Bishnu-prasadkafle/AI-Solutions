interface Tab {
  value: string;
  label: string;
}

interface FilterTabsProps {
  tabs: Tab[];
  active: string;
  onChange: (value: string) => void;
}

export default function FilterTabs({ tabs, active, onChange }: FilterTabsProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-10">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            active === tab.value
              ? 'bg-accent/20 text-accent border border-accent/30'
              : 'text-[var(--text-secondary)] border border-[var(--border)] hover:border-accent/30'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
