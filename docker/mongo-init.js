db = new Mongo().getDB('stats_development')
db.createUser({
  user: 'conan',
  pwd: 'conan',
  roles: [
    {
      role: 'dbOwner',
      db: 'stats_development',
    },
  ],
})
db = new Mongo().getDB('stats_testing')

db.createUser({
  user: 'conan',
  pwd: 'conan',
  roles: [
    {
      role: 'dbOwner',
      db: 'stats_testing',
    },
  ],
})
