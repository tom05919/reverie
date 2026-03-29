"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  History,
  Handshake,
  MessageSquare,
  Radio,
  Upload,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useRef, useEffect } from "react";
import { Switch } from "@/components/ui/switch";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/interactions", label: "Interactions", icon: History },
  { href: "/deals", label: "Deals", icon: Handshake },
  { href: "/chat", label: "Chat", icon: MessageSquare },
  { href: "/live", label: "Live", icon: Radio },
];

type AgentStatus = "online" | "negotiating" | "idle";

const statusConfig: Record<AgentStatus, { color: string; label: string }> = {
  online: { color: "bg-emerald-400", label: "Online" },
  negotiating: { color: "bg-violet-400", label: "Negotiating" },
  idle: { color: "bg-neutral-500", label: "Idle" },
};

export function Sidebar() {
  const pathname = usePathname();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [anonymousMode, setAnonymousMode] = useState(true);
  const [liveCount, setLiveCount] = useState(0);

  useEffect(() => {
    const fetchLiveCount = () => {
      fetch("/api/negotiations")
        .then((res) => res.json())
        .then((data) => {
          const active = (data.sessions ?? []).filter(
            (s: { status: string }) => s.status === "active",
          ).length;
          setLiveCount(active);
        })
        .catch(() => {});
    };
    fetchLiveCount();
    const interval = setInterval(fetchLiveCount, 10_000);
    return () => clearInterval(interval);
  }, []);

  const agentStatus: AgentStatus = liveCount > 0 ? "negotiating" : "online";
  const status = statusConfig[agentStatus];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const names = Array.from(files).map((f) => f.name);
      setUploadedFiles((prev) => [...prev, ...names]);
    }
  };

  return (
    <aside className="fixed inset-y-0 left-0 z-30 flex w-60 flex-col border-r border-sidebar-border bg-sidebar">
      {/* Brand */}
      <Link href="/" className="flex items-center gap-3 px-5 py-6 transition-opacity hover:opacity-80">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-blue-500">
          <span className="text-sm font-bold text-white">R</span>
        </div>
        <span className="text-lg font-semibold tracking-tight text-sidebar-foreground font-martian-mono">
          Reverie
        </span>
      </Link>

      {/* Agent Status */}
      <div className="mx-4 mb-3 rounded-lg border border-sidebar-border bg-sidebar-accent/50 px-3 py-2.5">
        <p className="mb-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          Agent Status
        </p>
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            {agentStatus === "negotiating" && (
              <span className={cn("absolute inline-flex h-full w-full animate-ping rounded-full opacity-75", status.color)} />
            )}
            <span className={cn("relative inline-flex h-2 w-2 rounded-full", status.color)} />
          </span>
          <span className="text-sm font-medium text-sidebar-foreground">
            {status.label}
          </span>
        </div>
      </div>

      {/* Anonymous Mode Toggle */}
      <div className="mx-4 mb-4 rounded-lg border border-sidebar-border bg-sidebar-accent/50 px-3 py-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className={cn("h-3.5 w-3.5", anonymousMode ? "text-violet-400" : "text-muted-foreground")} />
            <span className="text-xs font-medium text-sidebar-foreground">
              Anonymous Mode
            </span>
          </div>
          <Switch
            checked={anonymousMode}
            onCheckedChange={setAnonymousMode}
            className="scale-75"
          />
        </div>
        {anonymousMode && (
          <p className="mt-1.5 text-[10px] text-violet-400/80">
            Your identity is hidden from all counterparties
          </p>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3">
        {navItems.map((item) => {
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150",
                isActive
                  ? "bg-sidebar-accent text-sidebar-primary"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {item.label}
              {item.href === "/live" && liveCount > 0 && (
                <span className="ml-auto flex h-4 min-w-4 items-center justify-center rounded-full bg-emerald-500/20 text-[10px] font-medium text-emerald-400 px-1">
                  {liveCount}
                </span>
              )}
              {item.href === "/live" && liveCount === 0 && (
                <span className="ml-auto h-2 w-2 rounded-full bg-muted-foreground/30" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <div className="mx-4 mb-2 space-y-1">
          <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            Uploaded
          </p>
          {uploadedFiles.slice(-3).map((name, i) => (
            <p
              key={i}
              className="truncate text-xs text-sidebar-foreground/70"
            >
              {name}
            </p>
          ))}
        </div>
      )}

      {/* Upload Button */}
      <div className="p-4">
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          multiple
          accept=".pdf,.docx,.txt,.csv"
          onChange={handleFileUpload}
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-sidebar-border px-3 py-2 text-sm text-muted-foreground transition-colors hover:border-sidebar-primary/50 hover:text-sidebar-foreground"
        >
          <Upload className="h-4 w-4" />
          Upload Context
        </button>
      </div>
    </aside>
  );
}
