
export const ImgValidation = (data,img) =>{
    let { type , size } = data
    console.log('aaaa',data)
    if(img == 'thumb')
        {
            if(!type.includes('image')) return 'File Must be Image'
            if(size >= 1024 * 1024 * 5) return 'File Must be Less than 5 Mb'
            
        }   
    else{
        if(img == 'pro') if(size >= 1024 * 1024 * 48) return 'File Must be Less than 50 Mb'
        else if(size >= 1024 * 1024 * 48) return 'File Must be Less than 50 Mb'
       
    }
}