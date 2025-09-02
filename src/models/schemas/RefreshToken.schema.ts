import { ObjectId } from 'mongodb'

interface RefreshTokenType {
  token: string
  _id?: ObjectId
  created_at?: Date
  user_id: ObjectId
}

export default class RefreshToken {
  token: string
  _id?: ObjectId
  created_at?: Date
  user_id: ObjectId

  constructor({ token, _id, created_at, user_id }: RefreshTokenType) {
    this.token = token
    this._id = _id
    this.created_at = created_at || new Date()
    this.user_id = user_id
  }
}
