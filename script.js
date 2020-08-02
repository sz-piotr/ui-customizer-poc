function makeStyle(selectorOrSelectors, props) {
  const content = [...Object.entries(props)]
    .map(([key, value]) => `  ${toKebabCase(key)}: ${value};`)
    .join('\n')
  const selectors = Array.isArray(selectorOrSelectors) ? selectorOrSelectors : [selectorOrSelectors]
  return `${selectors.join(',\n')} {\n${content}\n}`
}

function joinStyles(...styles) {
  return styles.join('\n\n')
}

function withMedia(query, styles) {
  const content = styles
    .split('\n')
    .map(line => `  ${line}`)
    .join('\n')
  return `@media ${query} {\n${content}\n}`
}

function toKebabCase(camelCase) {
  return camelCase.replace(/([A-Z])/g, "-$1").toLowerCase()
}

// ..................

const PRIMARY_BLUE = {
  primaryColor: 'rgb(68, 71, 255)',
  primaryColorDarker: 'rgb(56, 58, 174)',
}

const PRIMARY_RED = {
  primaryColor: 'rgb(217, 79, 79)',
  primaryColorDarker: 'rgb(174, 48, 48)',
}

const PRIMARY_MINT = {
  primaryColor: 'rgb(98, 179, 125)',
  primaryColorDarker: 'rgb(44, 153, 80)',
}

let config = {
  ...PRIMARY_BLUE,
  borderRadius: '4px',
  buttonCorners: 'circle',
  buttonBorders: 'none',
}

function makeButtonStyles(selector, config) {
  console.log(selector, config)
  const props = {
    padding: '8px 16px',
    fontSize: '16px',
    lineHeight: '16px',
    backgroundColor: config.primaryColor,
    color: 'white',
    border: 'none',
    boxShadow: '0 2px 5px 0 rgba(0, 0, 0, 0.3)',
    transition: '0.1s ease-in-out',
    cursor: 'pointer',
  }

  if (config.buttonCorners === 'rounded') {
    props.borderRadius = config.borderRadius
  } else if (config.buttonCorners === 'circle') {
    props.borderRadius = '16px'
  }

  if (config.buttonBorders === 'normal') {
    props.padding = '6px 14px'
    props.border = '2px solid black'
  } else if (config.buttonBorders === 'inverted') {
    props.padding = '6px 14px'
    props.border = `2px solid ${config.primaryColor}`
    props.color = config.primaryColor
    props.backgroundColor = 'white'
  }

  return joinStyles(
    makeStyle(`${selector}`, props),
    makeStyle(`${selector}:active`, {
      backgroundColor: config.primaryColorDarker,
      boxShadow: '0 2px 2px 0 rgba(0, 0, 0, 0.3)',
    }),
  )
}

function updateStyles(configOverride) {
  config = { ...config, ...configOverride }
  const styles = joinStyles(
    makeButtonStyles('.showcase-button-colors-blue', {
      ...config,
      ...PRIMARY_BLUE,
    }),
    makeButtonStyles('.showcase-button-colors-red', {
      ...config,
      ...PRIMARY_RED,
    }),
    makeButtonStyles('.showcase-button-colors-mint', {
      ...config,
      ...PRIMARY_MINT,
    }),
    makeButtonStyles('.showcase-button-corners-circle', {
      ...config,
      buttonCorners: 'circle'
    }),
    makeButtonStyles('.showcase-button-corners-rounded', {
      ...config,
      buttonCorners: 'rounded'
    }),
    makeButtonStyles('.showcase-button-corners-square', {
      ...config,
      buttonCorners: 'square'
    }),
    makeButtonStyles('.showcase-button-borders-none', {
      ...config,
      buttonBorders: 'none'
    }),
    makeButtonStyles('.showcase-button-borders-normal', {
      ...config,
      buttonBorders: 'normal'
    }),
    makeButtonStyles('.showcase-button-borders-inverted', {
      ...config,
      buttonBorders: 'inverted'
    }),
  )
  console.log(styles)
  styleElement.innerHTML = styles
}

const styleElement = document.createElement('style')
document.querySelector('head').appendChild(styleElement)
updateStyles({})

window.addEventListener('load', () => {
  setupListener('#button-colors-blue', PRIMARY_BLUE)
  setupListener('#button-colors-red', PRIMARY_RED)
  setupListener('#button-colors-mint', PRIMARY_MINT)

  setupListener('#button-corners-circle', { buttonCorners: 'circle' })
  setupListener('#button-corners-rounded', { buttonCorners: 'rounded' })
  setupListener('#button-corners-square', { buttonCorners: 'square' })

  setupListener('#button-borders-none', { buttonBorders: 'none' })
  setupListener('#button-borders-normal', { buttonBorders: 'normal' })
  setupListener('#button-borders-inverted', { buttonBorders: 'inverted' })
})

function setupListener(selector, configOverride) {
  document.querySelector(selector)
    .addEventListener('change', () => updateStyles(configOverride))
}
