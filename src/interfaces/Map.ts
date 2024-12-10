export interface Map {
  m_GameObject: MGameObject;
  m_Enabled: number;
  m_Script: MGameObject;
  m_Name: string;
  mapData: {
    topNeighbourId: number;
    bottomNeighbourId: number;
    leftNeighbourId: number;
    rightNeighbourId: number;
    cellsData: CellsData[];
  };
}

export interface MGameObject {
  m_FileID: number;
  m_PathID: number;
}

export interface CellsData {
  cellNumber: number;
  speed: number;
  mapChangeData: number;
  moveZone: boolean;
  linkedZone: number;
  mov: boolean;
  los: boolean;
  nonWalkableDuringFight: boolean;
  nonWalkableDuringRP: boolean;
  farmCell: boolean;
  visible: boolean;
  havenbagCell: boolean;
  floor: boolean;
  red: boolean;
  blue: boolean;
  arrow: number;
}

export enum Constants {
  WIDTH = 1300,
  HEIGHT = 975,
  MAP_WIDTH = 14,
  CELL_WIDTH = 86,
  CELL_HALF_WIDTH = CELL_WIDTH / 2,
  CELL_HEIGHT = 43,
  CELL_HALF_HEIGHT = CELL_HEIGHT / 2,
  CELL_DOUBLE_HEIGHT = CELL_HEIGHT * 2,
  CELL_OFFSET = -16.5,
}