module.exports = {
    mongo: {
        connectionString: {
            development: 'mongodb+srv://lab:lab@cluster0.eoi97.mongodb.net/e-wallet-dev',
            production: 'mongodb+srv://lab:lab@cluster0.eoi97.mongodb.net/e-wallet',
        },
    },
    mailer: {
        gmail: {
            username: 'ewallet.bktttteam@gmail.com',
            password: 'kijhfmixoslccupk',
        }
    },
    session: {
        key: 'bkttt'
    }
}