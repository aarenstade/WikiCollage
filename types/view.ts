// x, y
// width
// height
// zoom (default 1, multiplies width/height)

// [0,0                ]
//          [   ]
//          [   ]
// [            10k,10k]

export interface ViewControl {
  x: number;
  y: number;
  width?: number;
  height?: number;
  zoom: number;
}
