module Theme
  def self.from_hue(theme_hue)
    {
      primary_color: to_color(theme_hue, 90, 70),
      accent_color: to_color(theme_hue, 90, 80),
      light_color: to_color(theme_hue, 10, 99),
      dark_color: { red: 51, green: 51, blue: 51, alpha: 255 }
    }
  end

  private

  def self.to_color(*hsv)
    h = hsv[0].to_f / 60
    s = hsv[1].to_f / 100
    v = hsv[2].to_f / 100
    hi = h.to_i % 6

    f = h - h.to_i
    p = 255 * v * (1 - s)
    q = 255 * v * (1 - (s * f))
    t = 255 * v * (1 - (s * (1 - f)))
    v *= 255

    case hi
      when 0
        return format_color(v, t, p)
      when 1
        return format_color(q, v, p)
      when 2
        return format_color(p, v, t)
      when 3
        return format_color(p, q, v)
      when 4
        return format_color(t, p, v)
      when 5
        return format_color(v, p, q)
      else
        return nil
    end
  end

  def self.format_color(r, g, b)
    {
      red: r.to_i,
      green: g.to_i,
      blue: b.to_i,
      alpha: 255
    }
  end
end
