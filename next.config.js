const { withTsGql } = require('@ts-gql/next');

module.exports = withTsGql({
  async rewrites() {
    return [
      {
        source: '/api/graphql',
        destination: 'http://localhost:3000/api/graphql',
      },
    ];
  }
});
