

# The Print 📜 news app

![GitHub stars](https://img.shields.io/github/stars/vj-abishek/news-app) ![GitHub contributors](https://img.shields.io/github/contributors/vj-abishek/news-app) ![GitHub issues](https://img.shields.io/github/issues/vj-abishek/news-app)

The privacy focused news app made for ibm cloud

![Screenshot from 2022-11-19 12-01-33](https://user-images.githubusercontent.com/98735587/202838106-7ed006ad-ae5e-45ba-847d-41e7d78fe6bb.png)


This live version of the app can be found in [theprint.me](https://theprint.me)

This full source code of the app can be found at https://github.com/vj-abishek/news-app

### Features

- [x] News at your finger tips
- [x] Sleek UI
- [x] Light weight app
- [x] Bookmark your news and get back to it later
- [x] Automagic regional news
- [x] Select news based on topic
- [x] Change language any time



### Team members
- [Abishek P.Y](https://github.com/vj-abishek)
- [Arun Kumar](https://github.com/Arunkumaryegappan)
- [Mohammed Amiz](https://github.com/Amiz16)
- [Jachin I](https://github.com/Jack-in)


### Technologies used
- Framework - [Next js](https://nextjs.org/)
- CSS framework - [Tailwind CSS](https://tailwindcss.com/)
- UI Library - [Daisy UI](https://daisyui.com/)
- Backend Framework - [Flask](https://flask.palletsprojects.com/en/2.2.x/)
- Database - [IBM DB2](https://github.com/ibmdb/python-ibmdb)
- Docker - [Docker](https://www.docker.com/)
- Auth - [Next Auth](https://next-auth.js.org/)
- Container Registery- [IBM Container Registery](https://cloud.ibm.com/registry/repos)
- Container Orchestration - [kubernetes](https://kubernetes.io/)
- Type safety - [Typescript](https://www.typescriptlang.org/)


### Folder structure

```bash

├── backend
│   ├── Dockerfile
│   ├── kubernetes
│   │   └── config.yaml
│   ├── requirements.txt
│   ├── server.py
│   └── wsgi.py
├── components
│   ├── bottomNav.tsx
├── pages
│   ├── api
│   │   ├── auth
│   │   │   └── [...nextauth].js
│   │   ├── headlines.ts
│   │   ├── next.ts
│   │   └── proxy.ts
│   ├── _app.tsx
│   ├── bookmarks.tsx
│   └── index.tsx
├── styles
      └── globals.css
```

- `backend` - Consists of the flask server
- `backend/kubernetes` - Kubernetes config file (Deployment, Service ,Ingress)
- `components` - Components for the frontend
- `pages` - File based routing
- `pages/api` - The api route for the frontend (headlines, next - pagination, proxy - for the server)
- `pages/auth` - The route used for authentication
- `styles` - The global styles for the app

### Frotend setup

- Install node js - [Node js](https://nodejs.org/en/)
- Add necessary values in the env - [Sample env](https://github.com/vj-abishek/news-app/blob/main/.env.sample)
- To install dependency - `npm install`


To run the developmen server:

```bash
npm run dev
# or
yarn dev
```

### Backend setup

- Install python - [Python Installation](https://www.python.org/)
- Install dependency - `python -m pip install -r requirements.txt`
- To run the app - `python server.py`


### Screenshots

<p align="center">
    <img style="width: 350px; height: 700px" src="https://user-images.githubusercontent.com/90566952/202840754-ee9cdfcd-b9af-4341-a281-d305ea3259bb.png">
    <img style="width: 350px; height: 700px"  src="https://user-images.githubusercontent.com/90566952/202840764-30d76ca3-9871-41e9-bb3a-17621f8634d0.png">
    <img style="width: 350px; height: 700px"  src="https://user-images.githubusercontent.com/90566952/202840792-472500f2-5248-494b-9a89-166ecaa00e7b.png">
    <img style="width: 350px; height: 700px"  src="https://user-images.githubusercontent.com/90566952/202840811-6b96e869-2fb3-45de-9645-8d79346a2471.png">
</p>



### Copyright

Licensed under the [GNU General Public License v2.0](LICENSE)
