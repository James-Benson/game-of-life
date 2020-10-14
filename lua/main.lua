require 'components/TextInput'
require 'components/Button'
require 'views/Menu'
require 'views/Map'

function love.load()
  FONT_SIZE = 20
  FONT = love.graphics.newFont(FONT_SIZE)
  TEXT_H = FONT_SIZE * 1.3
  INIT_WIDTH = 900
  INIT_HEIGHT = TEXT_H*20

  love.window.maximize()
  MAX_WIDTH, MAX_HEIGHT = love.graphics.getDimensions()
  MAX_RES = MAX_WIDTH .. '*' .. MAX_HEIGHT
  love.window.updateMode(1,1)
  MIN_WIDTH, MIN_HEIGHT = love.graphics.getDimensions()
  MIN_RES = MIN_WIDTH .. '*' .. MIN_HEIGHT
  love.window.updateMode(INIT_WIDTH, INIT_HEIGHT)

  
  math.randomseed(os.time())

  love.graphics.setFont(FONT)

  state = 'menu'
  map = false
  menu = Menu:new()
  
  love.window.setTitle('Conway\'s Game of Life')
end

function love.update(dt)
  if state == 'menu' then
    menu:update(dt)
  elseif state == 'play' then
    map:update(dt)
  end
end

function love.draw()
  if state == 'menu' then
    menu:draw()
  else
    map:draw()
  end
end

function love.mousepressed(x, y, button, istouch, presses)
  if state == 'menu' then
    menu:mousepressed(x, y, button, istouch, presses)
  else
    map:mousepressed(x, y, button, istouch, presses)
  end
end

function love.keypressed(key, scancode, isrepeat)
  if state == 'menu' then
    menu:keypressed(key, scancode, isrepeat)
  else
    map:keypressed(key, scancode, isrepeat)
  end
end

function love.textinput(text)
  if state == 'menu' then
    menu:textinput(text)
  end
end