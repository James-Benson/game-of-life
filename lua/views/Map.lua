Map = {}

--[[
    gridSize: number
    Width/height of grid in cells

    cellSize: number
    Width/height of cells in pixels

    odds: number
    Percentage chance of each cell starting on

    fps: number
    Cycles per second
--]]

function Map:new(gridSize, cellSize, odds, fps)
  local o = {}

  o.gridSize = gridSize
  o.cellSize = cellSize
  o.odds = odds
  o.fps = fps

  o.time = 0
  o.grid = {}
  for x = 1, o.gridSize do
    o.grid[x] = {}
    for y = 1, o.gridSize do
      o.grid[x][y] = math.random(0, 100) < o.odds and 1 or 0
    end
  end

  self.__index = self
  return setmetatable(o, self)
end

function Map:update(dt)
  self.time = self.time + dt
  if self.time > 1 / self.fps then
    self.time = 0
    local newGrid = {}

    for x = 1, self.gridSize do
      newGrid[x] = {}
      for y = 1, self.gridSize do
        sum = 0
        for i = x-1, x+1 do
          for j = y-1, y+1 do
            if
            i >= 1 and i <= self.gridSize and
            j >= 1 and j <= self.gridSize and
            (i ~= x or j ~= y) then
              sum = sum + self.grid[i][j]
            end
          end
        end
        
        if self.grid[x][y] == 1 and sum == 2 or sum == 3 then
          newGrid[x][y] = 1
        else
          newGrid[x][y] = 0
        end
      end
    end
    self.grid = newGrid
  end
end

function Map:draw()
  for x = 1, self.gridSize do
    for y = 1, self.gridSize do
      if self.grid[x][y] == 1 then
        love.graphics.rectangle('fill', (x-1) * self.cellSize, (y-1) * self.cellSize, self.cellSize, self.cellSize)
      end
    end
  end
end

function Map:mousepressed(x, y, button, istouch, presses)
  if button == 1 then
    x, y = math.floor(x / self.cellSize)+1, math.floor(y / self.cellSize)+1
    map.grid[x][y] = math.abs(1 - map.grid[x][y])
  end
end

function Map:keypressed(key, scancode, isrepeat)
  if key == 'space' then
    if state == 'pause' then
      state = 'play'
    elseif state == 'play' then
      state = 'pause'
    end

  elseif key == 'escape' then
    love.window.updateMode(INIT_WIDTH, INIT_HEIGHT)
    state = 'menu'
  end
end