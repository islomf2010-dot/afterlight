import { createContext, useEffect, useMemo, type ReactNode } from 'react';
import { probeCapabilities, resolveBudget, type Capabilities, type QualityBudget } from './capabilities';
import { applyRuntimeFlags, runtimeFlags, useSettingsStore } from '@/store/useSettingsStore';

/**
 * Probed once at module load, shared by the whole app.
 *
 * Probing must happen before the first frame so the canvas can be created with
 * the right context attributes and the right initial DPR — waiting for a React
 * effect would mean rendering one frame at the wrong settings.
 *
 * The probe also mirrors the result onto `runtimeFlags` and the settings store
 * so the render loop and the UI agree from the first frame.
 */
export const capabilities: Capabilities = probeCapabilities();

runtimeFlags.tier = capabilities.tier;
runtimeFlags.webgl = capabilities.webgl;
runtimeFlags.systemReducedMotion = capabilities.systemReducedMotion;
if (typeof capabilities.dprCap === 'number') runtimeFlags.dprCap = capabilities.dprCap;

const CapabilitiesContext = createContext<Capabilities>(capabilities);

export const CapabilitiesProvider = ({ children }: { children: ReactNode }) => {
  const value = useMemo(() => capabilities, []);
  useEffect(() => {
    const state = useSettingsStore.getState();
    useSettingsStore.getState().applyDeviceProfile({
      tier: capabilities.tier,
      webgl: capabilities.webgl,
      systemReducedMotion: capabilities.systemReducedMotion,
      dprCap: capabilities.dprCap,
    });
    applyRuntimeFlags({ ...state, ...useSettingsStore.getState() });
  }, []);
  return <CapabilitiesContext.Provider value={value}>{children}</CapabilitiesContext.Provider>;
};

/**
 * Resolves the active quality budget. Subscribes to the two settings that
 * affect it; returns a fresh object only when they actually change, so scenes
 * that memoise on this do not rebuild geometry on every render.
 */
export const useQualityBudget = (): QualityBudget => {
  const quality = useSettingsStore((s) => s.quality);
  const dprCap = useSettingsStore((s) => s.dprCap);
  return useMemo(() => {
    const budget = resolveBudget(quality, runtimeFlags.tier as 0 | 1 | 2);
    return { ...budget, dpr: Math.min(budget.dpr, dprCap) };
  }, [quality, dprCap]);
};
