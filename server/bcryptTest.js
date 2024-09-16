const bcrypt = require('bcryptjs');

// Manually hash a known password
const plainTextPassword = 'Hello123';
bcrypt.hash(plainTextPassword, 10, (err, hash) => {
  if (err) throw err;
  console.log('Manually hashed password:', hash);

  // Compare the manually hashed password with the stored hash
  const storedHash = '$2a$10$Ilqwy43ck9HVepympbvsjeU62gT4O/sQmWdDeorTn7WFSgRr.GnYO';
  bcrypt.compare(plainTextPassword, storedHash, (err, result) => {
    if (err) throw err;
    console.log('Manual password comparison result:', result);
  });
});
