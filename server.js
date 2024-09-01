import express from 'express'
import publicroutes from './routes/public.js'
import privateroutes from './routes/private.js'
import auth from './middlewares/auth.js'

const app = express()
app.use(express.json())
app.use('/', publicroutes)
app.use('/', auth, privateroutes)



/* 3 rotas

Publicas
        Cadastrar, Login

Privada 
         Listar usuários






*/ 



app.listen(3000, ()=> console.log("Servidor está rodando"))

