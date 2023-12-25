import type Application from '@/actions/application'
import type { ExtendContainer } from '@/actions/types'

function handleKeydown (this: Application, e: KeyboardEvent) {
  if ((<HTMLElement>e.target).tagName !== 'BODY') return
  const key = e.code === 'Space' ? e.code.toLowerCase() : e.key.toLowerCase()
  this.keys.push(key)
  if (key === 'space') this.app.stage.cursor = 'grabbing'
  switch (true) {
    case ['backspace', 'delete'].includes(key): {
      this.app.stage.removeChild(<ExtendContainer>this.container)
      return this.container = undefined
    }
    case e.ctrlKey && key === 'c': {
      return this.copy()
    }
  }
}

function handleKeyup (this: Application, e: KeyboardEvent) {
  const key = e.code === 'Space' ? e.code.toLowerCase() : e.key.toLowerCase()
  if (key === 'space') this.app.stage.cursor = 'default'
  this.keys = this.keys.filter(itemKey => itemKey !== key)
}

export function installKeyboardEvent (this: Application) {
  document.addEventListener('keydown', handleKeydown.bind(this))
  document.addEventListener('keyup', handleKeyup.bind(this))
}

export function removeKeyboardEvent (this: Application) {
  document.removeEventListener('keydown', handleKeydown.bind(this))
  document.removeEventListener('keyup', handleKeyup.bind(this))
}
