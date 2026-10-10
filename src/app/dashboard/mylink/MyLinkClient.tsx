"use client";

import React from "react";
import { ExternalLink, Music, Disc3 } from "lucide-react";

interface ReleaseMini {
  id: string;
  title: string;
  coverArtworkUrl: string;
}

function resolveMediaUrl(url: string | null | undefined): string {
  if (!url) return "";
  if (url.startsWith("/api/media/")) return url;
  if (url.startsWith("/")) return url;
  if (
    url.includes("breakoutmusicrecord.com") ||
    url.includes("breakoutmusic.online") ||
    url.includes("r2.cloudflarestorage.com")
  ) {
    try {
      const u = new URL(url);
      return `/api/media${u.pathname}`;
    } catch {
      return `/api/media/${url.replace(/^https?:\/\/[^\/]+\//, "")}`;
    }
  }
  return url;
}

export default function MyLinkClient({ releases }: { releases: ReleaseMini[] }) {
  return (
    <div className="animate-fade-in max-w-4xl mx-auto pb-20">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2 flex items-center gap-2">
          <Music className="w-8 h-8 text-blue-600" />
          MyLink
        </h1>
        <p className="text-slate-500 font-medium">
          Kelola dan bagikan Smartlink resmi untuk semua rilisan lagu Anda.
        </p>
      </div>

      {releases.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm flex flex-col items-center justify-center">
          <Disc3 className="w-16 h-16 text-slate-300 mb-4 animate-spin-slow" />
          <h3 className="text-lg font-bold text-slate-800 mb-2">Belum Ada Smartlink</h3>
          <p className="text-sm text-slate-500 max-w-sm">
            Anda belum memiliki lagu yang berstatus RELEASED. Smartlink akan otomatis dibuat setelah lagu Anda rilis di DSP.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {releases.map((rel) => (
            <div key={rel.id} className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
              <img 
                src={resolveMediaUrl(rel.coverArtworkUrl)} 
                alt={rel.title} 
                className="w-20 h-20 rounded-2xl object-cover bg-slate-100 shadow-inner"
              />
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-bold text-slate-900 truncate">{rel.title}</h3>
                <p className="text-xs text-slate-500 mb-3 truncate">Klik untuk membuka halaman promosi</p>
                <a 
                  href={`/listen/${rel.id}`}
                  target="_blank"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors shadow-sm shadow-blue-500/20"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Buka Smartlink
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
