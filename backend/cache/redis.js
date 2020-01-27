// https://github.com/luin/ioredis
const Redis = require('ioredis')
const _ = new Redis()

_.set("foo","bar")