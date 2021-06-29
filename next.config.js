module.exports = {
  async rewrites() {
    return [
      {
        source: '/api/graphql',
        destination: 'http://localhost:3000/api/graphql',
      },
    ];
  },
};
