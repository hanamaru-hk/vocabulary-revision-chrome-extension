# Database

This library is for the operations of chrome extension's indexed database (chrome.storage.indexedDB).

## Schema

```typescript
interface Vocabulary {
    id: string;
    word: string;
    url: string;
    createdAt: Date;
    updatedAt: Date;
}
```

## Operations

It supports the open (add if not existed) and CRUD operations of the Vocabulary interface.