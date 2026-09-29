export default () => ({

    omdb: {
        apiKey: process.env.OMDB_KEY ?? '',
        baseUrl: process.env.OMDB_BASE_URL ?? 'https://www.omdbapi.com/',
        maxRequestsPerSecond: parseInt(
            process.env.OMDB_MAX_REQUESTS_PER_SECOND ?? '2',
            10,
        ),
    },
    cache: {
        ttlSeconds: parseInt(process.env.CACHE_TTL_SECONDS ?? '3600', 10),
    },
    jwt: {
        secret: process.env.JWT_SECRET ?? 'dev-secret-change-me',
        expiresIn: parseInt(process.env.JWT_EXPIRES_IN_SECONDS ?? '86400', 10), // 86400s = 1 dzień
    },
})