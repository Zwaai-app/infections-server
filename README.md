Server and Web Frontends for Zwaai.app
======================================
![Backend](https://github.com/svdo/infections-server/workflows/Backend/badge.svg)
![Spaces Frontend](https://github.com/svdo/infections-server/workflows/Spaces%20Frontend/badge.svg)

Development Setup
-----------------

```bash
cd common
yarn
yarn build
yarn link

cd ../backend
yarn
yarn link @zwaai/common

cd ../frontend
yarn
yarn link @zwaai/common
```

Then follow instructions in [frontend](./spaces-fronten/../spaces-frontend/README.md) and [backend](./backend/README.md).
