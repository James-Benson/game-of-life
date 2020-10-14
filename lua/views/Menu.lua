Menu = {}

function Menu:new()
  local o = {}

  local function updateGrid()
    if map then
      map.cellSize = tonumber(o.textInputs.cellSize.text)
      map.fps = tonumber(o.textInputs.fps.text)
    else
      map = Map:new(
        tonumber(o.textInputs.gridSize.text),
        tonumber(o.textInputs.cellSize.text),
        tonumber(o.textInputs.odds.text),
        tonumber(o.textInputs.fps.text)
      )
    end
    love.window.updateMode(map.gridSize * map.cellSize, map.gridSize * map.cellSize)
    state='pause'
  end
  
  local function newGrid()
    map = false
    updateGrid()
  end
  
  o.textInputs = {
    odds = TextInput:new(TEXT_H, TEXT_H*5, 100, TEXT_H, '50', 'Percentage of cells to start live*', 3, true),
    gridSize = TextInput:new(TEXT_H, TEXT_H*8, 100, TEXT_H, '100', 'Width/height of grid in cells*', 4, true),
    cellSize = TextInput:new(TEXT_H, TEXT_H*11, 100, TEXT_H, '10', 'Width/height of cells in pixels', 4, true),
    fps = TextInput:new(TEXT_H, TEXT_H*14, 100, TEXT_H, '30', 'Cycles per second', 3, true)
  }
  o.buttonInputs = {
    updateButton = Button:new(TEXT_H, TEXT_H*16, false, TEXT_H, 'Update current grid >', updateGrid),
    startButton = Button:new(TEXT_H, TEXT_H*18, false, TEXT_H, 'New grid >', newGrid)
  }

  o.windowSize = 0
  o.disabled = false

  self.__index = self
  return setmetatable(o, self)
end

function Menu:update(dt)
  self.windowSize = tonumber(self.textInputs.gridSize.text) * tonumber(self.textInputs.cellSize.text)
  self.disabled =
    self.windowSize == 0 or
    self.windowSize > MAX_HEIGHT or
    self.windowSize < MIN_WIDTH or
    self.textInputs.fps.text == '0'

  for k, textInput in pairs(self.textInputs) do
    textInput:update(dt)
  end
end

function Menu:draw()
  love.graphics.print('Esc: Quit from menu, or go to menu from grid', TEXT_H, TEXT_H)
  love.graphics.print('Space: Play/pause grid', TEXT_H, TEXT_H*2)
  love.graphics.print('*Requires new grid to apply', 400, TEXT_H*7)

  local windowSizeString = self.windowSize .. '*' .. self.windowSize
  love.graphics.print('Resulting grid size: ' .. windowSizeString .. 'pixels', 400, TEXT_H*10)
  if self.windowSize > MAX_HEIGHT then
    love.graphics.print('This is bigger than your screen: ' .. MAX_RES .. 'pixels', 400, TEXT_H*11)
  end
  if self.windowSize < MIN_WIDTH then
    love.graphics.print('Below minimum window size: ' .. MIN_RES .. 'pixels', 400, TEXT_H*11)
  end

  for k, textInput in pairs(self.textInputs) do
    textInput:draw()
  end
  if not self.disabled then
    for k, buttonInput in pairs(self.buttonInputs) do
      buttonInput:draw()
    end
  end
end

function Menu:mousepressed(x, y, button, istouch, presses)
  for k, textInput in pairs(self.textInputs) do
    textInput:mousepressed(x, y, button, istouch, presses)
  end
  if not self.disabled then
    for k, buttonInput in pairs(self.buttonInputs) do
      buttonInput:mousepressed(x, y, button, istouch, presses)
    end
  end
end

function Menu:keypressed(key, scancode, isrepeat)
  if key == 'escape' then
    love.event.quit()
  end

  for k, textInput in pairs(self.textInputs) do
    textInput:keypressed(key, scancode, isrepeat)
  end
end

function Menu:textinput(text)
  for k, textInput in pairs(self.textInputs) do
    textInput:textinput(text)
  end
end