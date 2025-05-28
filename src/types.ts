export interface SessionResult {
  athleteName: string;
  startOrder: number;
  finalTime: number | null;
  splits?: number[];
}
