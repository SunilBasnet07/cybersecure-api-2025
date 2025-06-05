const userFormatterData=(data)=>{
  return{
    id:data?.id,
    name:data?.name,
    email:data?.email,
    address:data?.address,
    number:data?.number,
    otp:data?.otp,
    assistanceName:data?.assistanceName,
    profileImageUrl:data?.profileImageUrl,
    roles:data?.roles,
    createdAt:data?.createdAt
  }
}

export {userFormatterData}