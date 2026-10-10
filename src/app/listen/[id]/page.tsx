import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Music, Play, ExternalLink } from "lucide-react";

const prisma = new PrismaClient();

export default async function SmartlinkPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const release = await prisma.release.findUnique({
    where: { id },
    include: {
      artist: true,
      tracks: true
    }
  });

  if (!release || release.status !== "RELEASED") {
    notFound();
  }

  const artistName = release.artist?.stageName || "Unknown Artist";
  
  // Resolve artwork URL (if from R2 or local API)
  let coverUrl = release.coverArtworkUrl;
  if (coverUrl.includes("breakoutmusicrecord.com") || coverUrl.includes("breakoutmusic.online") || coverUrl.includes("r2.cloudflarestorage.com")) {
    try {
      const u = new URL(coverUrl);
      coverUrl = `/api/media${u.pathname}`;
    } catch {
      coverUrl = `/api/media/${coverUrl.replace(/^https?:\/\/[^\/]+\//, "")}`;
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Custom Background Image */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(/smartlink-bg.jpg)` }}
      />
      <div className="absolute inset-0 bg-black/40 z-0" />

      {/* Glass card without blur */}
      <div className="w-full max-w-md bg-slate-900/50 border border-white/10 rounded-3xl overflow-hidden z-10 shadow-2xl relative">
        <div className="p-8 pb-6 flex flex-col items-center text-center">
          <div className="relative w-48 h-48 md:w-56 md:h-56 rounded-2xl overflow-hidden shadow-2xl shadow-black/50 mb-6 group">
            <img
              src={coverUrl}
              alt={release.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
          
          <h1 className="text-2xl font-black text-white mb-1 tracking-tight">{release.title}</h1>
          <h2 className="text-lg font-medium text-slate-400 mb-6">{artistName}</h2>
          <p className="text-xs font-bold tracking-widest text-red-500 uppercase mb-8">Dengarkan Sekarang</p>

          <div className="w-full flex flex-col gap-3">
            {release.spotifyUrl && (
              <a
                href={release.spotifyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-between p-4 rounded-2xl bg-white text-slate-900 hover:scale-[1.02] transition-transform shadow-lg shadow-green-500/10 group"
              >
                <div className="flex items-center gap-3">
                  <svg className="w-6 h-6 text-[#1DB954]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.54.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.84.241 1.2zM19.08 10.5c-3.96-2.34-10.44-2.58-14.16-1.44-.6.18-1.26-.18-1.44-.78-.18-.6.18-1.26.78-1.44 4.32-1.26 11.4-1.02 15.84 1.62.54.36.72 1.02.36 1.56-.36.6-1.02.72-1.38.48z"/>
                  </svg>
                  <span className="font-bold">Spotify</span>
                </div>
                <div className="px-3 py-1 bg-slate-100 rounded-lg text-xs font-bold text-slate-700 group-hover:bg-[#1DB954] group-hover:text-white transition-colors">Play</div>
              </a>
            )}

            {release.appleMusicUrl && (
              <a
                href={release.appleMusicUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-between p-4 rounded-2xl bg-white text-slate-900 hover:scale-[1.02] transition-transform shadow-lg shadow-pink-500/10 group"
              >
                <div className="flex items-center gap-3">
                  <svg className="w-6 h-6 text-[#FA243C]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M21.5 6.2c-1.3-1.6-3.8-3.3-6.5-3.5-3.3-.3-6.4 1.6-8.2 1.6-1.8 0-4.3-1.6-7-1.5-3.5.1-6.8 2.1-8.6 5.2-3.7 6.3-.9 15.6 2.7 20.8 1.8 2.6 3.9 5.5 6.7 5.4 2.7-.1 3.7-1.7 7-1.7s4.2 1.7 7 1.7c2.9.1 4.7-2.7 6.4-5.3 2-2.9 2.8-5.7 2.8-5.8-.1-.1-5.4-2-5.4-8.3 0-5.3 4.3-7.8 4.5-8-2-3-4.9-4.8-6.3-5-1.2-.2-2.5.3-3.6 1.1-.9.7-1.4 1.8-1.4 3 0 1.5.7 2.9 1.8 3.8.9.8 2.1 1.2 3.3 1.2.3 0 .7-.1 1-.2zm-3.3 16.5c-2.3 2.1-5.1 1.8-6.6 1.8-1.6 0-4.6.4-6.8-1.9-2.3-2.5-3.3-5.9-3.3-8.8 0-3.6 1.4-6.8 3.8-9.1 2.3-2.2 5.1-2.1 6.5-2.1 1.7 0 4.6-.2 6.8 2.1 2.4 2.5 3.3 5.9 3.3 8.7 0 3.7-1.3 6.9-3.7 9.3z" transform="scale(0.8) translate(3,3)"/>
                  </svg>
                  <span className="font-bold">Apple Music</span>
                </div>
                <div className="px-3 py-1 bg-slate-100 rounded-lg text-xs font-bold text-slate-700 group-hover:bg-[#FA243C] group-hover:text-white transition-colors">Play</div>
              </a>
            )}

            {release.youtubeMusicUrl && (
              <a
                href={release.youtubeMusicUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-between p-4 rounded-2xl bg-white text-slate-900 hover:scale-[1.02] transition-transform shadow-lg shadow-red-500/10 group"
              >
                <div className="flex items-center gap-3">
                  <svg className="w-6 h-6 text-[#FF0000]" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="12" cy="12" r="12" />
                    <circle cx="12" cy="12" r="8" fill="white" />
                    <path d="M10 7l7 5-7 5V7z" fill="#FF0000" />
                  </svg>
                  <span className="font-bold">YouTube Music</span>
                </div>
                <div className="px-3 py-1 bg-slate-100 rounded-lg text-xs font-bold text-slate-700 group-hover:bg-[#FF0000] group-hover:text-white transition-colors">Play</div>
              </a>
            )}
            
            {/* Fallback if no links are added yet (shouldn't happen on RELEASED status normally) */}
            {!release.spotifyUrl && !release.appleMusicUrl && !release.youtubeMusicUrl && (
              <div className="p-4 bg-slate-800 rounded-2xl border border-slate-700 text-slate-400 text-sm italic">
                Link streaming sedang diproses. Silakan kembali lagi nanti.
              </div>
            )}
          </div>

          {/* Other Platforms (Static) */}
          <div className="mt-8 pt-6 border-t border-slate-700/50 w-full">
            <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-4">Juga Tersedia Di</p>
            <div className="flex flex-wrap justify-center gap-x-5 gap-y-3 px-2">
              {['TikTok', 'Instagram', 'Amazon Music', 'Joox', 'Trebel', 'Tidal', 'Deezer', 'SoundCloud', 'Pandora', 'Tencent', 'Boomplay', 'Audiomack'].map((plat) => (
                <span key={plat} className="text-[11px] font-bold text-slate-500/60 transition-colors">
                  {plat}
                </span>
              ))}
            </div>
          </div>
        </div>
        
        <div className="bg-slate-900/80 p-4 border-t border-slate-800 flex justify-center">
          <Link href="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
            <span className="text-[10px] font-bold tracking-widest uppercase">Powered by</span>
            <span className="text-sm font-black tracking-tight">BREAKOUT.ID</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
