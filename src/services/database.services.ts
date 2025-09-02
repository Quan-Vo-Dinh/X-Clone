import { Collection, Db, MongoClient } from 'mongodb'
import { config } from 'dotenv'
import { User } from '~/models/schemas/User.schema'
import RefreshToken from '~/models/schemas/RefreshToken.schema'

config() // Load environment variables from .env file

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@x.rb2qk3n.mongodb.net/?retryWrites=true&w=majority&appName=X`

class DatabaseService {
  private client: MongoClient
  private db: Db
  constructor() {
    this.client = new MongoClient(uri)
    this.db = this.client.db(process.env.DB_NAME || 'x-dev')
  }
  async connect() {
    try {
      await this.client.connect()
      await this.db.command({ ping: 1 })
      console.log('✅ Connected to MongoDB!')
    } catch (error) {
      console.error('❌ MongoDB connection failed:', error)
      throw error
    }
  }

  get users(): Collection<User> {
    return this.db.collection(process.env.DB_USERS_COLLECTION as string)
  }

  get refreshTokens(): Collection<RefreshToken> {
    return this.db.collection(process.env.DB_REFRESH_TOKENS_COLLECTION as string)
  }
}

const databaseService = new DatabaseService()
export default databaseService
