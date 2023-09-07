## Payout Strategy

**Fetching the payout data for a round**

```graphql
{
  rounds(first: 5) {
    payoutStrategy {
      ...on MerklePayout {
        id
        strategyName
      }
      ...on DirectPayout {
        id
        strategyName
      }
    }
  }
}
```
