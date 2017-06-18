import { Block, COLOURS, BlockGrid } from './grid';
import { assert, expect } from 'chai';
import jsdom from 'jsdom-global';
import simulant from 'simulant';
let blockGrid;

const createInsertDiv = () => {
  const div = document.createElement('div');
  div.id = 'gridEl';
  document.getElementsByTagName('body')[0].appendChild(div);
}

const setColour = (blockCoordinates, colour) =>
  blockCoordinates.forEach(([x, y]) => blockGrid.grid[x][y].colour = colour);

const isColour = (blockCoordinates, colour) =>
  blockCoordinates.every(([x, y]) => blockGrid.grid[x][y].colour === colour);

describe('Block', () => {
  it('should be created with correct coordinates and one of the valid colours', () => {
    let testCoords = [[1, 2], [4, 9], [0, 0]];

    testCoords.forEach(testCoord => {
      let block = new Block(...testCoord);
      assert.equal(block.x, testCoord[0], 'x is set correctly');
      assert.equal(block.y, testCoord[1], 'y is set correctly');
      assert.ok(COLOURS.indexOf(block.colour) > -1, 'colour is valid');
    });
  });
});

describe('BlockGrid', () => {
  jsdom();
  createInsertDiv();

  beforeEach(() => {
    blockGrid = new BlockGrid().render(document.querySelector('#gridEl'));
  })

  afterEach(() => {
    blockGrid.clearGrid();
  })

  it('should be created with the correct number of blocks', () => {
    expect(document.querySelectorAll('.block')).to.have.lengthOf(100);
  })

  describe('Given a block is clicked', () => {
    it('should disappear', () => {
      simulant.fire(document.getElementById('block_0x0'), 'click');

      expect(document.getElementById('block_0x9').style.background).to.equal('');
    })
    it('should affect same colour neighbours', () => {
      setColour([[0, 0], [0, 1], [0, 2]]);
      blockGrid.render();
      
      simulant.fire(document.getElementById('block_0x0'), 'click');

      expect(isColour([[0, 9], [0, 8]], null)).to.equal(true);
    })
    it('other blocks should fall down', () => {
      setColour([[0, 0], [1, 0], [2, 0]], 'green');
      setColour([[0, 1], [1, 1], [2, 1]], 'yellow');
      blockGrid.render();

      simulant.fire(document.getElementById('block_0x0'), 'click');

      expect(isColour([[0, 0], [1, 0], [2, 0]], 'yellow')).to.equal(true);
    })
  })
});

