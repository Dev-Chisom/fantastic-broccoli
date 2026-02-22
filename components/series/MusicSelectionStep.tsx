'use client';

import { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import { Tabs } from '@/components/ui/Tabs';
import WizardLayout from '@/components/wizard/WizardLayout';
import { useCreateSeries } from '@/contexts/CreateSeriesContext';
import { musicApi, type MusicPresetItem, type MusicLibraryItem } from '@/lib/api/music';
import { Skeleton } from '@/components/ui/Skeleton';
import { useToast } from '@/contexts/ToastContext';

function formatDuration(seconds?: number): string {
  if (seconds == null) return '—';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function MusicSelectionStep() {
  const { state, update, stepErrors } = useCreateSeries();
  const [tab, setTab] = useState<'preset' | 'library' | 'custom'>(
    state.musicMode === 'preset' ? 'preset' : state.musicMode === 'library' ? 'library' : 'custom'
  );
  const [presets, setPresets] = useState<MusicPresetItem[]>([]);
  const [library, setLibrary] = useState<MusicLibraryItem[]>([]);
  const [presetsLoading, setPresetsLoading] = useState(true);
  const [libraryLoading, setLibraryLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { error: showError, success: showSuccess } = useToast();

  useEffect(() => {
    let cancelled = false;
    setPresetsLoading(true);
    musicApi
      .getPresets()
      .then((list) => {
        if (!cancelled) setPresets(list);
      })
      .catch(() => {
        if (!cancelled) setPresets([]);
      })
      .finally(() => {
        if (!cancelled) setPresetsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (tab !== 'library') return;
    let cancelled = false;
    setLibraryLoading(true);
    musicApi
      .getLibrary({})
      .then((list) => {
        if (!cancelled) setLibrary(list);
      })
      .catch(() => {
        if (!cancelled) setLibrary([]);
      })
      .finally(() => {
        if (!cancelled) setLibraryLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [tab]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { id, url } = await musicApi.upload(file);
      update('customUploadUrl', url);
      update('libraryTrackId', id);
      showSuccess('Track uploaded');
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  return (
    <WizardLayout
      title="Music Selection"
      description="Set the mood with preset tracks, your library, or a custom upload."
    >
      <Tabs
        activeTab={tab}
        onTabChange={(id) => {
          setTab(id as 'preset' | 'library' | 'custom');
          update('musicMode', id as 'preset' | 'library' | 'custom');
        }}
        tabs={[
          {
            id: 'preset',
            label: 'Preset Music',
            content: (
              <div className="space-y-3">
                {stepErrors.presetMood && (
                  <p className="text-sm text-rose-400">{stepErrors.presetMood}</p>
                )}
                {presetsLoading ? (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {[1, 2, 3, 4].map((i) => (
                      <Skeleton key={i} className="h-20 rounded-xl" />
                    ))}
                  </div>
                ) : (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {presets.map((mood) => (
                      <Card
                        key={mood.id}
                        selected={state.presetMood === mood.mood}
                        onClick={() => update('presetMood', mood.mood)}
                      >
                        <h3 className="text-sm font-medium text-slate-50">{mood.name}</h3>
                        <p className="mt-1 text-xs text-slate-400">
                          Curated tracks for {mood.mood.toLowerCase()} content
                        </p>
                      </Card>
                    ))}
                  </div>
                )}
                {!presetsLoading && presets.length === 0 && (
                  <p className="text-sm text-slate-500">No presets available.</p>
                )}
              </div>
            ),
          },
          {
            id: 'library',
            label: 'Select From Library',
            content: (
              <div className="space-y-3">
                {stepErrors.libraryTrackId && (
                  <p className="text-sm text-rose-400">{stepErrors.libraryTrackId}</p>
                )}
                {libraryLoading ? (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {[1, 2, 3, 4].map((i) => (
                      <Skeleton key={i} className="h-16 rounded-xl" />
                    ))}
                  </div>
                ) : (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {library.map((track) => (
                      <Card
                        key={track.id}
                        selected={state.libraryTrackId === track.id}
                        onClick={() => update('libraryTrackId', track.id)}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="text-sm font-medium text-slate-50">{track.name}</h3>
                            <p className="mt-1 text-xs text-slate-400">
                              {track.mood} · {formatDuration(track.durationSeconds)}
                            </p>
                          </div>
                          {track.url && (
                            <a
                              href={track.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="rounded-full bg-white/10 p-1.5 text-slate-300 hover:bg-white/20"
                              aria-label="Preview"
                              onClick={(e) => e.stopPropagation()}
                            >
                              ▶
                            </a>
                          )}
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
                {!libraryLoading && library.length === 0 && (
                  <p className="text-sm text-slate-500">No tracks in your library yet.</p>
                )}
              </div>
            ),
          },
          {
            id: 'custom',
            label: 'Custom Upload',
            content: (
              <div className="space-y-4">
                <div className="rounded-xl border border-dashed border-white/20 bg-white/[0.02] p-8 text-center">
                  <p className="text-sm text-slate-400">
                    Drag and drop MP3 or WAV here, or click to upload
                  </p>
                  <input
                    type="file"
                    accept=".mp3,.wav"
                    className="mt-2 text-xs text-slate-500"
                    onChange={handleFileSelect}
                    disabled={uploading}
                  />
                  {uploading && (
                    <p className="mt-2 text-xs text-slate-400">Uploading…</p>
                  )}
                </div>
                <Input
                  label="Or paste TikTok sound URL"
                  placeholder="https://www.tiktok.com/music/..."
                  value={state.tiktokSoundUrl}
                  error={stepErrors.customUploadUrl}
                  onChange={(e) => update('tiktokSoundUrl', e.target.value)}
                />
              </div>
            ),
          },
        ]}
      />
    </WizardLayout>
  );
}
