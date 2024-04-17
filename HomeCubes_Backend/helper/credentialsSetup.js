import config from '../config/serverConfig'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
export const bcyptPass = async (data) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const changepassword = await bcrypt.hash(data, salt);
    console.log("changepassword", changepassword)
    return changepassword
  }
  catch (e) {
    return false
  }
}

export const JWT_SIGN = (data, atad) => {
  const token = jwt.sign({ user_id: data, atad }, config.SECRET_KEY);
  return token
}


export const verifyToken = async (req, res, next) => {

  const authToken = req.headers['authorization'];
  const token = (authToken && authToken.split(' ')[1]) ?? authToken;
  console.log("dasdkjashd", authToken, token)

  await jwt.verify(token, config.SECRET_KEY, (err, user) => {
    if (err) return res.status(200).json({ "Status": false, "msg": "Authentication Failed", success: 'error' })
    else {
      console.log("user valid", user)
      return next();
    }
  })
}
