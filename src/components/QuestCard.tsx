interface Quest {
  name: string;
  objective: string;
  action: string;
  reward: string;
}

const QuestCard = ({ quest }: { quest: Quest }) => {
  return (
    <div className="rounded-xl border border-border bg-card p-5 space-y-3 hover:border-primary/40 transition-colors duration-300">
      <div className="flex items-start justify-between gap-2">
        <h4 className="font-display font-bold text-foreground text-sm">🎯 {quest.name}</h4>
      </div>
      <p className="text-xs text-muted-foreground">{quest.objective}</p>
      <div className="space-y-2 pt-1">
        <div className="flex items-start gap-2 text-xs">
          <span className="text-primary font-bold mt-0.5">▸</span>
          <span className="text-foreground">{quest.action}</span>
        </div>
        <div className="flex items-start gap-2 text-xs">
          <span className="text-primary font-bold mt-0.5">★</span>
          <span className="text-muted-foreground italic">{quest.reward}</span>
        </div>
      </div>
    </div>
  );
};

export default QuestCard;
