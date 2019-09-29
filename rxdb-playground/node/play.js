const RxDB = require('rxdb')
const repl = require('repl')

RxDB.plugin(require('pouchdb-adapter-leveldb'))
const jsonDown = require('jsondown')

async function main() {
  const db = await RxDB.create({
    name: './.db/heroDb', // <- name
    adapter: jsonDown, // <- storage-adapter
    password: 'myPassword' // <- password (optional)
  })
  createSchema(db)

  global.db = db
  repl.start({
    useGlobal: true
  })
}

async function createSchema(db) {
  const myHeroSchema = {
    title: 'hero schema',
    version: 0,
    description: 'describes a simple hero',
    type: 'object',
    properties: {
      name: {
        type: 'string',
        primary: true
      },
      color: {
        type: 'string'
      },
      healthpoints: {
        type: 'number',
        min: 0,
        max: 100
      },
      secret: {
        type: 'string',
        encrypted: true
      },
      birthyear: {
        type: 'number',
        final: true,
        min: 1900,
        max: 2050
      },
      skills: {
        type: 'array',
        maxItems: 5,
        uniqueItems: true,
        items: {
          type: 'object',
          properties: {
            name: {
              type: 'string'
            },
            damage: {
              type: 'number'
            }
          }
        }
      }
    },
    required: ['color'],
    attachments: {
      encrypted: true
    }
  }
  await db.collection({
    name: 'heroes',
    schema: myHeroSchema
  })
  console.dir(db.heroes.name)
}

main()
