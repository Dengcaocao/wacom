import './contextMenu.css'
import pinia from '@/stores'
import { useConfigStore } from '@/stores/config'
import { toRaw } from 'vue'

const config = useConfigStore(pinia)

interface IMenu {
  title: string
  value: string
  status: boolean
}

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

document.addEventListener('contextmenu', e => {
  e.preventDefault()
  handleCloseMenu()
  if ((<HTMLElement>e.target).tagName !== 'CANVAS') return
  const menuContainer = document.createElement('div')
  menuContainer.setAttribute('class', 'context-menu-container')
  menuContainer.addEventListener('click', handleMenuClick)
  menuContainer.innerHTML = getInnerText()
  document.body.appendChild(menuContainer)
  const { width, height } = getComputedStyle(menuContainer)
  const x = window.innerWidth - e.x < parseInt(width) ? e.x - parseInt(width) : e.x
  const y = window.innerHeight - e.y < parseInt(height) ? e.y - parseInt(height) : e.y
  menuContainer.setAttribute('style', `top: ${y}px; left: ${x}px;`)
})

document.addEventListener('click', handleCloseMenu)
