import { useState, useEffect, useMemo } from "react";
import { tournamentService } from "../services/tournament.service";
import type { TournamentStatus } from "../interfaces";

interface TournamentStatusMap {
  [key: string]: string; // statusId -> statusName
}

// Cache global para compartir entre instancias del hook
let globalStatusMap: TournamentStatusMap = {};
let globalLoading = true;
let loadPromise: Promise<void> | null = null;

const loadStatuses = async (): Promise<void> => {
  if (loadPromise) {
    return loadPromise;
  }

  loadPromise = (async () => {
    try {
      const result = await tournamentService.searchStatus();
      if (result.ok && result.data) {
        // Handle different response structures
        const statuses = result.data.data || result.data;
        if (Array.isArray(statuses)) {
          const map: TournamentStatusMap = {};
          statuses.forEach((status: TournamentStatus) => {
            map[status.id] = status.name;
          });
          globalStatusMap = map;
        }
      }
    } catch (error) {
      console.error("Error loading tournament statuses:", error);
    } finally {
      globalLoading = false;
    }
  })();

  return loadPromise;
};

export const useTournamentStatus = () => {
  const [statusMap, setStatusMap] = useState<TournamentStatusMap>(globalStatusMap);
  const [loading, setLoading] = useState(globalLoading);

  useEffect(() => {
    const updateState = () => {
      setStatusMap({ ...globalStatusMap });
      setLoading(globalLoading);
    };

    if (!globalLoading && Object.keys(globalStatusMap).length > 0) {
      // Si ya están cargados, usar los datos del cache
      updateState();
      return;
    }

    // Cargar si aún no se han cargado
    loadStatuses().then(() => {
      updateState();
    });
  }, []);

  const getStatusName = (statusId: string | null | undefined): string | null => {
    if (!statusId) return null;
    // Usar el estado local primero, luego el global como fallback
    return statusMap[statusId] || globalStatusMap[statusId] || null;
  };

  return { statusMap, loading, getStatusName };
};

