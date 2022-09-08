const express=require('express')
const { Router }=express
const ContenedorFile=require('../b4.contenedores/contenedorFile')
const contenedorFileChatBasic=new ContenedorFile('chatMensajes.json')
const apiRouterMant=Router(); 
/*
apiRouterMant.get('/comentarios/file', async (req, res) => {
    await contenedorFileChat.init();
    let contenedorVar=await contenedorFileChat.getAll();
    console.log("contenedorVar.comentariosFile.RouterGet",contenedorVar)
    res.json(contenedorVar)
    console.log("Enviado.comentariosFile.RouterGet")
});

apiRouterMant.post('/comentarios/file',async (req,res)=>{
    console.log("apiRouterMant.post")
    const dataBody=req.body;
    console.log("username-text.comentariosFile.routerPost",dataBody)
    await contenedorFileChat.save(dataBody);
    console.log("Guardado.comentariosFile.routerPost")
})

*/

apiRouterMant.get('/comentarios/file', async (req, res) => {
    //await contenedorFileChatBasic.init();
    let contenedorVar=await contenedorFileChatBasic.getAll();
    //let contenedorVar=await DAO.chatAdv.getAll();
    console.log("contenedorVar.comentariosFile.RouterGet",contenedorVar)
    res.json(contenedorVar)
    console.log("Enviado.comentariosFile.RouterGet")
});


apiRouterMant.post('/comentarios/file',async (req,res)=>{
    const mensajeRecibido=req.body;
    //const {nombre,edad,correo,textoIngresado}=req.body;
    console.log("username-text.comentariosFile.routerPost",mensajeRecibido)
    await contenedorFileChatBasic.save(mensajeRecibido);
    console.log("Guardado.comentariosFile.routerPost")
})

module.exports=apiRouterMant