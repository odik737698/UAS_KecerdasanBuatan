import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Plus, Search, Pencil, Trash2, Upload, Download, Settings, X } from "lucide-react";

export default function Sidebar({
  conversations,
  activeConvId,
  onSelect,
  onNew,
  onDelete,
  onRename,
  onExport,
  onImport,
  onSettings,
  isOpen,
  onClose,
}) {
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  function formatDate(ts) {
    const d = new Date(ts);
    const now = new Date();
    const diff = now - d;
    if (diff < 86400000 && d.getDate() === now.getDate()) return "Hari ini";
    if (diff < 172800000 && d.getDate() === now.getDate() - 1) return "Kemarin";
    return d.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
  }

  function startRename(conv) {
    setEditingId(conv.id);
    setEditTitle(conv.title);
  }

  function submitRename(id) {
    onRename(id, editTitle.trim() || "Percakapan baru");
    setEditingId(null);
  }

  const filtered = conversations.filter(c =>
    c.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Sheet open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <SheetContent side="left" showCloseButton={false} className="w-[260px] p-0 flex flex-col gap-0">
        <SheetHeader className="h-14 px-4 border-b border-border flex-row items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="Coders Minix" className="w-6 h-6 rounded-full" />
            <SheetTitle className="text-sm font-medium">Coders Minix</SheetTitle>
          </div>
          <Button variant="ghost" size="icon-sm" onClick={onClose} className="-mr-1">
            <X className="size-4" />
          </Button>
        </SheetHeader>

        <div className="px-3 pt-3 shrink-0">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Cari percakapan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 h-8 text-[13px]"
            />
          </div>
        </div>

        <div className="px-3 pt-1.5 shrink-0">
          <Button variant="ghost" className="w-full justify-start gap-2" onClick={onNew}>
            <Plus className="size-4" />
            Percakapan baru
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto px-2 space-y-0.5 mt-1">
          {filtered.length === 0 && (
            <p className="text-xs text-muted-foreground text-center px-3 py-8">
              {searchTerm ? "Tidak ditemukan" : "Belum ada percakapan"}
            </p>
          )}
          {filtered.map((conv) => (
            <div
              key={conv.id}
              onClick={() => { onSelect(conv.id); }}
              className={`group flex items-center gap-2 px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${
                conv.id === activeConvId
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
              }`}
            >
              <div className="flex-1 min-w-0">
                {editingId === conv.id ? (
                  <Input
                    className="h-7 text-sm"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") submitRename(conv.id);
                      if (e.key === "Escape") setEditingId(null);
                    }}
                    onBlur={() => submitRename(conv.id)}
                    autoFocus
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  <>
                    <p className="text-sm truncate">{conv.title}</p>
                    <p className="text-[11px] text-muted-foreground/60">{formatDate(conv.updatedAt)}</p>
                  </>
                )}
              </div>
              <div className="hidden group-hover:flex items-center gap-0.5 shrink-0">
                <Tooltip>
                  <TooltipTrigger render={<Button variant="ghost" size="icon-xs" onClick={(e) => { e.stopPropagation(); startRename(conv); }} />}>
                    <Pencil className="size-3" />
                  </TooltipTrigger>
                  <TooltipContent>Ubah nama</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger render={<Button variant="ghost" size="icon-xs" onClick={(e) => { e.stopPropagation(); onDelete(conv.id); }} />}>
                    <Trash2 className="size-3" />
                  </TooltipTrigger>
                  <TooltipContent>Hapus</TooltipContent>
                </Tooltip>
              </div>
            </div>
          ))}
        </div>

        <Separator className="shrink-0" />
        <div className="flex items-center justify-between px-2 py-2 shrink-0">
          <div className="flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger render={<Button variant="ghost" size="icon" onClick={onExport} />}>
                <Download className="size-4" />
              </TooltipTrigger>
              <TooltipContent>Export chat</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger render={<Button variant="ghost" size="icon" onClick={() => document.getElementById("import-file-input")?.click()} />}>
                <Upload className="size-4" />
              </TooltipTrigger>
              <TooltipContent>Import chat</TooltipContent>
            </Tooltip>
            <input
              id="import-file-input"
              type="file"
              accept=".json"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onImport(file);
                e.target.value = "";
              }}
            />
          </div>
          <Tooltip>
            <TooltipTrigger render={<Button variant="ghost" size="icon" onClick={onSettings} />}>
              <Settings className="size-4" />
            </TooltipTrigger>
            <TooltipContent>Pengaturan</TooltipContent>
          </Tooltip>
        </div>
      </SheetContent>
    </Sheet>
  );
}
