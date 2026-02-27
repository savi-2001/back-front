import path from 'path'
import fs from 'fs'

const RSA_PUBLIC_KEY = fs.readFileSync(
	path.join(__dirname, '..', '..', '..', '..', '..', '..', 'keys', 'public.pem'),
)
const RSA_PRIVATE_KEY = fs.readFileSync(
	path.join(__dirname, '..', '..', '..', '..', '..', '..', 'keys', 'private.pem'),
)

export function getRsaPublicKey() {
	return RSA_PUBLIC_KEY
}

export function getRsaPrivateKey() {
	return RSA_PRIVATE_KEY
}
