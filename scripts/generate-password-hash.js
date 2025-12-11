const argon2 = require('argon2');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('Entrez le mot de passe: ', async (password) => {
    try {
        const hash = await argon2.hash(password, {
            type: argon2.argon2id,
            memoryCost: 65536,
            timeCost: 3,
            parallelism: 4
        });

        const encodedHash = Buffer.from(hash).toString('base64');

        console.log('\n🔐 Hash généré (encodé en base64) :\n');
        console.log(encodedHash);
        console.log('\n📋 Ajoutez cette ligne à votre fichier .env.local :');
        console.log('\n' + '='.repeat(80));
        console.log(`PROTECTION_PASSWORD_HASH=${encodedHash}`);
        console.log('='.repeat(80) + '\n');
        console.log('✅ Le hash est encodé en base64 pour éviter les problèmes avec les caractères spéciaux');
        console.log('   - Pas besoin de guillemets');
        console.log('   - Pas d\'espaces avant ou après');
        console.log('   - Tout sur une seule ligne\n');
    } catch (error) {
        console.error('Erreur :', error);
    }
    rl.close();
});