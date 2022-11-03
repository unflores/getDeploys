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
