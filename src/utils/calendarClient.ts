export const getEventColor = (
  id: string
): { background: string; foreground: string } => {
  const eventColors = {
    "1": {
      background: "#7986cb",
      foreground: "#ffffff",
    },
    "2": {
      background: "#33b679",
      foreground: "#ffffff",
    },
    "3": {
      background: "#8e24aa",
      foreground: "#ffffff",
    },
    "4": {
      background: "#e67c73",
      foreground: "#ffffff",
    },
    "5": {
      background: "#f6c026",
      foreground: "#ffffff",
    },
    "6": {
      background: "#f5511d",
      foreground: "#ffffff",
    },
    "7": {
      background: "#039be5",
      foreground: "#ffffff",
    },
    "8": {
      background: "#616161",
      foreground: "#ffffff",
    },
    "9": {
      background: "#3f51b5",
      foreground: "#ffffff",
    },
    "10": {
      background: "#0b8043",
      foreground: "#ffffff",
    },
    "11": {
      background: "#d60000",
      foreground: "#ffffff",
    },
  } as { [key: string]: { background: string; foreground: string } };
  const eventColor =
    id in eventColors
      ? eventColors[id]
      : {
          background: "#039be5",
          foreground: "#ffffff",
        };

  return eventColor;
};
