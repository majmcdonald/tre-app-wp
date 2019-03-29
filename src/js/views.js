import { initPrevList, getListData, sortListData, removeListItem } from './list'
import { getFilters } from './filters'
import { initPrevRanking } from './rank'
import { initPrevResult } from './result'
import { getCategory } from './category'

const renderPreviousSession = () => {
  const prevData = JSON.parse(localStorage.getItem('saveData'))

  const containerEl = document.querySelector('.resume-session-container')
  containerEl.textContent = ''

  if (prevData !== null) {
    const step = prevData.step
    const data = prevData.data
    const category = prevData.category

    if (data.length > 0 && step !== 'Start') {
      const containerEl = document.querySelector('.resume-session-container')

      const rowEl = document.createElement('div')
      rowEl.classList.add('row')

      const colEl1 = document.createElement('div')
      colEl1.classList.add('col', 's3')

      const colEl2 = document.createElement('div')
      colEl2.classList.add('col', 's6')

      const colEl3 = document.createElement('div')
      colEl3.classList.add('col', 's3')

      const cardEl = document.createElement('div')
      cardEl.classList.add('card', 'blue-grey', 'darken-1')

      const contentEl = document.createElement('div')
      contentEl.classList.add('card-content', 'white-text')

      // const titleEl = document.createElement('span')
      // titleEl.classList.add('card-title')
      // titleEl.textContent = 'Welcome Back!'

      const textEl = document.createElement('p')
      textEl.textContent = `You have a previous ${step} session available. Want to continue?`

      const actionEl = document.createElement('div')
      actionEl.classList.add('card-action')

      const linkEl = document.createElement('a')
      linkEl.textContent = 'Continue'
      linkEl.href = '#'

      const dismissEl = document.createElement('a')
      dismissEl.href = '#'
      dismissEl.textContent = 'Dismiss'

      linkEl.addEventListener('click', () => {
        if (step === 'List') {
          initPrevList(category, data)
          // showListSection()
        } else if (step === 'Rank') {
          initPrevRanking(category, data)
          // showRankSection()
        } else if (step === 'Result') {
          initPrevResult(category, data)
          // showResultSection()
        }
      })

      dismissEl.addEventListener('click', () => {
        dismissWelcomeBack()
      })

      actionEl.appendChild(linkEl)
      actionEl.appendChild(dismissEl)

      // contentEl.appendChild(titleEl)
      contentEl.appendChild(textEl)

      cardEl.appendChild(contentEl)
      cardEl.appendChild(actionEl)

      colEl2.appendChild(cardEl)

      rowEl.appendChild(colEl1)
      rowEl.appendChild(colEl2)
      rowEl.appendChild(colEl3)

      containerEl.appendChild(rowEl)
      containerEl.setAttribute('style', 'border-bottom: 1px solid rgba(160,160,160,0.2)')
    }
  }
}

const dismissWelcomeBack = () => {
  const element = document.querySelector('.resume-session-container')
  element.textContent = ''
  element.setAttribute('style', 'border-bottom: none')

  // this could eventually clear the session data from LocalStorage
}

const renderListData = () => {
  const data = getListData()
  const filters = getFilters()

  const listEl = document.querySelector('#list-items')

  // filter based on text input
  let filteredList = data.filter((item) => item.name.toLowerCase().includes(filters.searchText.toLowerCase()))
  // sort the list
  filteredList = sortListData(filteredList, filters.sortBy)

  listEl.innerHTML = ''

  if (filteredList.length > 0) {
    filteredList.forEach((item) => {
      const itemEl = generateListDataDOM(item)
      listEl.appendChild(itemEl)
    })
    listEl.classList.add('collection')
  }
}

// Generate DOM for each item in createList
const generateListDataDOM = (item) => {
  const itemEl = document.createElement('li')
  itemEl.classList.add('collection-item')

  const itemNameEl = document.createElement('span')
  itemNameEl.textContent = item.name

  const iconEl = document.createElement('a')
  iconEl.classList.add('secondary-content')
  iconEl.href = '#!'
  iconEl.innerHTML = '<i class="material-icons">delete</i>'
  iconEl.addEventListener('click', (e) => {
    removeListItem(item.id)
    renderListData()
  })

  itemEl.appendChild(itemNameEl)
  itemEl.appendChild(iconEl)

  return itemEl
}

// Step Tab visibility
const showStepTab = (step) => {
  document.querySelector(`#${step}-tab`).classList.add('step-tab--available')
  updateTabIndicator()
}

const showListNav = () => {
  document.querySelector('#list-tab').classList.add('step-tab--available')
  updateTabIndicator()
}

const showRankNav = () => {
  document.querySelector('#rank-tab').classList.add('step-tab--available')
  updateTabIndicator()
}

const showResultNav = () => {
  document.querySelector('#result-tab').classList.add('step-tab--available')
  updateTabIndicator()
}

const hideStepTab = (step) => {
  closeTooltip(`${step}`)
  document.querySelector(`#${step}-tab`).classList.remove('step-tab--available')
  updateTabIndicator()
}

const hideListNav = () => {
  closeTooltip('list')
  document.querySelector('#list-tab').classList.remove('step-tab--available')
  updateTabIndicator()
}

const hideRankNav = () => {
  closeTooltip('rank')
  document.querySelector('#rank-tab').classList.remove('step-tab--available')
  updateTabIndicator()
}

const hideResultNav = () => {
  // closeTooltip('result')
  document.querySelector('#result-tab').classList.remove('step-tab--available')
  updateTabIndicator()
}

// Section Visibility
const onShowStartSection = () => {
  hideListNav()
  hideRankNav()
  hideResultNav()

  const category = getCategory()
  if (category !== 0) {
    showListNav()
  }
}

const onShowListSection = () => {
  hideRankNav()
  hideResultNav()

  const list = getListData()
  if (list.length > 0) {
    showRankNav()
  }
}

// const showRankSection = () => {
//   document.querySelector('#list-container').classList.add('inactive')
//   document.querySelector('#list-container').classList.remove('active')
//   document.querySelector('#rank-container').classList.add('active')
//   document.querySelector('#rank-container').classList.remove('inactive')
//   document.querySelector('#result-container').classList.add('inactive')
//   document.querySelector('#result-container').classList.remove('active')
//   document.querySelector('#start-container').classList.add('inactive')
//   document.querySelector('#start-container').classList.remove('active')
//   document.querySelector('#step-nav__start').classList.remove('step-nav--current')
//   document.querySelector('#step-nav__list').classList.remove('step-nav--current')
//   document.querySelector('#step-nav__rank').classList.add('step-nav--current')
//   document.querySelector('#step-nav__result').classList.remove('step-nav--current')

//   hideResultNav()
//   showRankNav()
// }

// const showResultSection = () => {
//   document.querySelector('#list-container').classList.add('inactive')
//   document.querySelector('#list-container').classList.remove('active')
//   document.querySelector('#rank-container').classList.add('inactive')
//   document.querySelector('#rank-container').classList.remove('active')
//   document.querySelector('#result-container').classList.add('active')
//   document.querySelector('#result-container').classList.remove('inactive')
//   document.querySelector('#start-container').classList.add('inactive')
//   document.querySelector('#start-container').classList.remove('active')
//   document.querySelector('#step-nav__start').classList.remove('step-nav--current')
//   document.querySelector('#step-nav__list').classList.remove('step-nav--current')
//   document.querySelector('#step-nav__rank').classList.remove('step-nav--current')
//   document.querySelector('#step-nav__result').classList.add('step-nav--current')

//   showResultNav()
// }

const updateTabIndicator = () => {
  const tabs = M.Tabs.getInstance(document.querySelector('#step-tabs'))
  tabs.updateTabIndicator()
}

const selectTab = (tab) => {
  const tabs = M.Tabs.getInstance(document.querySelector('#step-tabs'))
  tabs.select(`${tab}-container`)
}

const openTooltip = (tab) => {
  const tip = M.Tooltip.getInstance(document.querySelector(`#${tab}-tab-link`))
  tip.open()
}

const closeTooltip = (tab) => {
  const tip = M.Tooltip.getInstance(document.querySelector(`#${tab}-tab-link`))
  tip.close()
}

export {
  renderPreviousSession,
  onShowListSection,
  // showRankSection,
  // showResultSection,
  renderListData,
  onShowStartSection,
  showListNav,
  hideListNav,
  showRankNav,
  hideRankNav,
  showResultNav,
  hideResultNav,
  updateTabIndicator,
  selectTab,
  openTooltip
}
