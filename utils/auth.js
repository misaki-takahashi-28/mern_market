const jwt = require('jsonwebtoken');
const secret_key = 'mern_market';
const auth = async (req, res, next) => {
  if (req.method === 'GET') {
    //GETの場合はログイン判定が不要なのでそのまま次に進む
    return next();
  }
  //tokenの取得（header内のauthorizationの中身）

  const token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InVzZXIxX2VtYWlsIiwiaWF0IjoxNjk3OTgxNjk0LCJleHAiOjE2OTgwNjQ0OTR9.Ql3K09UTH19J0h02Qs_VPZxoJ9HTHESydja1uhLTUJQ';
  //   const token = await req.header.authorization.spilit('')[1];
  if (!token) {
    return res.status(400).json({ message: 'token is not found' });
  }
  try {
    const decoded = jwt.verify(token, secret_key);
    req.body.email = decoded.email;
    return next();
  } catch (err) {
    return res.status(400).json({ message: 'token is invalied' });
  }
};

module.exports = auth;
