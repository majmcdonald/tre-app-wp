import { setCategory } from './category'
import { clearListData } from './list'
import { setCurrentStep } from './step'
import { renderListData, showListSection } from './views'
import { setDBListInfoType } from './database'

const handleCategoryChange = () => {
  const category = parseInt(document.querySelector('#list-category-select').value)
  setCategory(category)

  setDBListInfoType('template', {
    id: 0,
    desc: ''
  })

  clearListData()
  setCurrentStep('List')
  renderListData()
  showListSection()
}

export { handleCategoryChange }
