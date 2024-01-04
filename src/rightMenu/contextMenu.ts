import './contextMenu.css'
import pinia from '@/stores'
import { useConfigStore } from '@/stores/config'
import { toRaw } from 'vue'

interface IMenu {
  title: string
  value: string
  status: boolean
}

const config = useConfigStore(pinia)

const menuList: IMenu[] = [
  {
    title: '隐藏/显示网格',
    value: 'mesh',
    status: true
  }
]

const getInnerText = () => {
  return menuList.reduce((preContent, menu) => {
    return preContent += `
      <div class="menu-item" data-value="${menu.value}">
        <i class="iconfont ${menu.status ? 'icon-tuya_huabanfuben' : 'ml-5'}"></i>
        ${menu.title}
      </div>
    `
  }, '')
}

const handleCloseMenu = () => {
  const menuContainer = document.querySelector('.context-menu-container')
  if (menuContainer) menuContainer.parentNode?.removeChild(menuContainer)
}

const handleMenuClick = (e: Event) => {
  const target = <HTMLElement>e.target
  if (target.className !== 'menu-item') return
  const { value } = target.dataset
  const menu = menuList.find(menu => menu.value === value) as IMenu
  menu.status = !menu.status
  const parentNode = <HTMLElement>target.parentNode
  parentNode.innerHTML = getInnerText()
  const pixiApp = toRaw(config.pixiApp)
  const meshElm = pixiApp.app.stage.getChildByName('mesh')
  pixiApp.createMesh(!meshElm)
  handleCloseMenu()
}

const handContextmenu = (e: MouseEvent) => {
  e.preventDefault()
  handleCloseMenu()
  if ((<HTMLElement>e.target).tagName !== 'CANVAS') return
  const menuContainer = document.createElement('div')
  menuContainer.setAttribute('class', 'context-menu-container')
  menuContainer.addEventListener('click', handleMenuClick)
  menuContainer.addEventListener('touchstart', handleMenuClick)
  menuContainer.innerHTML = getInnerText()
  document.body.appendChild(menuContainer)
  const { width, height } = getComputedStyle(menuContainer)
  const x = window.innerWidth - e.x < parseInt(width) ? e.x - parseInt(width) : e.x
  const y = window.innerHeight - e.y < parseInt(height) ? e.y - parseInt(height) : e.y
  menuContainer.setAttribute('style', `top: ${y}px; left: ${x}px;`)
}

const handleLongpress = (e: TouchEvent & { x?: number, y?: number }) => {
  handleCloseMenu()
  return setTimeout(() => {
    if (e.changedTouches.length > 1) return
    const { clientX, clientY } = e.changedTouches[0]
    e.x = clientX, e.y = clientY
    handContextmenu(<any>e)
  }, 800)
}

// pc
document.addEventListener('contextmenu', handContextmenu)
document.addEventListener('click', handleCloseMenu)

// 移动
let timer: number | undefined
document.addEventListener('touchstart', e => timer = handleLongpress(e))
document.addEventListener('touchmove', () => clearTimeout(timer))
document.addEventListener('touchend', () => clearTimeout(timer))
