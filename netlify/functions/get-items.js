const fetch = require('node-fetch')

exports.handler = async () => {
  const shopUrl = 'https://netlify-demo.myshopify.com'
  const storefrontAcessToken = 'b98313b8d60c1d61649070cc78cc41da' // Safe to share. This is read-only. Not secret.

  // Assemble the graphql query to fetch info all teh products
  const query = `
    {
      products(sortKey: TITLE, first: 100) {
        edges {
          node {
            id
            handle
            description
            title
            totalInventory
            priceRange {
              maxVariantPrice {
                amount
                currencyCode
              }
              minVariantPrice {
                amount
                currencyCode
              }
            }
            images(first: 1) {
              edges {
                node {
                  src
                  altText
                }
              }
            }
          }
        }
      }
    }
  `

  try {
    const response = await fetch(shopUrl + `/api/unstable/graphql.json`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/graphql',
        'X-Shopify-Storefront-Access-Token': storefrontAcessToken,
      },
      body: query,
    })
      .then((res) => {
        console.log({ res })
        return res.json()
      })
      .then((response) => {
        console.log({ response })
        return response.data.products.edges
      })

    return {
      statusCode: 200,
      body: JSON.stringify(response),
    }
  } catch (error) {
    console.error(error)
  }
}
