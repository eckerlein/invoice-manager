export type TauriDragDropEvent = {
  event: string; // "tauri://drag-drop"
  payload: {
    paths: string[]; // Array of file paths
    position: {
      x: number; // x-coordinate of the cursor
      y: number; // y-coordinate of the cursor
    };
  };
  id: number; // Event ID
};
