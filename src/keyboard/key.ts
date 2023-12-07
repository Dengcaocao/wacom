import type Application from '@/actions/application'
import type { ExtendContainer } from '@/actions/types'

function handleKeydown (this: Application, e: KeyboardEvent) {
  const key = e.code === 'Space' ? e.code.toLowerCase() : e.key.toLowerCase()
  this.keys.push(key)
  switch (true) {
    case ['backspace', 'delete'].includes(key): {
      const textarea = document.querySelector('textarea')
      if (textarea) return
      return this.app.stage.removeChild(this.container as ExtendContainer)
    }
    case e.ctrlKey && key === 'c': {
      return this.copy()
    }
  }
}

function handleKeyup (this: Application, e: KeyboardEvent) {
  const key = e.code === 'Space' ? e.code.toLowerCase() : e.key.toLowerCase()
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
