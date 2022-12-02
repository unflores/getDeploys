db.createUser(
  {
    user: "dev",
    pwd: "dev",
    roles: [
      {
        role: "dbOwner",
        db: "stats_development"
      }
    ]
  }
);

db.createUser(
  {
    user: "test",
    pwd: "test",
    roles: [
      {
        role: "dbOwner",
        db: "stats_testing"
      }
    ]
  }
);
