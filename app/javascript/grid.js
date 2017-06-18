export const COLOURS = ['red', 'green', 'blue', 'yellow'];
const MAX_X = 10;
const MAX_Y = 10;

export class Block {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.colour = COLOURS[Math.floor(Math.random() * COLOURS.length)];
  }
}

export class BlockGrid {
  constructor() {
    this.grid = [];

    for (let x = 0; x < MAX_X; x++) {
      let col = [];
      for (let y = 0; y < MAX_Y; y++) {
        col.push(new Block(x, y));
      }

      this.grid.push(col);
    }

    return this;
  }

  render(el = document.querySelector('#gridEl')) {
    for (let x = 0; x < MAX_X; x++) {
      let id = 'col_' + x;
      let colEl = document.createElement('div');
      colEl.className = 'col';
      colEl.id = id;
      el.appendChild(colEl);

      for (let y = MAX_Y - 1; y >= 0; y--) {
        let block = this.grid[x][y],
          id = `block_${x}x${y}`,
          blockEl = document.createElement('div');

        blockEl.id = id;
        blockEl.className = 'block';
        blockEl.style.background = block.colour;
        blockEl.addEventListener('click', evt => this.blockClicked(evt, block));
        colEl.appendChild(blockEl);
      }
    }

    return this;
  }

  clearGrid() {
    document.querySelector('#gridEl').innerHTML = '';
    return this;
  }

  blockClicked(e, block) {
    const { x, y, colour } = block;
    if (colour !== null) {
      this.removeBlock(x, y, colour)
        .makeBlocksFall()
        .clearGrid()
        .render();
    }
  }

  removeBlock(x, y, colour) {
    if (this.grid[x] && this.grid[x][y] && this.grid[x][y].colour === colour) {
      this.grid[x][y].colour = null;
      this.removeBlock(x + 1, y, colour);
      this.removeBlock(x - 1, y, colour);
      this.removeBlock(x, y + 1, colour);
      this.removeBlock(x, y - 1, colour);
    }

    return this;
  }

  makeBlocksFall() {
    for (let x = 0; x < MAX_X; x++) {
      for (let y = MAX_Y - 1; y >= 0; y--) {
        let z = y;
        while (this.grid[x][z].colour === null && this.grid[x][z + 1]) {
          this.grid[x][z].colour = this.grid[x][z + 1].colour;
          this.grid[x][z + 1].colour = null;
          z++;
        }
      }
    }
    return this;
  }
}

window.addEventListener('DOMContentLoaded', () => new BlockGrid().render());
