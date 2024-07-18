/* eslint-disable no-useless-catch */
import { slugify } from '~/utils/formatters'
import { boardModel } from '~/models/boardModel'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import { cloneDeep } from 'lodash'

const createNew = async (reqBody) => {
  try {
    const newBoard = {
      ...reqBody,
      slug: slugify(reqBody.title)
    }

    const createBoard = await boardModel.createNew(newBoard)
    const getNewBoard = await boardModel.findOneById(createBoard.insertedId)
    return getNewBoard
  } catch (error) { throw error }
}
const getDetails = async (boardId) => {
  try {
    const board = await boardModel.getDetails(boardId)
    if (!board) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Board not found!')
    }

    const resBoard = cloneDeep(board)
    resBoard.columns.forEach(column => {
      // Cách khác: dùng .equals là bởi vì ObjectId trong MongoDB có support method .equals
      // column.cards = resBoard.cards.filter(card => card.columnId.equals(column._id))
      column.cards = resBoard.cards.filter(card => card.columnId.toString() === column._id.toString())
    })
    delete resBoard.cards

    return resBoard
  } catch (error) { throw error }
}

export const boardService = {
  createNew,
  getDetails
}