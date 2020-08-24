Server and Web Frontends for Zwaai.app
======================================
![Backend](https://github.com/Zwaai-app/infections-server/workflows/Backend/badge.svg)
![Spaces Frontend](https://github.com/Zwaai-app/infections-server/workflows/Spaces%20Frontend/badge.svg)

NOTICE: Discontinued
--------------------

We firmly believe that Zwaai.app implements an interesting and relevant approach
to digital contact tracing. Because of a shift in priorities and available time,
we are stopping the development of this solution. If you are interested in
taking over, please get in touch.

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
