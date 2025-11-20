import { BASE44_API_URL, BASE44_API_KEY } from '../constants';
import { GameProgress, INITIAL_PROGRESS } from '../types';

const HEADERS = {
  'api_key': BASE44_API_KEY,
  'Content-Type': 'application/json'
};

export const apiService = {
  /**
   * Fetches the user's game progress.
   * If no entity exists, it creates one and returns the initial state.
   */
  fetchProgress: async (): Promise<GameProgress> => {
    try {
      const response = await fetch(BASE44_API_URL, { headers: HEADERS });
      if (!response.ok) throw new Error(`Failed to fetch progress: ${response.statusText}`);
      
      const data = await response.json();
      
      // If data exists and is an array with at least one item, return the first one.
      if (Array.isArray(data) && data.length > 0) {
        return data[0] as GameProgress;
      }

      // If no data, create the initial entity
      return await apiService.createProgress();
    } catch (error) {
      console.error("Error fetching progress:", error);
      throw error;
    }
  },

  /**
   * Creates a new progress entity.
   */
  createProgress: async (): Promise<GameProgress> => {
    try {
      const response = await fetch(BASE44_API_URL, {
        method: 'POST',
        headers: HEADERS,
        body: JSON.stringify(INITIAL_PROGRESS)
      });
      
      if (!response.ok) throw new Error(`Failed to create progress: ${response.statusText}`);
      
      const data = await response.json();
      return data as GameProgress;
    } catch (error) {
      console.error("Error creating progress:", error);
      throw error; // Propagate error to be handled by UI
    }
  },

  /**
   * Updates an existing progress entity.
   */
  updateProgress: async (progress: GameProgress): Promise<GameProgress> => {
    if (!progress._id) {
      console.warn("Cannot update progress without an ID. Attempting to create instead.");
      return apiService.createProgress();
    }

    try {
      // Destructure _id out of the body payload, standard REST practice not to send immutable ID in body if unnecessary, 
      // but helpful to clean payload.
      const { _id, ...updateData } = progress;

      const response = await fetch(`${BASE44_API_URL}/${_id}`, {
        method: 'PUT',
        headers: HEADERS,
        body: JSON.stringify(updateData)
      });

      if (!response.ok) throw new Error(`Failed to update progress: ${response.statusText}`);
      
      const data = await response.json();
      return data as GameProgress;
    } catch (error) {
      console.error("Error updating progress:", error);
      throw error;
    }
  }
};