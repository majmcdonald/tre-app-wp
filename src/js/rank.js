import uuidv4 from 'uuid'
import { showRankSection, showResultNav } from './views'
import { renderResult } from './result'
import { disableArrowKeyScroll, saveData } from './functions'
import { createListObject } from './list'
import { setCategory } from './category'
import { setCurrentStep } from './step'

let rankData = {}
let rankDataHistory = []

const initPrevRanking = (category, data) => {
  disableArrowKeyScroll()

  populateRankData(true, data)
  setCurrentStep('Rank')
  setCategory(category)

  showComparison()
  showRankSection()
}

const populateRankData = (r, data) => {
  // Set up rankData Object
  rankData = {
    masterList: r ? data.masterList : [],
    sortList: r ? data.sortList : [],
    parent: r ? data.parent : [-1],
    rec: r ? data.rec : [],
    deletedItems: r ? data.deletedItems : [],
    cmp1: r ? data.cmp1 : 0,
    cmp2: r ? data.cmp2 : 0,
    head1: r ? data.head1 : 0,
    head2: r ? data.head2 : 0,
    nrec: r ? data.nrec : 0,
    numQuestion: r ? data.numQuestion : 1,
    totalSize: r ? data.totalSize : 0,
    finishSize: r ? data.finishSize : 0,
    finishFlag: r ? data.finishFlag : 0,
    bggFlag: r ? data.bggFlag : 0,
    finalListID: r ? data.finalListID : 0
  }
  saveData(rankData)
}

const getRankData = () => rankData

const initRanking = (itemsList, category) => {
  disableArrowKeyScroll()
  populateRankData(false)

  rankData.masterList = itemsList
  setCategory(category)

  // Reset counts and percents
  rankData.masterList.forEach((item) => {
    item.showCount = 0
    item.voteCount = 0
    item.voteShowPct = 0
  })

  // initialize sorting lists
  let n = 0
  let mid

  rankData.sortList[n] = []

  for (let i = 0; i < rankData.masterList.length; i++) {
    rankData.sortList[n][i] = i
  }

  // rankData.masterList.forEach((item, index) => {
  //   rankData.sortList[n][index] = index
  // })

  n++

  for (let i = 0; i < rankData.sortList.length; i++) {
    // initialize sortList
    if (rankData.sortList[i].length >= 2) {
      mid = Math.ceil(rankData.sortList[i].length / 2)
      rankData.sortList[n] = []
      rankData.sortList[n] = rankData.sortList[i].slice(0, mid)
      rankData.totalSize += rankData.sortList[n].length
      rankData.parent[n] = i
      n++
      rankData.sortList[n] = []
      rankData.sortList[n] = rankData.sortList[i].slice(mid, rankData.sortList[i].length)
      rankData.totalSize += rankData.sortList[n].length
      rankData.parent[n] = i
      n++
    }
  }
  // initialize rec
  rankData.masterList.forEach((item) => {
    rankData.rec.push(0)
  })

  rankData.cmp1 = rankData.sortList.length - 2
  rankData.cmp2 = rankData.sortList.length - 1

  setCurrentStep('Rank')

  saveData(rankData)

  resetHistory()
  showComparison()
}

const getComparisonInfo = () => {
  if (rankData.cmp1 < 1) {
    return {}
  } else {
    const item1Ref = rankData.sortList[rankData.cmp1][rankData.head1]
    const item2Ref = rankData.sortList[rankData.cmp2][rankData.head2]

    return {
      item1Ref: item1Ref,
      item2Ref: item2Ref,
      item1Name: rankData.masterList[item1Ref].name,
      item2Name: rankData.masterList[item2Ref].name
    }
  }
}

const showComparison = () => {
  const { item1Name, item2Name } = getComparisonInfo()

  document.querySelector('#item-1').textContent = item1Name
  document.querySelector('#item-2').textContent = item2Name
}

const handlePick = (flag) => {
  if (rankData.cmp1 >= 1) {
    setHistory()

    const { item1Ref, item2Ref } = getComparisonInfo()
    const item1 = rankData.masterList[item1Ref]
    const item2 = rankData.masterList[item2Ref]

    // Update showCounts
    item1.showCount++
    item2.showCount++

    // Update correct voteCount
    if (flag === -1) {
      item1.voteCount++
    } else {
      item2.voteCount++
    }

    updateVoteShowPct()

    // setPreviousItems
    saveRec(flag, 'handlePick')
    sortList()
    rankData.numQuestion++
  }

  cmpCheck()

  saveData(rankData)

  // saveRankData()
}

const saveRec = (flag, source) => {
  if (flag < 0) {
    rankData.rec[rankData.nrec] = rankData.sortList[rankData.cmp1][rankData.head1]
    if (source === 'sortList') {
      rankData.masterList[rankData.sortList[rankData.cmp1][rankData.head1]].showCount++
      updateVoteShowPct()
    }
    rankData.head1++
    rankData.nrec++
    rankData.finishSize++
  } else if (flag > 0) {
    rankData.rec[rankData.nrec] = rankData.sortList[rankData.cmp2][rankData.head2]
    if (source === 'sortList') {
      rankData.masterList[rankData.sortList[rankData.cmp2][rankData.head2]].showCount++
      updateVoteShowPct()
    }
    rankData.head2++
    rankData.nrec++
    rankData.finishSize++
  }
}

const sortList = () => {
  const cmp1Length = rankData.sortList[rankData.cmp1].length
  const cmp2Length = rankData.sortList[rankData.cmp2].length

  // if there are items left in head1 after head 2 is complete then put them in rec
  // else if there are items left in head2 after head 1 is complete then put them in rec
  if (rankData.head1 < cmp1Length && rankData.head2 === cmp2Length) {
    while (rankData.head1 < cmp1Length) {
      saveRec(-1, 'sortList')
    }
  } else if (rankData.head1 === cmp1Length && rankData.head2 < cmp2Length) {
    while (rankData.head2 < cmp2Length) {
      saveRec(1, 'sortList')
    }
  }

  // If you reach the end of the list of both update the parent list
  if (rankData.head1 === cmp1Length && rankData.head2 === cmp2Length) {
    for (let i = 0; i < cmp1Length + cmp2Length; i++) {
      rankData.sortList[rankData.parent[rankData.cmp1]][i] = rankData.rec[i]
    }

    rankData.sortList.pop()
    rankData.sortList.pop()
    rankData.cmp1 = rankData.cmp1 - 2
    rankData.cmp2 = rankData.cmp2 - 2
    rankData.head1 = 0
    rankData.head2 = 0

    // Initialize the rec before you make a new comparison
    if (rankData.head1 === 0 && rankData.head2 === 0) {
      for (let i = 0; i < rankData.masterList.length; i++) {
        rankData.rec[i] = 0
      }
      rankData.nrec = 0
    }
  }
}

const cmpCheck = () => {
  if (rankData.cmp1 < 0) {
    // updateProgressBar()
    showResultNav()
    rankData.finishFlag = 1
  } else {
    checkForDeletedItems()
    showComparison()
    // renderMasterList()
  }
}

const updateVoteShowPct = () => {
  // Update voteShowPcts
  rankData.masterList.forEach((item) => {
    item.voteShowPct = item.voteCount / item.showCount
  })
}

// History and Undo
const setHistory = () => {
  const rankDataJSON = JSON.stringify(rankData)
  rankDataHistory.push(rankDataJSON)
}

const resetHistory = () => {
  rankDataHistory = []
}

const handleUndo = () => {
  const historyLength = rankDataHistory.length
  if (historyLength > 0) {
    const historyJSON = rankDataHistory.pop()
    const history = JSON.parse(historyJSON)
    rankData = history
    showComparison()

    saveData(rankData)
    // renderMasterList()
  }
}

// Delete
const deleteItem = (flag) => {
  let indexToDelete
  let r
  const { item1Ref, item2Ref, item1Name, item2Name } = getComparisonInfo()

  // decide which item to delete of the two listed. Set to indexToDelete
  if (flag < 0) {
    r = confirm(`Are you sure you want to remove ${item1Name} from the ranking process?`)
    indexToDelete = item1Ref
  } else {
    r = confirm(`Are you sure you want to remove ${item2Name} from the ranking process?`)
    indexToDelete = item2Ref
  }

  // if OK then delete the item from the list, otherwise do nothing.
  if (r === true) {
    setHistory()

    rankData.deletedItems.push(indexToDelete)

    saveData(rankData)

    cmpCheck()
  }
}

const checkForDeletedItems = () => {
  let { item1Ref, item2Ref } = getComparisonInfo()

  while (rankData.deletedItems.indexOf(item1Ref) > -1 || rankData.deletedItems.indexOf(item2Ref) > -1) {
    // run while item is in deletedItems && is not at the end of cmp1
    while (rankData.deletedItems.indexOf(item1Ref) > -1 && rankData.head1 < rankData.sortList[rankData.cmp1].length) {
      saveRec(-1)
      item1Ref = rankData.sortList[rankData.cmp1][rankData.head1]
    }
    while (rankData.deletedItems.indexOf(item2Ref) > -1 && rankData.head2 < rankData.sortList[rankData.cmp2].length) {
      saveRec(1)
      item2Ref = rankData.sortList[rankData.cmp2][rankData.head2]
    }
    sortList()
  }

  // check for completion
  if (rankData.cmp1 < 0) {
    // updateProgressBar();
    showResultNav()
    rankData.finishFlag = 1
  }
}

// Add item during ranking
const addItem = (item) => {
  setHistory()
  const obj = createListObject(item, 'text', undefined, uuidv4())

  rankData.masterList.push(obj)

  if (rankData.sortList[rankData.cmp1].length < rankData.sortList[rankData.cmp2].length) {
    rankData.sortList[rankData.cmp1].unshift(rankData.masterList.length - 1)
  } else {
    rankData.sortList[rankData.cmp2].unshift(rankData.masterList.length - 1)
  }

  showComparison()

  saveData(rankData)

  // saveRankData()
}

const calcRankedList = () => {
  let list = rankData.sortList[0]
  let rankedList = []

  // filter out deleted items from sortList
  if (rankData.deletedItems) {
    list = list.filter((e) => rankData.deletedItems.indexOf(e) < 0, rankData.deletedItems)
  }

  list.forEach((item, index) => {
    let obj = rankData.masterList[list[index]]
    obj = { ...obj, rank: index + 1 }
    rankedList.push(obj)
  })

  renderResult(rankedList)
}

// -----------------------------------------------------
export { initPrevRanking, initRanking, handlePick, handleUndo, addItem, deleteItem, getRankData, calcRankedList }