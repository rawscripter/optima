'use client';

import { useState } from 'react';
import { DropZone } from './DropZone';
import { PresetSelector } from './PresetSelector';
import { CustomControls } from './CustomControls';
import { RenamePanel } from './RenamePanel';
import { ImageQueue } from './ImageQueue';
import { ConvertButton } from './ConvertButton';
import { ResultsPanel } from './ResultsPanel';
import { PreviewModal } from './PreviewModal';
import { SavePresetModal } from './SavePresetModal';
import { WooPackButton } from './WooPackButton';
import { CropModal } from './CropModal';
import { useFileQueue } from '@/hooks/useFileQueue';
import { useClientPreview } from '@/hooks/useClientPreview';
import { useConversion } from '@/hooks/useConversion';
import { useSavedPresets } from '@/hooks/useSavedPresets';
import { useRenameSettings } from '@/hooks/useRenameSettings';
import { useClipboardPaste } from '@/hooks/useClipboardPaste';
import { PRESETS, PRESET_IDS } from '@/lib/presets';
import type { Preset, CustomSettings, FileEntry } from '@/types';

const DEFAULT_CUSTOM: CustomSettings = {
  width: null, height: null, fit: 'inside',
  quality: 95, effort: 4,
  lossless: false, nearLossless: false, smartSubsample: true, sharpPreset: 'photo',
  animated: false, targetSizeKB: null,
  outputFormat: 'webp', preserveMetadata: false,
};

export function Converter() {
  const [selectedPreset, setSelectedPreset] = useState<Preset>(PRESETS[1]);
  const [customSettings, setCustomSettings] = useState<CustomSettings>(DEFAULT_CUSTOM);
  const [previewEntry, setPreviewEntry] = useState<FileEntry | null>(null);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [cropModalEntry, setCropModalEntry] = useState<FileEntry | null>(null);

  const { files, addFiles, removeFile, clearAll, updateEntry, reorderFiles } = useFileQueue();
  useClientPreview(files, selectedPreset.quality, updateEntry);
  useClipboardPaste(addFiles);
  const { isConverting, progress, convertAll, downloadZip } = useConversion(files, updateEntry);
  const { savedPresets, savePreset, deletePreset } = useSavedPresets();
  const { renameSettings, setRenameSettings } = useRenameSettings();

  const handlePresetChange = (preset: Preset) => {
    setSelectedPreset(preset);
    if (!PRESET_IDS.has(preset.id)) {
      const { id: _id, label: _l, description: _d, ...rest } = preset;
      setCustomSettings(rest as CustomSettings);
    }
  };

  const isCustomOrSaved = !PRESET_IDS.has(selectedPreset.id) || selectedPreset.id === 'custom';
  const activeSettings: CustomSettings = isCustomOrSaved ? customSettings : selectedPreset;
  const activeFit = isCustomOrSaved ? customSettings.fit : selectedPreset.fit;

  const hasDone = files.some((f) => f.status === 'done');
  const hasConvertible = files.some((f) => f.status === 'pending' || f.status === 'error');
  const firstDoneName = files.find((f) => f.status === 'done')?.file.name;

  return (
    <div className="flex flex-col gap-5 pb-20">
      <DropZone onFiles={addFiles} disabled={isConverting} />

      <PresetSelector
        selected={selectedPreset}
        onChange={handlePresetChange}
        savedPresets={savedPresets}
        onDeleteSaved={deletePreset}
        onSaveRequest={() => setShowSaveModal(true)}
      />

      {isCustomOrSaved && (
        <CustomControls settings={customSettings} onChange={setCustomSettings} />
      )}

      <RenamePanel
        settings={renameSettings}
        onChange={setRenameSettings}
        exampleName={firstDoneName ?? files[0]?.file.name}
      />

      {files.length > 0 && (
        <>
          <ImageQueue
            files={files}
            onRemove={removeFile}
            onClear={clearAll}
            onPreview={setPreviewEntry}
            onReorder={reorderFiles}
            showCropButton={activeFit === 'cover'}
            onCrop={(id) => { const e = files.find(f => f.id === id); if (e) setCropModalEntry(e); }}
          />

          <ConvertButton
            onClick={() => convertAll(selectedPreset, activeSettings, renameSettings)}
            isConverting={isConverting}
            progress={progress}
            disabled={!hasConvertible}
            hasDone={hasDone}
          />

          <WooPackButton files={files} renameSettings={renameSettings} />

          <ResultsPanel
            files={files}
            onDownloadZip={() => downloadZip(selectedPreset, activeSettings, renameSettings)}
            preset={selectedPreset}
            customSettings={activeSettings}
          />
        </>
      )}

      {previewEntry && <PreviewModal entry={previewEntry} onClose={() => setPreviewEntry(null)} />}
      {showSaveModal && (
        <SavePresetModal settings={customSettings} onSave={savePreset} onClose={() => setShowSaveModal(false)} />
      )}
      {cropModalEntry && (
        <CropModal
          src={cropModalEntry.objectURL}
          targetWidth={isCustomOrSaved ? (customSettings.width ?? 1000) : (selectedPreset.width ?? 1000)}
          targetHeight={isCustomOrSaved ? (customSettings.height ?? 1000) : (selectedPreset.height ?? 1000)}
          initialCx={cropModalEntry.cropCx ?? 0.5}
          initialCy={cropModalEntry.cropCy ?? 0.5}
          onConfirm={(cx, cy) => updateEntry(cropModalEntry.id, { cropCx: cx, cropCy: cy })}
          onClose={() => setCropModalEntry(null)}
        />
      )}
    </div>
  );
}
