import express from 'express'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'


const prisma = new PrismaClient()
const router = express.Router()
const JWT_SECRET = process.env.JWT_SECRET


// Cadastro

router.post('/cadastro', async (req, res)=>{


    try{
        
        const user = req.body
        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(user.password, salt)


        const userDb = await prisma.users.create ({
    
            data:{
    
                email: user.email,
                name: user.name, 
                password: hashPassword,
    
            },
    
    
    
        })
    
        res.status(201).json(userDb)
    }

    catch(err){
        res.status(500).json({message: "Erro no servidor, tente novamente"})
    }
    
    

    
})



//LOGIN

router.post('/login', async(req, res)=>{

    try{

        const userInfo = req.body

        // Procura usuário no banco de dados
        const user = await prisma.users.findUnique({ 
            
            where: {
                
                email: userInfo.email

        },
    
    })

    // Verifica usuário no banco de dados
    if(!user){
        return res.status(404).json({ message: "Usuário não encontrado" })
    }

    // Compara senha fornecida e armazenada
    const isMatch = await bcrypt.compare(userInfo.password, user.password)


    // Verifica senha
    if(!isMatch){

        return res.status(400).json({message: "Senha inválida"})
    }

    // Gerar o Token JWT
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1m'})


    res.status(200).json(token)
    } catch(err){
        res.status(500).json({message:"Erro no servidor, tente novamente"})
    }


})


export default router