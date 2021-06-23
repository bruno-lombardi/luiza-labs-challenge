import { Collection, MongoClient, ObjectID } from 'mongodb'

export const mongoHelper = {
  client: (null as unknown) as MongoClient,
  uri: (null as unknown) as string,

  async connect(uri: string): Promise<void> {
    this.uri = uri
    this.client = await MongoClient.connect(this.uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
  },

  async disconnect(): Promise<void> {
    if (this.client !== null) {
      await this.client.close()
      this.client = null as any
    }
  },

  async getCollection(name: string): Promise<Collection> {
    if (!this.client?.isConnected()) {
      await this.connect(this.uri)
    }
    return this.client.db().collection(name)
  },

  map<T>(document: any): T {
    if (document) {
      const _id = document._id as ObjectID
      let convertedId: string
      if (_id) {
        convertedId = _id.toHexString()
        Reflect.deleteProperty(document, '_id')
      } else {
        convertedId = document.id
      }

      return { id: convertedId, ...document }
    }
    return null
  }
}
