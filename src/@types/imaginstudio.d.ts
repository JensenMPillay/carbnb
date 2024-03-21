export type resultODModel = {
  basemodel: string;
};

export type PaintCombination = {
  paintSwatch: {
    primary: {
      colourCluster: string;
    };
  };
  mapped: {
    [key: string]: {
      paintDescription: string;
      nativePaintDescriptions: string[];
    };
  };
};

export type PaintCombinations = Record<string, PaintCombination>;

export type ColorsMap = Record<string, string[]>;
