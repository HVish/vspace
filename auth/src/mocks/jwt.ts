import { PrivateKey } from '../utils/jwt';

export const mockPrivateKey: PrivateKey = {
  key:
    '-----BEGIN ENCRYPTED PRIVATE KEY-----\n' +
    'MIIBvTBXBgkqhkiG9w0BBQ0wSjApBgkqhkiG9w0BBQwwHAQIjk8vqFVHWq4CAggA\n' +
    'MAwGCCqGSIb3DQIJBQAwHQYJYIZIAWUDBAEqBBANDLxe8m65+QznFNha1WWSBIIB\n' +
    'YKVzbj56xqQPf8lSafLB1vSXK4ROxCTFrJZfv33BKVsf827k3vYceAg7zNGoE4XJ\n' +
    'Ymk0crShWMJBJ/7NkM4qoppTZxBnLl5GLMNs2PlmCyuTxLVK9PGbvIJNHI7PQs/Z\n' +
    '4loFhMN1Y4RgZ/aHogpQdYwLdq7QBtapFZyP5KxJVwPlrfWzsUb2ZxyCX+kbLrRr\n' +
    'y1qal5bZRpaXcYG1LR3w+MMs5+71Gi0mbJzgwHXpNlnymkgY+DAKoTk71I2Z4f9u\n' +
    'oLQd/GDA2HxTRDLZXObGP+4MnyK2U47hzuV9DXRLzhxQe63drf3dQ6kb/uElV4l+\n' +
    'wIm5ijY5scDIwS45MhHJHy+jsMSkSE6NIRg8UaLHWIXgAV6qdDc0UJGZImfsI7XK\n' +
    '67slCVStNwcBlPlIwJO4wd2V7h4Vc3GtCEcnoFB7Vyb2KVjhUU3YpSRd3jzZVtLL\n' +
    'Dr/q4+K9qMM+MynJEaaia2o=\n' +
    '-----END ENCRYPTED PRIVATE KEY-----\n',
  passphrase: 'test-private-key-secret',
};

export const mockRSAKeyPair = {
  privateKey: mockPrivateKey,
  publicKey:
    '-----BEGIN PUBLIC KEY-----\n' +
    'MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAM6Rbn8jEZUVqGtAwzc5Hs/SN0oYIBWG\n' +
    'skax1c3JsrUYfLsDtwPHFsD7W6OeAjG7/lup39yS/mzfBGN/pzwUtusCAwEAAQ==\n' +
    '-----END PUBLIC KEY-----\n',
};
