import { create } from 'zustand';

export type DownloadStatus = 'queued' | 'processing' | 'completed' | 'error' | 'cancelled';

export interface DownloadItem {
  id: string;
  filename: string;
  format: string;
  progress: number; // 0 - 100
  status: DownloadStatus;
  statusMessage?: string;
  fileSize?: string;
  blob?: Blob;
  downloadUrl?: string;
  error?: string;
  createdAt: number;
  engine?: 'worker-wasm' | 'worker-native' | 'canvas-worker' | 'pdf-worker';
}

interface DownloadState {
  // Collection of all downloads
  downloads: DownloadItem[];

  // Processing Modal State
  activeModalId: string | null;
  isModalOpen: boolean;

  // Actions
  addDownload: (params: {
    filename: string;
    format: string;
    fileSize?: string;
    engine?: DownloadItem['engine'];
    initialMessage?: string;
  }) => string;

  updateDownload: (id: string, updates: Partial<DownloadItem>) => void;
  setProgress: (id: string, progress: number, statusMessage?: string) => void;
  completeDownload: (id: string, blob: Blob, customFilename?: string) => void;
  failDownload: (id: string, error: string) => void;
  cancelDownload: (id: string) => void;
  removeDownload: (id: string) => void;
  clearCompleted: () => void;

  // Modal Controls
  openModal: (id: string) => void;
  closeModal: () => void;
  minimizeModal: () => void;
  maximizeModal: (id: string) => void;

  // Direct Browser Trigger
  triggerBrowserDownload: (id: string) => void;
}

export const useDownloadStore = create<DownloadState>((set, get) => ({
  downloads: [],
  activeModalId: null,
  isModalOpen: false,

  addDownload: ({ filename, format, fileSize, engine = 'worker-wasm', initialMessage }) => {
    const id = `dl_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const newItem: DownloadItem = {
      id,
      filename,
      format: format.toUpperCase(),
      progress: 0,
      status: 'processing',
      statusMessage: initialMessage || 'Warming up export engine...',
      fileSize,
      engine,
      createdAt: Date.now(),
    };

    set((state) => ({
      downloads: [newItem, ...state.downloads],
      activeModalId: id,
      isModalOpen: true, // Default to opening modal upon export trigger
    }));

    return id;
  },

  updateDownload: (id, updates) => {
    set((state) => ({
      downloads: state.downloads.map((item) =>
        item.id === id ? { ...item, ...updates } : item
      ),
    }));
  },

  setProgress: (id, progress, statusMessage) => {
    const clampedProgress = Math.min(100, Math.max(0, Math.round(progress)));
    set((state) => ({
      downloads: state.downloads.map((item) => {
        if (item.id !== id) return item;
        return {
          ...item,
          progress: clampedProgress,
          ...(statusMessage ? { statusMessage } : {}),
          status: clampedProgress >= 100 ? 'completed' : 'processing',
        };
      }),
    }));
  },

  completeDownload: (id, blob, customFilename) => {
    const downloadUrl = URL.createObjectURL(blob);
    set((state) => ({
      downloads: state.downloads.map((item) => {
        if (item.id !== id) return item;
        return {
          ...item,
          progress: 100,
          status: 'completed',
          statusMessage: 'Export complete! File ready.',
          blob,
          downloadUrl,
          ...(customFilename ? { filename: customFilename } : {}),
        };
      }),
    }));

    // Auto-trigger browser download
    get().triggerBrowserDownload(id);
  },

  failDownload: (id, error) => {
    set((state) => ({
      downloads: state.downloads.map((item) =>
        item.id === id
          ? {
              ...item,
              status: 'error',
              error,
              statusMessage: `Failed: ${error}`,
            }
          : item
      ),
    }));
  },

  cancelDownload: (id) => {
    set((state) => {
      const item = state.downloads.find((d) => d.id === id);
      if (item?.downloadUrl) {
        try {
          URL.revokeObjectURL(item.downloadUrl);
        } catch {}
      }
      return {
        downloads: state.downloads.filter((d) => d.id !== id),
        activeModalId: state.activeModalId === id ? null : state.activeModalId,
        isModalOpen: state.activeModalId === id ? false : state.isModalOpen,
      };
    });
  },

  removeDownload: (id) => {
    set((state) => {
      const item = state.downloads.find((d) => d.id === id);
      if (item?.downloadUrl) {
        try {
          URL.revokeObjectURL(item.downloadUrl);
        } catch {}
      }
      return {
        downloads: state.downloads.filter((d) => d.id !== id),
        activeModalId: state.activeModalId === id ? null : state.activeModalId,
        isModalOpen: state.activeModalId === id ? false : state.isModalOpen,
      };
    });
  },

  clearCompleted: () => {
    set((state) => {
      state.downloads.forEach((d) => {
        if (d.status === 'completed' && d.downloadUrl) {
          try {
            URL.revokeObjectURL(d.downloadUrl);
          } catch {}
        }
      });
      return {
        downloads: state.downloads.filter((d) => d.status !== 'completed'),
      };
    });
  },

  openModal: (id) => {
    set({ activeModalId: id, isModalOpen: true });
  },

  closeModal: () => {
    set({ isModalOpen: false, activeModalId: null });
  },

  minimizeModal: () => {
    set({ isModalOpen: false });
  },

  maximizeModal: (id) => {
    set({ activeModalId: id, isModalOpen: true });
  },

  triggerBrowserDownload: (id) => {
    const item = get().downloads.find((d) => d.id === id);
    if (!item || !item.blob) return;

    const url = item.downloadUrl || URL.createObjectURL(item.blob);
    const anchor = document.createElement('a');
    anchor.style.display = 'none';
    anchor.href = url;
    anchor.download = item.filename;

    document.body.appendChild(anchor);
    anchor.click();

    setTimeout(() => {
      try {
        document.body.removeChild(anchor);
      } catch {}
    }, 1500);
  },
}));
