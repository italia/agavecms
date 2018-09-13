import toCss from 'utils/toCss'

let oldColors = null

export default function updateColors(store) {
  const { ui } = store.getState()
  const colors = ui.previewColors || ui.colors

  if (colors === oldColors) {
    return
  }

  oldColors = colors

  document.body.style.setProperty('--primary-color', toCss(colors.primaryColor))
  document.body.style.setProperty('--accent-color', toCss(colors.accentColor))
  document.body.style.setProperty(
    '--slightly-transparent-accent-color',
    toCss(colors.accentColor).replace(/rgb/, 'rgba').replace(/\)/, ', 0.7)')
  )
  document.body.style.setProperty(
    '--semi-transparent-accent-color',
    toCss(colors.accentColor).replace(/rgb/, 'rgba').replace(/\)/, ', 0.1)')
  )
  document.body.style.setProperty('--light-color', toCss(colors.lightColor))
  document.body.style.setProperty('--dark-color', toCss(colors.darkColor))
}
