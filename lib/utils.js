import { Table } from 'antd'
import dayjs from 'dayjs'
// import Big from 'big.js'
let weekOfYear = require('dayjs/plugin/weekOfYear')
let quarterOfYear = require('dayjs/plugin/quarterOfYear')
let isBetween = require('dayjs/plugin/isBetween')
let duration = require('dayjs/plugin/duration')
dayjs.extend(weekOfYear)
dayjs.extend(isBetween)
dayjs.extend(duration)

// 对象类型
export function getObjType(target, type) {
	if (type) {
		return Object.prototype.toString.call(target).indexOf(type) > -1
	}

	return Object.prototype.toString.call(target)
}

export function dayjsIns(val = new Date()) {
	// dayjs('2019-01-25').format('DD/MM/YYYY')
	return dayjs(val)
}

// * 检查是否有权限
export const checkPagePermission = (item, rights) => item.key !== '/login' && rights.includes(item.key) && item.pagePermission

/**
 * 根据权限递归处理menu列表  【被权限筛选后的路由列表】
 */
export const filterMenuList = (menuList, rights) => {
	const newArr = []
	menuList.forEach(item => {
		// 是否为页面级权限
		if (checkPagePermission(item, rights)) {
			// 无子级
			if (!item?.children?.length) return newArr.push(item)
			// 有子级
			newArr.push({ ...item, children: filterMenuList(item.children, rights) })
		}
	})
	return newArr
}

/**
 * 获取需要展开的 subMenu
 */
export const getOpenKeys = path => {
	let newStr = ''
	let newArr = []
	let arr = path.split('/').map(i => '/' + i)
	for (let i = 1; i < arr.length - 1; i++) {
		newStr += arr[i]
		newArr.push(newStr)
	}
	return newArr
}

/**
 * 递归查询对应路由【根据path获取route配置项】
 */
export const searchRoute = (path, routes, child = 'children') => {
	let result = {}
	for (let item of routes) {
		if (item.path === path) return item
		if (item[child]) {
			const res = searchRoute(path, item[child], child)
			if (Object.keys(res).length) result = res
		}
	}
	return result
}

/**
 * 递归查询对应路由【根据key获取route配置项】
 */
export const searchRouteByKey = (key, routes) => {
	let result = {}
	for (let item of routes) {
		if (item.key === key) return item
		if (item.children) {
			const res = searchRouteByKey(key, item.children)
			if (Object.keys(res).length) result = res
		}
	}
	return result
}

/**
 * 根据权限路由映射路由表信息
 */
export const hasPermission = (route, rights) => {
	if (route.meta?.requiresAuth && route.path) {
		return rights.includes(route.path)
	}
	return true
}

export const filterRouteList = (routes, rights) => {
	let newArr = []
	routes.forEach(route => {
		const item = { ...route }
		if (hasPermission(item, rights)) {
			if (item.children) {
				item.children = filterRouteList(item.children, rights)
			}
			newArr.push(item)
		}
	})
	return newArr
}

/**
 * 筛选所有最低级菜单生成面包屑导航
 */
export const findAllBreadcrumb = menuList => {
	const handleBreadcrumbList = {}
	const loop = item => {
		if (item?.children?.length) item.children.forEach(loop)
		else {
			handleBreadcrumbList[item.key] = getBreadcrumbList(item.key, menuList)
		}
	}
	menuList.forEach(loop)
	return handleBreadcrumbList
}

export const getBreadcrumbList = (key, menuList) => {
	const matchMenu = menuList.find(menu => key.includes(menu.key))
	function deepChildren(menu, arr = []) {
		arr.push({ key: menu.key, label: menu.label })
		if (menu.children?.length) {
			menu.children.forEach(item => deepChildren(item, arr))
		}
		return arr
	}
	return deepChildren(matchMenu)
		.filter(item => key.includes(item.key))
		.map(item => item.label)
}

// export function downloadFile(res, fileName, fileType) {
// 	let { headers, data } = res
// 	// if (!fileName) {
// 	// 	let disposition = res.headers['content-disposition']
// 	// 	let str = strSplit(disposition, ';', 1)
// 	// 	fileName = strSplit(str, '=', 1)
// 	// 	fileName = window.decodeURI(fileName)
// 	// }
// 	debugger
// 	if (!fileType) {
// 		fileType = headers['content-type']
// 	}

// 	let blob = new Blob([data], {
// 		type: fileType
// 	})
// 	if ('download' in document.createElement('a')) {
// 		let downloadElement = document.createElement('a')
// 		let href = window.URL.createObjectURL(blob) // 创建下载的链接
// 		downloadElement.href = href
// 		downloadElement.download = fileName // 下载后文件名
// 		document.body.appendChild(downloadElement)
// 		downloadElement.click() // 点击下载
// 		document.body.removeChild(downloadElement) // 下载完成移除元素
// 		window.URL.revokeObjectURL(href) // 释放掉blob对象
// 	} else {
// 		// IE10+下载
// 		navigator.msSaveBlob(blob, fileName)
// 	}
// }

// 浏览器缓存
export function setlocalStorage(key, value) {
	window.localStorage.setItem(key, window.JSON.stringify(value))
}
export function getlocalStorage(key) {
	return window.JSON.parse(window.localStorage.getItem(key))
}
export function removelocalStorage(key) {
	window.localStorage.removeItem(key)
}
export function setsessionStorage(key, value) {
	window.sessionStorage.setItem(key, window.JSON.stringify(value))
}
export function getsessionStorage(key) {
	return window.JSON.parse(window.sessionStorage.getItem(key))
}
export function removesessionStorage(key) {
	window.sessionStorage.removeItem(key)
}
export function clone(obj) {
	return JSON.parse(JSON.stringify(obj))
}

export function swapArr(arr, index1, index2) {
	arr[index1] = arr.splice(index2, 1, arr[index1])[0]
	return arr
}

// 生成财年下拉
export function generateYear(year) {
	let minYear = parseInt(year) - 3
	let maxYear = parseInt(year) + 7
	let fsclYear = []
	for (let index = minYear; index < maxYear; index++) {
		fsclYear.push({
			label: `FY-${index.toString().substring(2, 4)}`,
			value: `FY-${index.toString()}`
		})
	}
	return fsclYear
}

// 生成当月对应周
export function generateMonthWeek(year) {
	let weeks = []
	let weekMs = new Set()
	let startDay = this.dayjsIns().startOf('month').format('D')
	let endDay = this.dayjsIns().endOf('month').format('D')
	for (let index = startDay; index <= endDay; index++) {
		let date1 = this.dayjsIns().format(`YYYY-MM`)
		let date2 = `${date1}-${index}`
		let date3 = this.dayjsIns(date2)
		let week = this.dayjsIns(date3).week()
		weeks.push({
			week: week,
			day: date2
		})
		weekMs.add(week)
	}
	let temp = {}
	weekMs.forEach(ele => {
		temp[ele] = []
		weeks.forEach(element => {
			if (ele === element.week) {
				temp[ele].push(element.day)
			}
		})
	})
	return temp
}

// 自定义聚合列样式
export function renderColumn(field, row) {
	if (row.summaryFlag && row[field]) {
		return <div className={'dot'}>{row[field]}</div>
	} else {
	}
}

// 加法
// export function accAdd(arg1, arg2) {
// 	let result = new Big(arg1).plus(arg2)
// 	return result.toNumber()
// }

// // 减法
// export function minus(arg1, arg2) {
// 	let result = new Big(arg1).minus(arg2)
// 	return result.toNumber()
// }

// // 乘法
// export function times(arg1, arg2) {
// 	let result = new Big(arg1).times(arg2)
// 	return result.toNumber()
// }

// // 除法
// export function div(arg1, arg2) {
// 	let result = new Big(arg1).div(arg2)
// 	return result.toNumber()
// }

// 分组
export function groupBy(list, field) {
	return list.reduce((group, product) => {
		if (product[field]) {
			const fVal = product[field].trim() + '----' + field
			group[fVal] = group[fVal] ?? []
			group[fVal].push(product)
		}
		return group
	}, {})
}

export function transformTreeFun(data, arr) {
	let arrIndex = 0

	const transTree = objData => {
		arrIndex++

		if (arrIndex > arr.length) return

		for (const key in objData) {
			const tempList = objData[key]
			if (arr[arrIndex]) {
				let result = groupBy(tempList, arr[arrIndex])
				objData[key] = result
				transTree(result)
				arrIndex--
			}
		}
	}
	transTree(data)
}

export function transformListFun(
	data,
	realList,
	getCustomColumnNums,
	payload,
	payloadDeep,
	datamapFieldConfig = { value: 'orderNum' }
) {
	// 控制列表显示的字段
	if (payloadDeep.config.datamapFieldConfig) {
		datamapFieldConfig = payloadDeep.config.datamapFieldConfig
	}
	let index = 0
	for (const key in data) {
		const item = data[key]

		// 判断child数据类型
		let type = Object.prototype.toString.call(item)

		let keyName = key.split('----')
		let categoryName = keyName[0]
		let categoryField = keyName[1]
		// console.log(categoryName)
		// console.log(categoryField)

		let randNum = parseInt(Math.random() * 100000)
		if (type.indexOf('Array') > -1) {
			// 计算终极列合计
			// 获取明细列
			let columns = getCustomColumnNums()
			let sums = {}
			columns.forEach((column, index2) => {
				let sum = 0
				// 计算明细列的合计值
				item.forEach(element => {
					let tempVal
					let colVal = element.dataMap[column.dataIndex]
					let colType = Object.prototype.toString.call(colVal)
					if (colType.indexOf('Object') > -1) {
						tempVal = colVal[datamapFieldConfig.value] || 0
						sum = accAdd(sum, Number(tempVal))
					} else {
						tempVal = colVal || 0
						sum = accAdd(sum, Number(tempVal))
					}
					// let tempVal = element.dataMap[column.dataIndex] || 0
					// sum = accAdd(sum, Number(tempVal))
				})

				let temp = {}
				// 注意datamapFieldConfig格式
				temp[datamapFieldConfig.value] = sum
				sums[column.dataIndex] = temp
			})

			// 最小合计列
			let sumColumn = { sourceInfo: {} }
			sumColumn.sourceInfo = { ...item[0] }
			sumColumn['summaryFlag'] = true
			sumColumn['ultimate'] = true //最终聚合标识
			if (payloadDeep.parent) {
				sumColumn['parentFields'] = [...payloadDeep.parent]
				sumColumn['parentFields'].push(categoryField)
			} else {
				sumColumn['parentFields'] = [categoryField]
			}

			// 新聚合带加载更多模式
			if (payloadDeep.config.gahterWithPageModeConfig) {
				sumColumn['subs'] = sumColumn.sourceInfo.subs
				sumColumn['key'] = sumColumn.sourceInfo.id
			} else {
				sumColumn['key'] = `${key}-${index}-${new Date().getTime()}-${randNum}` //父级分组需要自定义id
			}

			sumColumn['id'] = sumColumn['key']
			sumColumn['dataMap'] = sums
			sumColumn[categoryField] = categoryName //取子列的第一个作为父类的名称

			realList.push(sumColumn, ...item)
		}
		if (type.indexOf('Object') > -1) {
			let tempList = []
			// 计算大类下的子列数
			countColumChilds(item, tempList)

			// 获取明细列
			let columns = getCustomColumnNums()
			let sums = {}
			columns.forEach((column, index2) => {
				let sum = 0
				// 计算明细列的合计值
				tempList.forEach(element => {
					let tempVal
					let colVal = element.dataMap[column.dataIndex]
					let colType = Object.prototype.toString.call(colVal)
					if (colType.indexOf('Object') > -1) {
						tempVal = colVal[datamapFieldConfig.value] || 0
						sum = accAdd(sum, Number(tempVal))
					} else {
						tempVal = colVal || 0
						sum = accAdd(sum, Number(tempVal))
					}
					// let tempVal = element.dataMap[column.dataIndex] || 0
					// sum = accAdd(sum, Number(tempVal))
				})

				let temp = {}
				// 注意datamapFieldConfig格式
				temp[datamapFieldConfig.value] = sum
				sums[column.dataIndex] = temp
			})

			// 取第一个子数组的元素
			function getChildInfo(item) {
				for (const key in item) {
					const row = item[key]
					let rType = Object.prototype.toString.call(row)
					if (rType.indexOf('Object') > -1) {
						return getChildInfo(row)
					} else {
						return row
					}
				}
			}
			let childInfo = getChildInfo(item)

			// 合计列
			let sumColumn = { sourceInfo: {} }
			// 主要用作聚合产品编码与简介时的显示
			sumColumn.sourceInfo = { ...childInfo[0] }
			sumColumn['summaryFlag'] = true
			if (payloadDeep.parent) {
				sumColumn['parentFields'] = [...payloadDeep.parent]
				sumColumn['parentFields'].push(categoryField)
			} else {
				sumColumn['parentFields'] = [categoryField]
			}
			if (payload.level) {
				sumColumn['gatherLevel'] = payload.level
			}
			sumColumn['key'] = `${key}-${index}-${new Date().getTime()}-${randNum}` //父级分组需要自定义id
			sumColumn['id'] = sumColumn['key']
			sumColumn['dataMap'] = sums
			sumColumn[categoryField] = categoryName //取子列的第一个作为父类的名称

			realList.push(sumColumn)

			transformListFun(
				item,
				realList,
				getCustomColumnNums,
				{},
				{
					...payloadDeep,
					parent: sumColumn['parentFields']
				},
				datamapFieldConfig
			)
		}
		index++
	}
}

// 计算对应column的子列
const countColumChilds = (data, list) => {
	for (const key in data) {
		const item = data[key]

		let type = Object.prototype.toString.call(item)
		if (type.indexOf('Array') > -1) {
			list.push(...item)
		}
		if (type.indexOf('Object') > -1) {
			countColumChilds(item, list)
		}
	}
}

const eventEmitter = {
	list: {},
	$on: function (event, fn) {
		let _this = this
		// 如果对象中没有对应的 event 值，也就是说明没有订阅过，就给 event 创建个缓存列表
		// 如有对象中有相应的 event 值，把 fn 添加到对应 event 的缓存列表里
		;(_this.list[event] || (_this.list[event] = [])).push(fn)
		return _this
	},
	$emit: function () {
		let _this = this
		// 第一个参数是对应的 event 值，直接用数组的 shift 方法取出
		let event = [].shift.call(arguments)
		if (!_this.list[event]) {
			return
		}
		let fns = [..._this.list[event]]
		// 如果缓存列表里没有 fn 就返回 false
		if (!fns || fns.length === 0) {
			return false
		}
		// 遍历 event 值对应的缓存列表，依次执行 fn
		fns.forEach(fn => {
			fn.apply(_this, arguments)
		})
		return _this
	}
}
export { eventEmitter }

export function getUuid() {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
		const r = (Math.random() * 16) | 0
		const v = c === 'x' ? r : (r & 0x3) | 0x8
		return v.toString(16)
	})
}

// 获取options text
export function getOptionText(targetOptions, value, field = { value: 'value', label: 'label' }) {
	let text = '-'
	targetOptions.forEach(item => {
		if (item[field.value] === value) {
			text = item[field.label]
		}
	})

	return text
}

// 是否聚合模式标识
export function isGatherMode(CACHE) {
	let flag = false
	let gatherColumn = []
	if (CACHE) {
		// 聚合标识为true的
		gatherColumn = CACHE.configColumns.filter(item => {
			return item.gatherFlag
		})

		if (gatherColumn.length > 0) {
			flag = true
		}
	}
	return { flag, gatherColumn }
}
export function summary(pageData, pathname, objCols, datamapFieldConfig = { value: 'orderNum' }) {
	let cache = getlocalStorage(`page-${pathname}`)
	if (cache) {
		let colSpan
		if (cache.configColumns) {
			if (pathname === '/channel-modify-plan') {
				//需求计划调整特殊处理
				colSpan = objCols.prefixColumns().length
			} else {
				colSpan = cache.configColumns.filter(item => item.showFlag).length
			}
		} else {
			colSpan = objCols.prefixColumns().length
		}

		if (cache.sumFlag) {
			let summarys = []
			let cacheColumn = objCols.column()
			if (cacheColumn.length === 0 || pageData.length === 0) {
				return
			}

			// 新聚合模式
			let gahterInfo = isGatherMode(cache)
			if (objCols.mode === 'newGatherMode' && gahterInfo.flag) {
				// 计算列合计
				cacheColumn.forEach(col => {
					let tHead = col.dataIndex
					let sum = 0
					// 解决只聚合一列时 合计不显示问题
					if (gahterInfo.gatherColumn.length === 1) {
						pageData.forEach(item => {
							if (item.dataMap && item.dataMap[tHead]) {
								let summary = 0

								let type = Object.prototype.toString.call(item.dataMap[tHead])
								if (type.indexOf('Object') > -1) {
									if (item.dataMap[tHead][datamapFieldConfig.value]) {
										summary = accAdd(summary, Number(item.dataMap[tHead][datamapFieldConfig.value]))
									} else {
										summary = 0
									}
								} else {
									summary = item.dataMap[tHead] || 0
								}

								sum = accAdd(sum, summary)
							}
						})
						summarys.push(sum)
					} else {
						pageData.forEach(item => {
							if (item.gatherLevel === 1) {
								if (item.dataMap && item.dataMap[tHead]) {
									let summary = 0

									let type = Object.prototype.toString.call(item.dataMap[tHead])
									if (type.indexOf('Object') > -1) {
										if (item.dataMap[tHead][datamapFieldConfig.value]) {
											summary = accAdd(summary, Number(item.dataMap[tHead][datamapFieldConfig.value]))
										} else {
											summary = 0
										}
									} else {
										summary = item.dataMap[tHead] || 0
									}

									sum = accAdd(sum, summary)
								}
							}
						})
						summarys.push(sum)
					}
				})
			} else {
				// 计算列合计
				cacheColumn.forEach(col => {
					let tHead = col.dataIndex
					let sum = 0
					pageData.forEach(item => {
						if (!item.summaryFlag) {
							if (item.dataMap && item.dataMap[tHead]) {
								let summary = 0

								let type = Object.prototype.toString.call(item.dataMap[tHead])
								if (type.indexOf('Object') > -1) {
									if (item.dataMap[tHead][datamapFieldConfig.value]) {
										summary = accAdd(summary, Number(item.dataMap[tHead][datamapFieldConfig.value]))
									} else {
										summary = 0
									}
								} else {
									summary = item.dataMap[tHead] || 0
								}

								sum = accAdd(sum, summary)
							}
						}
					})
					summarys.push(sum)
				})
			}

			return (
				<Table.Summary fixed style={{ width: '500px' }}>
					<Table.Summary.Row>
						<Table.Summary.Cell index={0} colSpan={colSpan}>
							合计
						</Table.Summary.Cell>
						{summarys.map((item, index) => {
							return (
								<Table.Summary.Cell index={colSpan + index} key={`data${index}`}>
									{item}
								</Table.Summary.Cell>
							)
						})}
						<Table.Summary.Cell index={colSpan + summarys.length}></Table.Summary.Cell>
					</Table.Summary.Row>
				</Table.Summary>
			)
		}
	}

	return null
}

// 聚合模式下 非聚合行 同时隐藏简介和编码 明细数据也隐藏
// export function noRenderDetailCell(CACHE, row) {
// 	let hide = false
// 	if (CACHE) {
// 		let hasOneGather = CACHE.configColumns.some(item => item.gatherFlag)
// 		// 聚合模式下
// 		if (hasOneGather) {
// 			let hasOneShow = CACHE.configColumns
// 				.filter(
// 					item =>
// 						item.rowField === 'skuCode' ||
// 						item.rowField === 'skuName' ||
// 						item.rowField === 'itemId' ||
// 						item.rowField === 'itemName'
// 				)
// 				.some(item => item.showFlag)
// 			//  非聚合行 同时隐藏简介和编码 明细数据也隐藏
// 			if (!row.summaryFlag && !hasOneShow) {
// 				hide = true
// 				// return '--'
// 			}
// 		}
// 	}

// 	return hide
// }
// 聚合模式下 同时隐藏简介和编码 明细数据不加载隐藏
export function noOpenDetailCell(CACHE, row) {
	let hide = false
	if (CACHE) {
		let hasOneGather = CACHE.configColumns.some(item => item.gatherFlag)
		// 聚合模式下
		if (hasOneGather) {
			let hasOneShow = CACHE.configColumns
				.filter(
					item =>
						item.rowField === 'skuCode' ||
						item.rowField === 'skuName' ||
						item.rowField === 'itemId' ||
						item.rowField === 'itemName'
				)
				.some(item => item.showFlag)
			//  非聚合行 同时隐藏简介和编码 明细数据也隐藏
			if (row.summaryFlag && !hasOneShow) {
				hide = true
				// return '--'
			}
		}
	}

	return hide
}

// 去除数据null undefined ''
export function trimArr(arr) {
	return arr.filter(function (s) {
		return s && s.trim()
	})
}
// 这里多传一个参数，immediate用来决定是否要第一次立即执行, 默认为false
export function debounce(fn, delay = 1000, immediate = false) {
	// 实现防抖函数的核心是使用setTimeout
	// time变量用于保存setTimeout返回的Id
	let time = null
	// isImmediateInvoke变量用来记录是否立即执行, 默认为false
	let isImmediateInvoke = false

	// 将回调接收的参数保存到args数组中
	function _debounce(...args) {
		// 如果time不为0，也就是说有定时器存在，将该定时器清除
		if (time !== null) {
			clearTimeout(time)
		}

		// 当是第一次触发，并且需要触发第一次事件
		if (!isImmediateInvoke && immediate) {
			fn.apply(this, args)
			// 将isImmediateInvoke设置为true，这样不会影响到后面频繁触发的函数调用
			isImmediateInvoke = true
		}

		time = setTimeout(() => {
			// 使用apply改变fn的this，同时将参数传递给fn
			fn.apply(this, args)
			// 当定时器里的函数执行时，也就是说是频繁触发事件的最后一次事件
			// 将isImmediateInvoke设置为false，这样下一次的第一次触发事件才能被立即执行
			isImmediateInvoke = false
		}, delay)
	}

	// 防抖函数会返回另一个函数，该函数才是真正被调用的函数
	return _debounce
}

export function getKebabCase(str) {
	let temp = str.replace(/[A-Z]/g, function (i) {
		return '_' + i.toLowerCase()
	})
	if (temp.slice(0, 1) === '_') {
		temp = temp.slice(1) //如果首字母是大写，执行replace时会多一个_，需要去掉
	}
	return temp
}
