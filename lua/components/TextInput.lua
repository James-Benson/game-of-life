TextInput = {}

--[[
    x: number
    X coord of top left of box

    y: number
    Y coord of top left of box

    w: number
    Width of box

    h: number
    Height of box

    defaultText?: string
    Initial text

    label?: string
    Label displayed above box

    charLimit?: number
    Maximum number of characters

    number?: boolean

--]]

function TextInput:new(x, y, w, h, defaultText, label, charLimit, number)
  local o = {}
  o.x = x
  o.y = y
  o.w = w
  o.h = h
  o.text = defaultText or ''
  o.label = label or ''
  o.charLimit = charLimit or false
  o.number = number or false
  
  o.displayText = o.text
  o.active = false
  o.time = 0
  
  self.__index = self
  return setmetatable(o, self)
end

function TextInput:update(dt)
  if self.active then
    self.time = self.time + dt
    if self.time < 0.5 then
      self.displayText = self.text .. '|'
    elseif self.time < 1 then
      self.displayText = self.text
    else
      self.time = 0
    end
  else
    self.displayText = self.text
  end
end

function TextInput:draw()
  if self.label:len() > 0 then
    love.graphics.print(self.label, self.x, self.y - TEXT_H)
  end
  love.graphics.rectangle('line', self.x, self.y, self.w, self.h)
  love.graphics.print(self.displayText, self.x, self.y)
end

function TextInput:mousepressed(x, y, button, istouch, presses)
  if button == 1 then
    if
    x >= self.x and x <= self.x + self.w and
    y >= self.y and y <= self.y + self.h then
      self.active = true
    else
      self.active = false
    end
  end
end

function TextInput:textinput(text)
  if self.active then
    if not self.charLimit or self.text:len() < self.charLimit then
      if self.number and text:match('%d') then
        if tonumber(self.text) == 0 then
          self.text = text
        else
          self.text = self.text .. text
        end
      elseif not self.number then
        self.text = self.text .. text
      end
    end
  end
end

function TextInput:keypressed(key, scancode, isrepeat)
  if self.active then
    if key == 'backspace' then
      if self.number and self.text:len() == 1 then
        self.text = '0'
      else
        self.text = self.text:sub(1, self.text:len() - 1)
      end
    end
  end
end