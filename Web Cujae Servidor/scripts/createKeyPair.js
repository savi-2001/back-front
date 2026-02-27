/* eslint-disable @typescript-eslint/no-var-requires */
const keypair = require('keypair')
const fs = require('fs')

const keySize = 512
const keyDirectory = 'keys'

const pair = keypair({
	bits: keySize,
})
console.log(pair)

if (!fs.existsSync(keyDirectory)) {
	fs.mkdirSync(keyDirectory)
}

fs.writeFileSync(keyDirectory + '/private.pem', pair.private)
fs.writeFileSync(keyDirectory + '/public.pem', pair.public)
