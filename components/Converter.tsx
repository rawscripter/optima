'use client';

import { useState } from 'react';
import { DropZone } from './DropZone';
import { PresetSelector } from './PresetSelector';
import { CustomControls } from './CustomControls';
import { ImageQueue } from './ImageQueue';
import { ConvertButton } from './ConvertButton';
import { ResultsPanel } from './ResultsPanel';
import { PreviewModal } from './PreviewModal';
import { SavePresetModal } from './SavePresetModal';
import { useFileQueue } from '@/hooks/useFileQueue';
import { useClientPreview } from '@/hooks/useClientPreview';
import { useConversion } from '@/hooks/useConversion';
import { useSavedPresets } from '@/hooks/useSavedPresets';
import { PRESETS } from '@/lib/presets';
import type { Preset, CustomSettings, FileEntry } from '@/types';

const DEFAULT_CUSTOM: CustomSettings = {
  width: null,
  height: null,
  fit: 'inside',
  quality: 95,
  effort: 4,
  lossless: false,
  nearLossless: false,
  smartSubsample: true,
  sharpPreset: 'photo',
  animated: false,
};

export function Converter() {
  const [selectedPreset, setSelectedPreset] = useState<Preset>(PRESETS[1]);
  const [customSettings, setCustomSettings] = useState<CustomSettings>(DEFAULT_CUSTOM);
  const [previewEntry, setPreviewEntry] = useState<FileEntry | null>(null);
  const [showSaveModal, setShowSaveModal] = useState(false);

  const { files, addFiles, removeFile, clearAll, updateEntry } = useFileQueue();
  useClientPreview(files, selectedPreset.quality, updateEntry);
  const { isConverting, progress, convertAll, downloadZip } = useConversion(files, updateEntry);
  const { savedPresets, savePreset, deletePreset } = useSavedPresets();

  const hasDone = files.some((f) => f.status === 'done');
  const hasConvertible = files.some((f) => f.status === 'pending' || f.status === 'error');

  // When selecting a saved preset, populate customSettings from it so CustomControls reflects its values
  const handlePresetChange = (preset: Preset) => {
    setSelectedPreset(preset);
    if (preset.id !== 'custom' && !PRESETS.find((p) => p.id === preset.id)) {
      // It's a saved preset — treat like custom (show controls with its values)
      const { id: _id, label: _label, description: _desc, ...settings } = preset;
      setCustomSettings(settings as CustomSettings);
    }
  };

  const activeSettings: CustomSettings =
    selectedPreset.id === 'custom' || !PRESETS.find((p) => p.id === selectedPreset.id)
      ? customSettings
      : selectedPreset;

  const showCustomControls =
    selectedPreset.id === 'custom' || !PRESETS.find((p) => p.id === selectedPreset.id);

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-6 pb-20">
      <DropZone onFiles={addFiles} disabled={isConverting} />

      <PresetSelector
        selected={selectedPreset}
        onChange={handlePresetChange}
        savedPresets={savedPresets}
        onDeleteSaved={deletePreset}
        onSaveRequest={() => setShowSaveModal(true)}
      />

      {showCustomControls && (
        <CustomControls settings={customSettings} onChange={setCustomSettings} />
      )}

      {files.length > 0 && (
        <>
          <ImageQueue
            files={files}
            onRemove={removeFile}
            onClear={clearAll}
            onPreview={setPreviewEntry}
          />

          <ConvertButton
            onClick={() => convertAll(selectedPreset, activeSettings)}
            isConverting={isConverting}
            progress={progress}
            disabled={!hasConvertible}
            hasDone={hasDone}
          />

          <ResultsPanel
            files={files}
            onDownloadZip={() => downloadZip(selectedPreset, activeSettings)}
            preset={selectedPreset}
            customSettings={activeSettings}
          />
        </>
      )}

      {previewEntry && (
        <PreviewModal entry={previewEntry} onClose={() => setPreviewEntry(null)} />
      )}

      {showSaveModal && (
        <SavePresetModal
          settings={customSettings}
          onSave={savePreset}
          onClose={() => setShowSaveModal(false)}
        />
      )}
    </div>
  );
}
