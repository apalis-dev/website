# Apalis Website and Documentation

## Website

View the deployed project: [Website](https://apalis.dev)


## Local Installation

This project requires `cargo` and `node.js` to be installed.

Clone the project:

    git clone git@github.com:apalis-dev/website.git

Install dependencies:

    yarn

Run dev server:

    yarn dev


## Development

This project includes a way to build code examples to ensure that they can compile eg:
```
\```rust name="push" mode="inline"
let task = Email {
    recipient: "main@example.com".to_string(),
    message: "Welcome to our new service".to_string()
};
storage.push(task).await?;
\```
```

```
\```rust fileName="main.rs" mode="compile"
use apalis::prelude::*;

#[tokio::main]
async fn main() -> Result<(), BoxDynError> {
    let mut storage = MemoryStorage::new();
    
    // [!code inline:push]
}
\```
```
This would generate:


```rust fileName="main.rs" mode="compile"
use apalis::prelude::*;

#[tokio::main]
async fn main() -> Result<(), BoxDynError> {
    let mut storage = MemoryStorage::new();

    let task = Email {
        recipient: "main@example.com".to_string(),
        message: "Welcome to our new service".to_string()
    };
    storage.push(task).await?;
}
```
