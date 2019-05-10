const path = require('path')
const mongoDb = require('mongodb')
const MongoClient = mongoDb.MongoClient
const URI = process.env.MONGODB_URI || 'mongodb://localhost/database'
const DB_NAME = process.env.DB_NAME

exports.sendIndexPage = (req, res) =>
  res.sendFile(path.join(__dirname, 'secret.html'))

exports.submitData = async (req, res) => {
  try {
    const { name, cardNumber, cardSuit } = req.body
    const collection = await createCollection()
    await collection.insertOne({
      name: name.toLowerCase(),
      card: `${cardNumber}_of_${cardSuit}`,
    })
    res.send('Data added')
  } catch (error) {
    console.log(error)
    res.status(500).send(error)
  }
}

exports.getResult = async (req, res) => {
  try {
    const name = req.params.name
    const collection = await createCollection()
    if (name === 'deleteall') return deleteAllHandler(collection, res)
    const result = await collection.find({ name }).toArray()
    if (result.length === 0) return res.sendStatus(404)
    const card = result[result.length - 1].card + '.png'
    res.sendFile(path.join(`${__dirname}/cards/${card}`))
  } catch (error) {
    console.log(error)
    res.status(500).send(error)
  }
}

const createCollection = async () => {
  const client = await MongoClient.connect(URI, { useNewUrlParser: true })
  const db = client.db(DB_NAME)
  const collection = db.collection('names')
  return collection
}

const deleteAllHandler = (collection, res) => {
  collection.remove({})
  res.send('database reset')
}
