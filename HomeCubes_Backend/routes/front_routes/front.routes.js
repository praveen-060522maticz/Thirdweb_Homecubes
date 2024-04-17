import express from 'express'
import userRouter from './user.routes' 
import nftRouter from './nft.routes'


const frontRouter = express()

frontRouter.use('/user',userRouter);
frontRouter.use('/nft',nftRouter);



export default frontRouter