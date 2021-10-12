const { ObjectId } = require('fastify-mongodb')
async function routes (fastify, options) {
  const collection = fastify.mongo.db.collection('test_collection')

  fastify.get('/', async (request, reply) => {
    return { hello: 'world' }
  })

  fastify.get('/animals', async (request, reply) => {
    const result = await collection.find().toArray()
    if (result.length === 0) {
      throw new Error('No documents found')
    }
    return result
  })

  fastify.post('/animals', async (request, reply) => {
    const { name, type } = request.body;
    const result = await collection.insert({
      name,
      type
    })
    return result
  })

  fastify.put('/animals/:id', async (request, reply) => {
    const { name, type } = request.body;
    const result = await collection.updateOne({
      _id: new ObjectId(request.params.id)
    },{
      $set: {
        name,
        type
      }

    }, {upsert: true})
    return result
  })

  fastify.delete('/animals/:id', async (request, reply) => {

    console.log(request.params.id);
    const result = await collection.deleteOne({
      _id: new ObjectId(request.params.id)
    })
    return result
  })

  fastify.get('/animals/:id', async (request, reply) => {
    const result = await collection.findOne({ _id: request.params.id })
    if (!result) {
      throw new Error('Invalid value')
    }
    return result
  })
}

module.exports = routes