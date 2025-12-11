const crypto = require('crypto');

const secret = crypto.randomBytes(64).toString('hex');

console.log('\n🔐 Session Secret généré :\n');
console.log(secret);
console.log('\n📋 Ajoutez-le à votre fichier .env.local :');
console.log(`SESSION_SECRET=${secret}\n`);


