export type Unit = "m" | "mm" | "%" | "deg" | "count" | "m2" | "m3" | "L" | "kg";

export type NumberField = {
  kind: "number";
  key: string;
  label: string;
  unit: Unit;
  defaultValue: number;
  min?: number;
  max?: number;
  step?: number;
  hint?: string;
  presets?: { label: string; value: number }[];
  showWhen?: { key: string; in: string[] };
};

export type SelectField = {
  kind: "select";
  key: string;
  label: string;
  defaultValue: string;
  options: { value: string; label: string }[];
  hint?: string;
  showWhen?: { key: string; in: string[] };
};

export type SectionField = {
  kind: "section";
  label: string;
  showWhen?: { key: string; in: string[] };
};

export type Field = NumberField | SelectField | SectionField;

export type ResultRow = {
  label: string;
  value: string;
  hint?: string;
  tone?: "default" | "strong" | "warn" | "ok";
};

export type ResultSection = {
  title: string;
  rows: ResultRow[];
};

export type Kpi = {
  label: string;
  value: string;
};

export type OrderItem = {
  item: string;
  qty: string;
};

export type Flag = {
  tone: "ok" | "warn" | "bad";
  text: string;
};

export type CalcOutput = {
  headline: string;
  kpis: Kpi[];
  sections: ResultSection[];
  notes: string[];
  order?: OrderItem[];
  flags?: Flag[];
  diagram?: DiagramSpec;
};

export type DiagramSpec =
  | {
      type: "stairs";
      totalRise: number;
      totalGoing: number;
      riser: number;
      going: number;
      nRisers: number;
    }
  | {
      type: "pitch";
      rise: number;
      run: number;
      rafter: number;
      angle: number;
    }
  | {
      type: "deck";
      length: number;
      width: number;
      nBoards: number;
      nJoists: number;
    }
  | {
      type: "balustrade";
      length: number;
      height: number;
      nPosts: number;
      infill: string;
    }
  | {
      type: "roof";
      span: number;
      length: number;
      pitch: number;
      roofType: string;
    };

export type Inputs = Record<string, number | string>;

export type Category =
  | "Carpentry"
  | "Roofing"
  | "Wet trades"
  | "Site"
  | "Fit-out"
  | "Setout & Measuring";

export type Calculator = {
  slug: string;
  name: string;
  short: string;
  category: Category;
  featured?: boolean;
  compute: (inputs: Inputs) => CalcOutput;
  fields: Field[];
};
