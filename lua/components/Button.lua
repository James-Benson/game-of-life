Button = {}

--[[
    x: number
    X coord of top left of button
    
    y: number
    Y coord of top left of button
    
    w: number
    Width of button

    h: number
    Height of button

    text: string
    Text on button

    callBack: function
    Function executed when button is clicked
--]]

function Button:new(x, y, w, h, text, callBack)
  local o = {}
  
  o.text = love.graphics.newText(FONT, text)
  o.x = x
  o.y = y
  o.w = w or o.text:getWidth()
  o.h = h

  o.callBack = callBack
  
  self.__index = self
  return setmetatable(o, self)
end

function Button:draw()
  -- love.graphics.print(self.text, self.x, self.y)
  love.graphics.draw(self.text, self.x, self.y)
  love.graphics.rectangle('line', self.x, self.y, self.w, self.h)
end

function Button:mousepressed(x, y, button, istouch, presses)
  if button == 1 then
    if
    x >= self.x and x <= self.x + self.w and
    y >= self.y and y <= self.y + self.h then
      self.callBack()
    end
  end
end