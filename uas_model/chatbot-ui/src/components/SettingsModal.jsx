import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const ACCENT_COLORS = [
  { name: "Orange", value: "#ff8c00" },
  { name: "Biru", value: "#60a5fa" },
  { name: "Hijau", value: "#4ade80" },
  { name: "Ungu", value: "#c084fc" },
  { name: "Merah", value: "#f87171" },
  { name: "Teal", value: "#2dd4bf" },
];

export default function SettingsModal({
  isOpen,
  onClose,
  gridScanEnabled,
  onToggleGridScan,
  accentColor,
  onChangeAccent,
}) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Pengaturan</DialogTitle>
          <DialogDescription>Sesuaikan tampilan chatbot</DialogDescription>
        </DialogHeader>
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="grid-scan">GridScan Background</Label>
              <p className="text-xs text-muted-foreground">Animasi 3D grid di latar belakang</p>
            </div>
            <Switch
              id="grid-scan"
              checked={gridScanEnabled}
              onCheckedChange={onToggleGridScan}
            />
          </div>
          <div>
            <Label className="mb-2.5 block">Warna Aksen</Label>
            <div className="flex gap-2.5">
              {ACCENT_COLORS.map((c) => (
                <button
                  key={c.name}
                  onClick={() => onChangeAccent(c.value)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform hover:scale-110 ${
                    accentColor === c.value ? "ring-2 ring-white ring-offset-2 ring-offset-background scale-110" : ""
                  }`}
                  style={{ backgroundColor: c.value }}
                  title={c.name}
                >
                  {accentColor === c.value && (
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
